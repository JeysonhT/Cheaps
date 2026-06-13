import { getDb } from "@/lib/SqliteHelper";
import { CreateDebtDTO, DebtWithCreditor } from "@/types";

export interface DbDebtRow {
  id: number;
  id_creditor: number | null;
  type: string;
  pay_frecuency: number;
  name: string;
  debt_date: string;
  amount: number;
  current_amount: number;
  creditor_name: string | null;
  creditor_phone: string | null;
}

export const debtService = {
  async getAll(): Promise<DebtWithCreditor[]> {
    const db = await getDb();
    const rows = await db.getAllAsync<DbDebtRow>(`
      SELECT 
        d.id, 
        d.id_creditor, 
        d.type, 
        d.pay_frecuency, 
        d.name, 
        d.debt_date, 
        d.amount, 
        d.current_amount,
        c.name AS creditor_name,
        c.phone_number AS creditor_phone
      FROM debts d
      LEFT JOIN creditor c ON d.id_creditor = c.id
      ORDER BY d.id DESC
    `);

    return rows.map((row) => ({
      id: row.id,
      idCreditor: row.id_creditor,
      type: row.type as any,
      payFrecuency: row.pay_frecuency,
      name: row.name,
      debtDate: row.debt_date,
      amount: row.amount,
      currentAmount: row.current_amount,
      creditor: row.id_creditor
        ? {
            name: row.creditor_name || "",
            phoneNumber: row.creditor_phone,
          }
        : null,
    }));
  },

  async create(dto: CreateDebtDTO): Promise<DebtWithCreditor> {
    const db = await getDb();
    try {
      const result = await db.runAsync(
        `INSERT INTO debts (id_creditor, type, pay_frecuency, name, debt_date, amount, current_amount) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
        dto.idCreditor ?? null,
        dto.type ?? "personal",
        dto.payFrecuency ?? 30,
        dto.name ?? "",
        dto.debtDate ?? new Date().toISOString().split("T")[0],
        dto.amount ?? 0,
        dto.currentAmount ?? 0,
      );

      // Si hay un acreedor, buscar sus datos para la respuesta
      let creditorInfo = null;
      if (dto.idCreditor) {
        const cred = await db.getFirstAsync<{
          name: string;
          phone_number: string | null;
        }>(
          "SELECT name, phone_number FROM creditor WHERE id = ?",
          dto.idCreditor,
        );
        if (cred) {
          creditorInfo = {
            name: cred.name,
            phoneNumber: cred.phone_number,
          };
        }
      }

      return {
        id: result.lastInsertRowId,
        idCreditor: dto.idCreditor ?? null,
        type: dto.type ?? "personal",
        payFrecuency: dto.payFrecuency ?? 30,
        name: dto.name ?? "",
        debtDate: dto.debtDate ?? new Date().toISOString().split("T")[0],
        amount: dto.amount ?? 0,
        currentAmount: dto.currentAmount ?? 0,
        creditor: creditorInfo,
      };
    } catch (e) {
      let error = e as Error;
      console.log(error.message);
      throw e;
    }
  },

  async delete(id: number): Promise<void> {
    const db = await getDb();
    // También borrar pagos de deudas asociados si existen (para mantener consistencia referencial)
    await db.runAsync("DELETE FROM pay_debt WHERE id_debt = ?", id);
    await db.runAsync("DELETE FROM debts WHERE id = ?", id);
  },
};

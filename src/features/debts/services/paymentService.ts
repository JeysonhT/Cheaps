import { getDb } from "@/lib/SqliteHelper";
import { PayDebt, CreatePayDebtDTO } from "@/types";

export interface DbPayDebtRow {
  id: number;
  id_debt: number;
  reference: string | null;
  amount: number;
  pay_date: string;
}

export const paymentService = {
  async getForDebt(debtId: number): Promise<PayDebt[]> {
    const db = await getDb();
    const rows = await db.getAllAsync<DbPayDebtRow>(
      "SELECT id, id_debt, reference, amount, pay_date FROM pay_debt WHERE id_debt = ? ORDER BY pay_date DESC",
      debtId
    );
    return rows.map((row) => ({
      id: row.id,
      idDebt: row.id_debt,
      reference: row.reference,
      amount: row.amount,
      payDate: row.pay_date,
    }));
  },

  async create(dto: CreatePayDebtDTO): Promise<PayDebt> {
    const db = await getDb();
    
    // Ejecutar en una transacción para mantener la consistencia
    // (abrir transacción usando sql ya que expo-sqlite soporta transacciones)
    await db.execAsync("BEGIN TRANSACTION");
    try {
      const result = await db.runAsync(
        "INSERT INTO pay_debt (id_debt, reference, amount, pay_date) VALUES (?, ?, ?, ?)",
        dto.idDebt,
        dto.reference || null,
        dto.amount,
        dto.payDate
      );
      
      // Restar el monto pagado del saldo pendiente actual de la deuda
      await db.runAsync(
        "UPDATE debts SET current_amount = MAX(0, current_amount - ?) WHERE id = ?",
        dto.amount,
        dto.idDebt
      );
      
      await db.execAsync("COMMIT");
      
      return {
        id: result.lastInsertRowId,
        idDebt: dto.idDebt,
        reference: dto.reference || null,
        amount: dto.amount,
        payDate: dto.payDate,
      };
    } catch (e) {
      await db.execAsync("ROLLBACK");
      throw e;
    }
  },
};

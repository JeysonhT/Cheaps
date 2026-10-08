import { getDb } from "@/lib/SqliteHelper";
import type { PayDebtWithDebt } from "@/types";

interface DbHistoryRow {
  id: number;
  id_debt: number;
  reference: string | null;
  amount: number;
  pay_date: string;
  debt_name: string;
  debt_type: string;
  debt_amount: number;
}

export const historyService = {
  async getAllPayments(): Promise<PayDebtWithDebt[]> {
    const db = await getDb();
    const rows = await db.getAllAsync<DbHistoryRow>(`
      SELECT 
        p.id,
        p.id_debt,
        p.reference,
        p.amount,
        p.pay_date,
        d.name AS debt_name,
        d.type AS debt_type,
        d.amount AS debt_amount
      FROM pay_debt p
      JOIN debts d ON p.id_debt = d.id
      ORDER BY p.pay_date DESC
    `);

    return rows.map((row) => ({
      id: row.id,
      idDebt: row.id_debt,
      reference: row.reference,
      amount: row.amount,
      payDate: row.pay_date,
      debt: {
        name: row.debt_name,
        type: row.debt_type as any,
        amount: row.debt_amount,
      },
    }));
  },
};

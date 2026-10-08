import { getDb } from "@/lib/SqliteHelper";

export interface UserStats {
  maxDebtMonth: number;
  maxDebtMonthLastUpdated: string;
}

export const userService = {
  async getStats(): Promise<UserStats> {
    const db = await getDb();
    const row = await db.getFirstAsync<{
      maxDebtMonth: number;
      maxDebtMonthLastUpdated: string;
    }>("SELECT maxDebtMonth, maxDebtMonthLastUpdated FROM user WHERE id = 1");
    if (!row) {
      return { maxDebtMonth: 0, maxDebtMonthLastUpdated: "" };
    }
    return {
      maxDebtMonth: row.maxDebtMonth,
      maxDebtMonthLastUpdated: row.maxDebtMonthLastUpdated,
    };
  },

  async updateStats(
    maxDebtMonth: number,
    lastUpdatedMonth: string,
  ): Promise<void> {
    const db = await getDb();
    await db.runAsync(
      "UPDATE user SET maxDebtMonth = ?, maxDebtMonthLastUpdated = ? WHERE id = 1",
      maxDebtMonth,
      lastUpdatedMonth,
    );
  },

  async getUserName(): Promise<{ name: string; lastName: string }> {
    const db = await getDb();
    const row = await db.getFirstAsync<{ name: string; lastName: string }>(
      "SELECT name, last_name as lastName FROM user WHERE id = 1",
    );
    if (!row) {
      return { name: "", lastName: "" };
    }
    return {
      name: row.name,
      lastName: row.lastName,
    };
  },
};

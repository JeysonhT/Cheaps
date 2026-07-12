import { getDb } from "@/lib/SqliteHelper";

const creditorService = {
  checkCreditors: async () => {
    const db = await getDb();

    const response = await db.getFirstAsync<{ totalCreditors: number }>(`
        SELECT COUNT(*) AS totalCreditors FROM creditor;
    `);

    if (!response) {
      return { totalCreditors: 0 };
    }

    return { totalCreditors: response.totalCreditors };
  },
};

export default creditorService;

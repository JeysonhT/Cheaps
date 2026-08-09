import { getDb } from "@/lib/SqliteHelper";

export async function getInit(): Promise<{ welcomePassed: boolean }> {
  const db = await getDb();

  const row = await db.getFirstAsync<{ welcomePassed: boolean }>(
    `SELECT welcomePassed FROM app WHERE id = 1`,
  );

  if (!row) {
    return { welcomePassed: false };
  }

  return {
    welcomePassed: row.welcomePassed,
  };
}

export async function setInitState(
  isInit: boolean,
  name?: string,
  lastName?: string,
): Promise<{ welcomePassed: boolean }> {
  const db = await getDb();

  const result = await db.getFirstAsync<{ name: string }>(
    `
    INSERT INTO user (id, name, last_name, person_id, phone_number, email, role, maxDebtMonth, maxDebtMonthLastUpdated)
    VALUES (1, ?, ?, '00000000', '00000000', 'demo@cheaps.com', 2, 0, '')
    RETURNING name;
    `,
    name || "user",
    lastName || "lastName",
  );

  if (!result?.name) {
    return { welcomePassed: false };
  }

  const row = await db.getFirstAsync<{ welcomePassed: boolean }>(
    `UPDATE app
    SET welcomePassed = ?
    WHERE id = 1
    RETURNING welcomePassed;`,
    isInit,
  );

  if (!row) {
    return { welcomePassed: false };
  }

  return {
    welcomePassed: row.welcomePassed,
  };
}

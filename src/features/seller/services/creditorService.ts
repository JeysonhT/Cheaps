import { getDb } from "@/lib/SqliteHelper";
import type { CreateCreditorDTO, Creditor } from "@/types";

export interface DbCreditor {
	id: number;
	name: string;
	phone_number: string | null;
}

export const creditorService = {
	async getAll(): Promise<Creditor[]> {
		const db = await getDb();
		const rows = await db.getAllAsync<DbCreditor>(
			"SELECT id, name, phone_number FROM creditor ORDER BY name ASC",
		);
		return rows.map((row) => ({
			id: row.id,
			name: row.name,
			phoneNumber: row.phone_number,
		}));
	},

	async getById(id: number): Promise<Creditor | null> {
		const db = await getDb();
		const row = await db.getFirstAsync<DbCreditor>(
			"SELECT id, name, phone_number FROM creditor WHERE id = ?",
			id,
		);
		if (!row) return null;
		return {
			id: row.id,
			name: row.name,
			phoneNumber: row.phone_number,
		};
	},

	async create(dto: CreateCreditorDTO): Promise<Creditor> {
		const db = await getDb();
		const result = await db.runAsync(
			"INSERT INTO creditor (name, phone_number) VALUES (?, ?)",
			dto.name,
			dto.phoneNumber || null,
		);
		return {
			id: result.lastInsertRowId,
			name: dto.name,
			phoneNumber: dto.phoneNumber || null,
		};
	},

	async update(id: number, dto: Partial<CreateCreditorDTO>): Promise<void> {
		const db = await getDb();

		const fields: string[] = [];
		const values: any[] = [];

		if (dto.name !== undefined) {
			fields.push("name = ?");
			values.push(dto.name);
		}
		if (dto.phoneNumber !== undefined) {
			fields.push("phone_number = ?");
			values.push(dto.phoneNumber || null);
		}

		if (fields.length === 0) return;

		values.push(id);
		await db.runAsync(
			`UPDATE creditor SET ${fields.join(", ")} WHERE id = ?`,
			...values,
		);
	},

	async delete(id: number): Promise<void> {
		const db = await getDb();
		await db.runAsync("DELETE FROM creditor WHERE id = ?", id);
	},
};

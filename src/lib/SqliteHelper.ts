import * as SQLite from "expo-sqlite";

const DB_NAME = "cheaps.db";

export async function migrateDbIfNeeded(db: SQLite.SQLiteDatabase) {
  const DATABASE_VERSION = 4;

  const result = await db.getFirstAsync<{
    user_version: number;
  }>("PRAGMA user_version");

  let user_version = result?.user_version ?? 0;

  if (user_version >= DATABASE_VERSION) {
    return;
  }

  // Migración v0 → v1 (esquema original, mantenido por compatibilidad)
  if (user_version === 0) {
    await db.execAsync(`PRAGMA journal_mode = 'wal';
      CREATE TABLE IF NOT EXISTS user (
        id           INTEGER PRIMARY KEY NOT NULL,
        name         TEXT    NOT NULL,
        last_name    TEXT    NOT NULL,
        person_id    TEXT    NOT NULL,
        phone_number TEXT    NOT NULL,
        email        TEXT
      );`);

    user_version = 1;
  }

  // Migración v1 → v2 (nuevo esquema completo MVP)
  if (user_version === 1) {
    await db.execAsync(`
      -- Habilitar claves foráneas
      PRAGMA foreign_keys = ON;

      -- Tabla de roles
      CREATE TABLE IF NOT EXISTS roles (
        id   INTEGER PRIMARY KEY NOT NULL,
        name TEXT    NOT NULL
      );

      -- Tabla de acreedores
      CREATE TABLE IF NOT EXISTS creditor (
        id           INTEGER PRIMARY KEY NOT NULL,
        name         TEXT    NOT NULL,
        phone_number TEXT
      );

      -- Tipos de deuda (enumerado como texto)
      -- Valores posibles: 'personal', 'tarjeta', 'hipoteca', 'auto', 'otro'

      -- Tabla de deudas
      CREATE TABLE IF NOT EXISTS debts (
        id             INTEGER PRIMARY KEY NOT NULL,
        id_creditor    INTEGER REFERENCES creditor (id),
        type           TEXT    NOT NULL,
        pay_frecuency  INTEGER NOT NULL,
        name           TEXT    NOT NULL,
        debt_date      TEXT    NOT NULL,
        amount         REAL    NOT NULL,
        current_amount REAL    NOT NULL
      );

      -- Tabla de pagos de deuda
      CREATE TABLE IF NOT EXISTS pay_debt (
        id        INTEGER PRIMARY KEY NOT NULL,
        id_debt   INTEGER NOT NULL REFERENCES debts (id),
        reference TEXT,
        amount    REAL    NOT NULL,
        pay_date  TEXT    NOT NULL
      );

      -- Agregar columna role a user (si no existe)
      ALTER TABLE user ADD COLUMN role INTEGER REFERENCES roles (id);
    `);

    // Seed: roles iniciales
    await db.runAsync(
      `INSERT OR IGNORE INTO roles (id, name) VALUES (?, ?)`,
      1,
      "ADMIN",
    );
    await db.runAsync(
      `INSERT OR IGNORE INTO roles (id, name) VALUES (?, ?)`,
      2,
      "USER",
    );

    user_version = 2;
  }

  // Migración v2 → v3 (Agregar maxDebtMonth a user)
  if (user_version === 2) {
    await db.execAsync(`
      ALTER TABLE user ADD COLUMN maxDebtMonth REAL DEFAULT 0;
      ALTER TABLE user ADD COLUMN maxDebtMonthLastUpdated TEXT DEFAULT '';
      
      INSERT OR IGNORE INTO user (id, name, last_name, person_id, phone_number, email, role, maxDebtMonth, maxDebtMonthLastUpdated)
      VALUES (1, 'Usuario', 'Demo', '00000000', '00000000', 'demo@cheaps.com', 2, 0, '');
    `);

    user_version = 3;
  }

  if (user_version === 3) {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS app(
      id INTEGER PRIMARY KEY NOT NULL,
      welcomePassed boolean NOT NULL UNIQUE
      )`);

    await db.runAsync(
      `INSERT OR IGNORE INTO app (id, welcomePassed) VALUES (?,?)`,
      1,
      false,
    );

    user_version = 4;
  }

  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

export function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (dbPromise) {
    return dbPromise;
  }

  dbPromise = (async () => {
    try {
      // openDatabaseAsync es asíncrono y devuelve una promesa.
      const dbInstance = await SQLite.openDatabaseAsync(DB_NAME);
      await migrateDbIfNeeded(dbInstance);
      console.log("Base de datos abierta y migrada exitosamente");
      return dbInstance;
    } catch (error) {
      dbPromise = null; // Permitir reintento si falla
      console.error("Error abriendo o migrando la base de datos:", error);
      throw error;
    }
  })();

  return dbPromise;
}

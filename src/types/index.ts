// ============================================================
// ENUMS / LITERALS
// ============================================================

/** Tipos de deuda disponibles en el sistema. */
export type DebtType =
  | "personal"
  | "tarjeta"
  | "hipoteca"
  | "auto"
  | "servicio"
  | "otro";

// ============================================================
// ROLES
// ============================================================

/** Modelo completo de un rol. */
export interface Role {
  id: number;
  name: string;
}

/** DTO para crear un rol. */
export type CreateRoleDTO = Omit<Role, "id">;

/** DTO para actualizar un rol. */
export type UpdateRoleDTO = Partial<CreateRoleDTO> & { id: number };

// ============================================================
// USER
// ============================================================

/** Modelo completo de un usuario. */
export interface User {
  id: number;
  name: string;
  /** Apellido del usuario. Equivale a `last_name` en la DB. */
  lastName: string;
  personId: string;
  phoneNumber: string;
  role: number | null;
  email: string | null;
}

/** DTO para crear un usuario. */
export type CreateUserDTO = Omit<User, "id">;

/** DTO para actualizar un usuario (todos los campos opcionales excepto id). */
export type UpdateUserDTO = Partial<CreateUserDTO> & { id: number };

// ============================================================
// CREDITOR
// ============================================================

/** Modelo completo de un acreedor. */
export interface Creditor {
  id: number;
  name: string;
  phoneNumber: string | null;
}

/** DTO para crear un acreedor. */
export type CreateCreditorDTO = Omit<Creditor, "id">;

/** DTO para actualizar un acreedor. */
export type UpdateCreditorDTO = Partial<CreateCreditorDTO> & { id: number };

// ============================================================
// DEBTS
// ============================================================

/** Modelo completo de una deuda. */
export interface Debt {
  id: number;
  /** FK → creditor.id  (puede ser null en el MVP sin acreedores activos). */
  idCreditor: number | null;
  type: DebtType;
  /** Frecuencia de pago en días (ej: 30 = mensual, 7 = semanal). */
  payFrecuency: number;
  name: string;
  /** Fecha en que se contrajo la deuda (ISO 8601 string). */
  debtDate: string;
  /** Monto original de la deuda. */
  amount: number;
  /** Saldo pendiente actual. */
  currentAmount: number;
}

/** DTO para crear una deuda. */
export type CreateDebtDTO = Omit<Debt, "id">;

/** DTO para actualizar una deuda. */
export type UpdateDebtDTO = Partial<CreateDebtDTO> & { id: number };

// ============================================================
// PAY_DEBT (Pagos de deuda)
// ============================================================

/** Modelo completo de un pago de deuda. */
export interface PayDebt {
  id: number;
  /** FK → debts.id */
  idDebt: number;
  /** Número o código de referencia del pago. */
  reference: string | null;
  amount: number;
  /** Fecha y hora del pago (ISO 8601 string). */
  payDate: string;
}

/** DTO para registrar un pago. */
export type CreatePayDebtDTO = Omit<PayDebt, "id">;

/** DTO para actualizar un pago. */
export type UpdatePayDebtDTO = Partial<CreatePayDebtDTO> & { id: number };

// ============================================================
// MODELOS ENRIQUECIDOS (joins comunes)
// ============================================================

/** Deuda con el nombre del acreedor ya resuelto (para mostrar en UI). */
export type DebtWithCreditor = Debt & {
  creditor: Pick<Creditor, "name" | "phoneNumber"> | null;
};

/** Usuario con el objeto Role ya resuelto (para mostrar en UI). */
export type UserWithRole = Omit<User, "role"> & {
  role: Role | null;
};

/** Pago con los datos de la deuda asociada (para historial). */
export type PayDebtWithDebt = PayDebt & {
  debt: Pick<Debt, "name" | "type" | "amount">;
};

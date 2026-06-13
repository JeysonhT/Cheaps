import { create } from "zustand";
import { DebtWithCreditor, CreateDebtDTO, PayDebt, CreatePayDebtDTO } from "@/types";
import { debtService } from "../services/debtService";
import { paymentService } from "../services/paymentService";
import { userService } from "@/services/userService";

interface DebtState {
  debts: DebtWithCreditor[];
  payments: Record<number, PayDebt[]>;
  maxDebtMonth: number;
  isLoading: boolean;
  error: string | null;
  fetchDebts: () => Promise<void>;
  addDebt: (dto: CreateDebtDTO) => Promise<void>;
  deleteDebt: (id: number) => Promise<void>;
  
  // Payments actions
  fetchPayments: (debtId: number) => Promise<void>;
  addPayment: (dto: CreatePayDebtDTO) => Promise<void>;
}

export const useDebtStore = create<DebtState>((set, get) => ({
  debts: [],
  payments: {},
  maxDebtMonth: 0,
  isLoading: false,
  error: null,

  fetchDebts: async () => {
    set({ isLoading: true, error: null });
    try {
      const debts = await debtService.getAll();
      const stats = await userService.getStats();
      
      const currentMonth = new Date().toISOString().slice(0, 7);
      const totalPending = debts.reduce((sum, d) => sum + d.currentAmount, 0);
      
      let maxDebtMonth = stats.maxDebtMonth;
      
      // Si ha cambiado de mes (o es la primera vez que se registra), actualizar el mes e iniciar maxDebtMonth
      if (stats.maxDebtMonthLastUpdated !== currentMonth) {
        maxDebtMonth = totalPending;
        await userService.updateStats(totalPending, currentMonth);
      }
      
      set({ debts, maxDebtMonth, isLoading: false });
    } catch (err: any) {
      set({ error: err.message || "Error al cargar las deudas", isLoading: false });
    }
  },

  addDebt: async (dto) => {
    set({ isLoading: true, error: null });
    try {
      const newDebt = await debtService.create(dto);
      // Recargar deudas para que se calcule el total y se revise el mes
      await get().fetchDebts();
    } catch (err: any) {
      set({ error: err.message || "Error al registrar la deuda", isLoading: false });
      throw err;
    }
  },

  deleteDebt: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await debtService.delete(id);
      await get().fetchDebts();
    } catch (err: any) {
      set({ error: err.message || "Error al eliminar la deuda", isLoading: false });
    }
  },

  fetchPayments: async (debtId) => {
    try {
      const list = await paymentService.getForDebt(debtId);
      set((state) => ({
        payments: {
          ...state.payments,
          [debtId]: list,
        },
      }));
    } catch (err: any) {
      console.error("Error fetching payments", err);
    }
  },

  addPayment: async (dto) => {
    try {
      const newPayment = await paymentService.create(dto);
      
      // Actualizar pagos de esta deuda en el estado
      const currentList = get().payments[dto.idDebt] || [];
      set((state) => ({
        payments: {
          ...state.payments,
          [dto.idDebt]: [newPayment, ...currentList],
        },
      }));
      
      // Recargar deudas para actualizar el saldo restante
      await get().fetchDebts();
    } catch (err: any) {
      console.error("Error adding payment", err);
      throw err;
    }
  },
}));

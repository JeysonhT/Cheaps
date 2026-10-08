import { create } from "zustand";
import type { PayDebtWithDebt } from "@/types";
import { historyService } from "../services/historyService";

interface HistoryState {
  payments: PayDebtWithDebt[];
  isLoading: boolean;
  error: string | null;
  fetchHistory: () => Promise<void>;
}

export const useHistoryStore = create<HistoryState>((set) => ({
  payments: [],
  isLoading: false,
  error: null,

  fetchHistory: async () => {
    set({ isLoading: true, error: null });
    try {
      const payments = await historyService.getAllPayments();
      set({ payments, isLoading: false });
    } catch (err: any) {
      set({
        error: err.message || "Error al cargar el historial de pagos",
        isLoading: false,
      });
    }
  },
}));

import { create } from "zustand";
import { creditorService } from "../features/seller/services/creditorService";
import { CreateCreditorDTO, Creditor } from "../types";

interface CreditorState {
  creditors: Creditor[];
  isLoading: boolean;
  error: string | null;
  fetchCreditors: () => Promise<void>;
  addCreditor: (dto: CreateCreditorDTO) => Promise<void>;
  deleteCreditor: (id: number) => Promise<void>;
}

export const useCreditorStore = create<CreditorState>((set) => ({
  creditors: [],
  isLoading: false,
  error: null,

  fetchCreditors: async () => {
    set({ isLoading: true, error: null });
    try {
      const creditors = await creditorService.getAll();
      set({ creditors, isLoading: false });
    } catch (err: any) {
      set({
        error: err.message || "Error al cargar acreedores",
        isLoading: false,
      });
    }
  },

  addCreditor: async (dto) => {
    set({ isLoading: true, error: null });
    try {
      const newCreditor = await creditorService.create(dto);
      set((state) => ({
        creditors: [...state.creditors, newCreditor].sort((a, b) =>
          a.name.localeCompare(b.name),
        ),
        isLoading: false,
      }));
    } catch (err: any) {
      set({
        error: err.message || "Error al agregar acreedor",
        isLoading: false,
      });
      throw err;
    }
  },

  deleteCreditor: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await creditorService.delete(id);
      set((state) => ({
        creditors: state.creditors.filter((c) => c.id !== id),
        isLoading: false,
      }));
    } catch (err: any) {
      set({
        error: err.message || "Error al eliminar acreedor",
        isLoading: false,
      });
    }
  },
}));

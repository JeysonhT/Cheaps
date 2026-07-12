import { create } from "zustand";
import { getInit, setInitState } from "@/services/initService";

type UserStoreElements = {
  isInit: boolean;
  isLoading: boolean;
  fetchInit: () => Promise<void>;
  setInit: (isInit: boolean) => Promise<void>;
};

const useUserStore = create<UserStoreElements>((set) => ({
  isInit: false,
  isLoading: false,

  fetchInit: async () => {
    set({ isLoading: true });
    try {
      const result = await getInit();

      set({ isInit: result.welcomePassed, isLoading: false });
    } catch (e) {
      console.error(e);
    } finally {
      set({ isLoading: false });
    }
  },

  async setInit(isInit) {
    set({ isLoading: true });
    try {
      const result = await setInitState(isInit);
      set({
        isInit: result.welcomePassed,
        isLoading: false,
      });
    } catch (e) {
      console.error(e);
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useUserStore;

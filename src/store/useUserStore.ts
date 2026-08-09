import { create } from "zustand";
import { getInit, setInitState } from "@/services/initService";
import { userService } from "@/services/userService";

type UserStoreElements = {
  isInit: boolean;
  isLoading: boolean;
  fetchInit: () => Promise<void>;
  setInit: (isInit: boolean, name: string, lastName: string) => Promise<void>;
  getUserName: () => Promise<{ name: string; lastName: string }>;
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

  async setInit(isInit, name, lastName) {
    set({ isLoading: true });
    try {
      const result = await setInitState(isInit, name, lastName);
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

  async getUserName() {
    set({ isLoading: true });
    try {
      const result = await userService.getUserName();
      return result;
    } catch (e) {
      console.error(e);
      return { name: "", lastName: "" };
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useUserStore;

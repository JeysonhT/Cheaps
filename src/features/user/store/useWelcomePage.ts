import { create } from "zustand";

type WelcomePageStore = {
  currentComponent: string;
  lastComponent: string;
  setNetx: (e: string) => void;
};

const useWelcomePageStore = create<WelcomePageStore>((set) => ({
  currentComponent: "",
  lastComponent: "",
  setNetx(e) {
    set((state) => ({
      lastComponent: state.currentComponent,
      currentComponent: e,
    }));
  },
}));

export default useWelcomePageStore;

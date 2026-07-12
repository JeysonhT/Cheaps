import { createContext, type ReactNode, useEffect } from "react";
import useUserStore from "@/store/useUserStore";

type ContextValues = {
  isInit: boolean;
  setInit: (isInit: boolean) => void;
  isLoading: boolean;
};

export interface contextProps {
  children: ReactNode;
}

export const UserContext = createContext<ContextValues | null>(null);

export function UserContextProvider({ children }: contextProps) {
  const isInit = useUserStore((state) => state.isInit);
  const setInit = useUserStore((state) => state.setInit);

  const fetchInit = useUserStore((state) => state.fetchInit);
  const isLoading = useUserStore((state) => state.isLoading);

  useEffect(() => {
    fetchInit();
  }, [fetchInit]);

  const contextValues = {
    isInit,
    setInit,
    isLoading,
  };

  return (
    <UserContext.Provider value={contextValues}>
      {children}
    </UserContext.Provider>
  );
}

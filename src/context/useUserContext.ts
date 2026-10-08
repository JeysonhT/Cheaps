import { useContext } from "react";
import { UserContext } from "./UserContext";

export default function useUserContext() {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error(
      "useUserContext debe ser usado dentro de un UserContextProvider",
    );
  }

  return context;
}

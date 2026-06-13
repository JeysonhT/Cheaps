import { useCreditorStore } from "../../../store/useCreditorStore";

export function useCreditors() {
  const creditors = useCreditorStore((state) => state.creditors);
  const isLoading = useCreditorStore((state) => state.isLoading);
  const error = useCreditorStore((state) => state.error);
  const fetchCreditors = useCreditorStore((state) => state.fetchCreditors);
  const addCreditor = useCreditorStore((state) => state.addCreditor);
  const deleteCreditor = useCreditorStore((state) => state.deleteCreditor);

  return {
    creditors,
    isLoading,
    error,
    fetchCreditors,
    addCreditor,
    deleteCreditor,
  };
}

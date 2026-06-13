import { useHistoryStore } from "../store/useHistoryStore";

export function useHistory() {
  const payments = useHistoryStore((state) => state.payments);
  const isLoading = useHistoryStore((state) => state.isLoading);
  const error = useHistoryStore((state) => state.error);
  const fetchHistory = useHistoryStore((state) => state.fetchHistory);

  return {
    payments,
    isLoading,
    error,
    fetchHistory,
  };
}

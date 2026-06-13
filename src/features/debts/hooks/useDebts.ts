import { useDebtStore } from "../store/useDebtStore";

export function useDebts() {
  const debts = useDebtStore((state) => state.debts);
  const payments = useDebtStore((state) => state.payments);
  const maxDebtMonth = useDebtStore((state) => state.maxDebtMonth);
  const isLoading = useDebtStore((state) => state.isLoading);
  const error = useDebtStore((state) => state.error);
  const fetchDebts = useDebtStore((state) => state.fetchDebts);
  const addDebt = useDebtStore((state) => state.addDebt);
  const deleteDebt = useDebtStore((state) => state.deleteDebt);
  const fetchPayments = useDebtStore((state) => state.fetchPayments);
  const addPayment = useDebtStore((state) => state.addPayment);

  return {
    debts,
    payments,
    maxDebtMonth,
    isLoading,
    error,
    fetchDebts,
    addDebt,
    deleteDebt,
    fetchPayments,
    addPayment,
  };
}

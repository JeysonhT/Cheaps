import { useLocalSearchParams } from "expo-router";
import DebtDetailsScreen from "@/features/debts/details";

export default function DebtDetailsRoute() {
  const { id } = useLocalSearchParams();
  const debtId = parseInt(id as string, 10);

  return <DebtDetailsScreen id={debtId} />;
}

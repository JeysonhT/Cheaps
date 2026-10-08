import { useRouter } from "expo-router";
import { CheckCircle2 } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";
import type { PayDebtWithDebt } from "@/types";
import { formatDate } from "@/utils";

interface HistoryElementProps {
  payment: PayDebtWithDebt;
}

export default function HistoryElement({ payment }: HistoryElementProps) {
  const router = useRouter();

  const handlePress = () => {
    // Navegar a los detalles de la deuda asociada
    router.push(`/(tabs)/debts/${payment.idDebt}`);
  };

  return (
    <Pressable
      onPress={handlePress}
      className="w-full flex-row items-center justify-between p-4 bg-white active:bg-slate-50 active:opacity-80"
    >
      <View className="flex-row items-center gap-3 flex-1">
        <View className="rounded-full bg-slate-100 p-2 items-center justify-center">
          <CheckCircle2
            size={24}
            color="#059669"
          />
        </View>
        <View className="flex-1">
          <Text
            className="text-base font-semibold text-slate-900"
            numberOfLines={1}
          >
            {payment.debt.name}
          </Text>
          <Text className="text-xs text-slate-400 mt-1">
            {formatDate(payment.payDate)}
          </Text>
        </View>
      </View>

      <View className="items-end justify-center gap-1">
        <Text className="text-sm font-bold text-primary">
          {`C$ ${payment.amount.toLocaleString("es-NI", { minimumFractionDigits: 2 })}`}
        </Text>
        <View className="rounded-full bg-emerald-100 px-2 py-0.5 justify-center">
          <Text className="text-[10px] font-bold text-emerald-700">Pagado</Text>
        </View>
      </View>
    </Pressable>
  );
}

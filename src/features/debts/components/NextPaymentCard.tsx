import { Banknote, CalendarSync, CheckCircle2 } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";
import { formatDate } from "@/utils";

interface NextPaymentCardProps {
  currentAmount: number;
  nextPayDate: string;
  estimatedInstallment: number;
  onRegisterPayment: () => void;
}

export default function NextPaymentCard({
  currentAmount,
  nextPayDate,
  estimatedInstallment,
  onRegisterPayment,
}: NextPaymentCardProps) {
  const formatCurrency = (val: number) => {
    return `C$ ${val.toLocaleString("es-NI", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const amountToPay =
    estimatedInstallment > 0 ? estimatedInstallment : currentAmount;

  return (
    <View className="bg-primary rounded-2xl p-4 mb-4 shadow-md android:elevation-sm gap-4">
      <View>
        <View className="flex-row items-center gap-2 mb-3">
          <CalendarSync
            size={24}
            color="#ffffff"
            className="-mt-0.5"
          />
          <Text className="text-base font-bold text-white">Próximo Pago</Text>
        </View>
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-xs text-white/70 mb-1">Fecha límite</Text>
            <Text className="text-base font-bold text-white">
              {formatDate(nextPayDate)}
            </Text>
          </View>
          <View className="items-end">
            <Text className="text-xs text-white/70 mb-1 text-right">
              Monto a pagar
            </Text>
            <Text className="text-base font-bold text-white">
              {formatCurrency(amountToPay)}
            </Text>
          </View>
        </View>
      </View>

      {currentAmount > 0 ? (
        <Pressable
          className="bg-white h-11 rounded-lg items-center justify-center flex-row gap-2 active:opacity-90 active:scale-[0.99]"
          onPress={onRegisterPayment}
        >
          <Banknote
            size={20}
            color="#064e3b"
          />
          <Text className="text-base font-bold text-primary">
            Registrar Pago
          </Text>
        </Pressable>
      ) : (
        <View className="bg-emerald-500 h-11 rounded-lg items-center justify-center flex-row gap-2">
          <CheckCircle2
            size={20}
            color="#ffffff"
          />
          <Text className="text-base font-bold text-white">
            Deuda Liquidada
          </Text>
        </View>
      )}
    </View>
  );
}

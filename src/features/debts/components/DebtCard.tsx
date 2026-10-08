import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
  Car,
  CreditCard,
  Home,
  type LucideIcon,
  MoreHorizontal,
  Trash2,
  User,
  Zap,
} from "lucide-react-native";
import { Pressable, Text, View } from "react-native";
import Card from "@/components/Card";
import type { DebtType, DebtWithCreditor } from "@/types";

interface DebtCardProps {
  debt: DebtWithCreditor;
  onDelete?: (id: number) => void;
}

const getDebtIcon = (type: DebtType): LucideIcon => {
  switch (type) {
    case "personal":
      return User;
    case "tarjeta":
      return CreditCard;
    case "hipoteca":
      return Home;
    case "auto":
      return Car;
    case "servicio":
      return Zap;
    default:
      return MoreHorizontal;
  }
};

export default function DebtCard({ debt, onDelete }: DebtCardProps) {
  const router = useRouter();
  const DebtIcon = getDebtIcon(debt.type);

  // Calcular progreso (monto pagado vs monto original)
  const original = debt.amount;
  const current = debt.currentAmount;
  const paid = Math.max(0, original - current);
  const progressPct = original > 0 ? paid / original : 0;
  const displayPct = Math.round(progressPct * 100);

  // Formateador de moneda (C$)
  const formatCurrency = (val: number) => {
    return `C$ ${val.toLocaleString("es-NI", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  return (
    <Card className="my-2 mx-4 p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
      <Pressable onPress={() => router.push(`/(tabs)/debts/${debt.id}`)}>
        <View className="gap-3">
          {/* Header section with Icon and Details */}
          <View className="flex-row items-center">
            <View className="w-11 h-11 rounded-full bg-slate-100 items-center justify-center mr-3">
              <DebtIcon
                color="#064E3B"
                size={24}
              />
            </View>
            <View className="flex-1">
              <Text
                className="text-base font-bold text-slate-900"
                numberOfLines={1}
              >
                {debt.name}
              </Text>
              <Text
                className="text-sm text-slate-500 mt-0.5"
                numberOfLines={1}
              >
                {debt.creditor
                  ? `Acreedor: ${debt.creditor.name}`
                  : "Sin acreedor asignado"}
              </Text>
            </View>
            {onDelete && (
              <Pressable
                onPress={() => onDelete(debt.id)}
                className="w-9 h-9 rounded-full bg-red-100 items-center justify-center active:opacity-70"
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Trash2
                  size={18}
                  color="#ef4444"
                />
              </Pressable>
            )}
          </View>

          {/* Progress Bar Section */}
          <View className="mt-1">
            <View className="flex-row justify-between items-center mb-1">
              <Text className="text-xs text-slate-400">
                Progreso de liquidación
              </Text>
              <Text className="text-xs font-semibold text-primary">{`${displayPct}%`}</Text>
            </View>

            <View className="h-2 rounded-full bg-slate-100 overflow-hidden">
              <LinearGradient
                colors={["#064e3b", "#059669"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{
                  width: `${displayPct}%`,
                  height: "100%",
                  borderRadius: 9999,
                }}
              />
            </View>
          </View>

          {/* Footer with remaining amounts */}
          <View className="flex-row justify-between items-center border-t border-slate-100 pt-3 mt-1">
            <View>
              <Text className="text-xs text-slate-400 mb-0.5">
                Monto original
              </Text>
              <Text className="text-sm font-medium text-slate-900">
                {formatCurrency(original)}
              </Text>
            </View>
            <View className="items-end">
              <Text className="text-xs text-slate-400 mb-0.5 text-right">
                Saldo restante
              </Text>
              <Text className="text-base font-bold text-primary">
                {formatCurrency(current)}
              </Text>
            </View>
          </View>
        </View>
      </Pressable>
    </Card>
  );
}

import { LinearGradient } from "expo-linear-gradient";
import {
  Building2,
  Car,
  CreditCard,
  Home,
  type LucideIcon,
  MoreHorizontal,
  User,
  Zap,
} from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";
import Card from "@/components/Card";
import { HStack, VStack } from "@/components/layout";
import type { Creditor, DebtType, DebtWithCreditor } from "@/types";

interface SellerCardProps {
  creditor: Creditor;
  largestDebt: DebtWithCreditor | null;
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

export default function SellerCard({ creditor, largestDebt }: SellerCardProps) {
  // Calcular progreso y valores financieros
  const hasDebt = largestDebt !== null;
  const original = largestDebt ? largestDebt.amount : 0;
  const current = largestDebt ? largestDebt.currentAmount : 0;
  const paid = Math.max(0, original - current);
  const progressPct = original > 0 ? paid / original : 0;

  const formatCurrency = (val: number) => {
    return `C$ ${val.toLocaleString("es-NI", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  const IconComponent = hasDebt ? getDebtIcon(largestDebt.type) : Building2;

  return (
    <Card className="bg-slate-200 w-[280] p-3">
      <VStack className="gap-2">
        <HStack className="items-center">
          <View className="w-10 h-10 rounded-full bg-primary items-center justify-center">
            <IconComponent color="#ffffff" size={24} />
          </View>
          <VStack className="flex-1 justify-center ml-2">
            <Text className="font-bold" numberOfLines={1}>
              {creditor.name}
            </Text>
            <Text className="text-xs text-slate-500" numberOfLines={1}>
              {hasDebt ? largestDebt!.name : "Sin deudas activas"}
            </Text>
          </VStack>
        </HStack>

        <VStack className="mt-1">
          <HStack className="mb-1 justify-between items-center">
            <Text className="text-xs text-slate-500">Progreso</Text>
            <Text className="text-xs text-slate-900">{`${Math.round(progressPct * 100)}%`}</Text>
          </HStack>
          {/* Progress bar track */}
          <View className="height-6 rounded-full bg-slate-400 overflow-hidden">
            {/* Gradient fill */}
            <LinearGradient
              colors={[
                Styles.startProgressColor.color,
                Styles.endProgressColor.color,
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[
                Styles.progressFill,
                { width: `${Math.round(progressPct * 100)}%` },
              ]}
            />
          </View>
        </VStack>

        <HStack className="justify-between items-center mt-1 border-t-4 border-t-slate-400">
          <Text className="text-xs text-slate-500">Restante</Text>
          <Text className="font-bold text-slate-900">
            {formatCurrency(current)}
          </Text>
        </HStack>
      </VStack>
    </Card>
  );
}

const Styles = StyleSheet.create({
  startProgressColor: {
    color: "#064E3B",
  },
  endProgressColor: {
    color: "#059669",
  },
  progressFill: {
    height: "100%",
    borderRadius: 100,
  },
});

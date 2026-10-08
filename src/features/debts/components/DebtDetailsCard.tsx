import { LinearGradient } from "expo-linear-gradient";
import { Text, View } from "react-native";
import Card from "@/components/Card";

interface DebtDetailsCardProps {
  original: number;
  current: number;
}

export default function DebtDetailsCard({
  original,
  current,
}: DebtDetailsCardProps) {
  const paid = Math.max(0, original - current);
  const progressPct = original > 0 ? paid / original : 0;
  const displayPct = Math.round(progressPct * 100);

  const formatCurrency = (val: number) => {
    return `C$ ${val.toLocaleString("es-NI", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  return (
    <Card className="bg-white rounded-xl p-4 border border-slate-200 mb-4 shadow-sm">
      <View className="flex-row justify-between items-end">
        <View>
          <Text className="text-xs text-slate-400 mb-1">Saldo Pendiente</Text>
          <Text className="text-2xl font-bold text-primary">
            {formatCurrency(current)}
          </Text>
        </View>
        <View className="items-end">
          <Text className="text-xs text-slate-400 mb-1 text-right">
            Monto Original
          </Text>
          <Text className="text-lg font-semibold text-slate-900">
            {formatCurrency(original)}
          </Text>
        </View>
      </View>

      {/* Progress bar inside bento card */}
      <View className="mt-4 border-t border-slate-100 pt-4">
        <View className="flex-row justify-between items-center mb-1">
          <Text className="text-sm font-medium text-primary">
            Progreso de Pago
          </Text>
          <Text className="text-sm font-semibold text-primary">
            {`${displayPct}% Completado`}
          </Text>
        </View>
        <View className="h-3 bg-slate-100 rounded-full overflow-hidden my-1">
          <LinearGradient
            colors={["#064e3b", "#10b981"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              width: `${displayPct}%`,
              height: "100%",
              borderRadius: 9999,
            }}
          />
        </View>
        <Text className="text-xs text-slate-400 italic mt-2">
          {`Has pagado ${formatCurrency(paid)} de tu deuda total.`}
        </Text>
      </View>
    </Card>
  );
}

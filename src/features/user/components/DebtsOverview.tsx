import { TrendingDown, TrendingUp } from "lucide-react-native";
import { useEffect } from "react";
import { Text } from "react-native";
import { HStack, VStack } from "@/components/layout";
import { useDebts } from "@/features/debts/hooks/useDebts";
import NextPay from "./NextPay";

export default function DebtsOverview() {
  const { debts, maxDebtMonth, fetchDebts } = useDebts();

  useEffect(() => {
    fetchDebts();
  }, [fetchDebts]);

  const totalPending = debts.reduce((sum, d) => sum + d.currentAmount, 0);

  // Calcular tendencia porcentual respecto al máximo del mes pasado
  const diffPct =
    maxDebtMonth > 0 ? ((totalPending - maxDebtMonth) / maxDebtMonth) * 100 : 0;
  const isDown = diffPct <= 0;

  const formatCurrency = (val: number) => {
    return `C$ ${val.toLocaleString("es-NI", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const fechaActual = new Date();

  // Encontrar la deuda más cercana a hoy comparando timestamps en ms (.getTime())
  const nearDate =
    debts.length > 0
      ? debts.reduce((a, b) => {
          const sigFecha = new Date(b.debtDate);
          const aFecha = new Date(a.debtDate);

          const difB = Math.abs(fechaActual.getTime() - sigFecha.getTime());
          const difA = Math.abs(fechaActual.getTime() - aFecha.getTime());

          return difB < difA ? b : a;
        })
      : null;

  const nextPay = nearDate ? debts.find((v) => v.id === nearDate.id) : null;

  return (
    <VStack className="m-1 p-4 bg-primary-500 rounded-xl elevation-sm">
      <Text className="text-md text-slate-100 font-semibold uppercase">
        Deuda total pendiente
      </Text>
      <Text className="text-3xl text-white font-bold">
        {formatCurrency(totalPending)}
      </Text>

      <HStack className="mt-2 items-center gap-2">
        {isDown ? (
          <TrendingUp
            color={"#34d399"} // red for upward debt trend, light green for downward
            size={18}
          />
        ) : (
          <TrendingDown
            color={"#ef4444"} // red for upward debt trend, light green for downward
            size={18}
          />
        )}
        <Text className="text-xs text-slate-100">
          {isDown && maxDebtMonth > 0
            ? `${Math.abs(diffPct).toFixed(1)}% menos que el mes pasado`
            : "Al día con el mes pasado"}
          {!isDown ? `${diffPct.toFixed(1)}% más que el mes pasado` : null}
        </Text>
      </HStack>

      <NextPay debt={nextPay || null} />
    </VStack>
  );
}

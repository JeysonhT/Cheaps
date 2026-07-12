import MaterialIcons from "@react-native-vector-icons/material-icons";
import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import { HStack, Text, VStack } from "@/components/layout";
import { useDebts } from "@/features/debts/hooks/useDebts";
import { makeStyles } from "@/hooks/useTheme";
import NextPay from "./NextPay";

export default function DebtsOverview() {
  const styles = useStyles();
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
    <VStack style={styles.container}>
      <Text size="xs" weight="semibold" style={styles.textMayus}>
        Deuda total pendiente
      </Text>
      <Text size="3xl" weight="bold" style={styles.info}>
        {formatCurrency(totalPending)}
      </Text>

      {isDown ? (
        <HStack align="center" gap="2" style={styles.debtTrend}>
          <MaterialIcons
            name="trending-down"
            color="#34d399" // light green for positive downward trend of debt
            size={18}
          />
          <Text size="xs" style={styles.text}>
            {maxDebtMonth > 0
              ? `${Math.abs(diffPct).toFixed(1)}% menos que el mes pasado`
              : "Al día con el mes pasado"}
          </Text>
        </HStack>
      ) : (
        <HStack align="center" gap="2" style={styles.debtTrend}>
          <MaterialIcons
            name="trending-up"
            color="#ef4444" // red for upward debt trend
            size={18}
          />
          <Text size="xs" style={styles.text}>
            {`${diffPct.toFixed(1)}% más que el mes pasado`}
          </Text>
        </HStack>
      )}

      <NextPay debt={nextPay || null} />
    </VStack>
  );
}

const useStyles = makeStyles((t, sp, fs, fw, r) =>
  StyleSheet.create({
    container: {
      elevation: 1,
      margin: sp[2],
      padding: sp[4],
      backgroundColor: t.primary,
      borderRadius: r.md,
    },
    text: {
      color: t.textInverse, // Show in white/inverse since the card background is dark green (t.primary)
      opacity: 0.9,
    },
    textMayus: {
      textTransform: "uppercase",
      color: "#a7f3d0", // soft light green header text
    },
    info: {
      color: t.textInverse,
    },
    debtTrend: {
      marginTop: sp[1],
    },
  }),
);

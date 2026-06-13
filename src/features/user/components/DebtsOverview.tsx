import React, { useEffect } from "react";
import { DashboardInfo, Label, SubTitle } from "@/components/StyledText";
import Colors from "@/constants/Colors";
import { useDebts } from "@/features/debts/hooks/useDebts";
import { makeStyles } from "@/hooks/useTheme";
import MaterialIcons from "@react-native-vector-icons/material-icons";
import { StyleSheet, View } from "react-native";
import NextPay from "./NextPay";

export default function DebtsOverview() {
  const styles = useStyles();
  const { debts, maxDebtMonth, fetchDebts } = useDebts();

  useEffect(() => {
    fetchDebts();
  }, []);

  const totalPending = debts.reduce((sum, d) => sum + d.currentAmount, 0);

  // Calcular tendencia porcentual respecto al máximo del mes pasado
  const diffPct = maxDebtMonth > 0 ? ((totalPending - maxDebtMonth) / maxDebtMonth) * 100 : 0;
  const isDown = diffPct <= 0;

  const formatCurrency = (val: number) => {
    return `C$ ${val.toLocaleString("es-NI", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const fechaActual = new Date();

  // Encontrar la deuda más cercana a hoy comparando timestamps en ms (.getTime())
  const nearDate = debts.length > 0 ? debts.reduce((a, b) => {
    const sigFecha = new Date(b.debtDate);
    const aFecha = new Date(a.debtDate);
    
    const difB = Math.abs(fechaActual.getTime() - sigFecha.getTime());
    const difA = Math.abs(fechaActual.getTime() - aFecha.getTime());

    return difB < difA ? b : a;
  }) : null;

  const nextPay = nearDate ? debts.find((v) => v.id === nearDate.id) : null;

  return (
    <View style={styles.container}>
      <SubTitle style={[styles.text, styles.textMayus]}>
        Deuda total pendiente
      </SubTitle>
      <DashboardInfo style={styles.info}>
        {formatCurrency(totalPending)}
      </DashboardInfo>
      
      {isDown ? (
        <View style={styles.debtTrend}>
          <MaterialIcons
            name="trending-down"
            color="#34d399" // light green for positive downward trend of debt
            size={18}
          />
          <Label style={styles.text}>
            {maxDebtMonth > 0 
              ? `${Math.abs(diffPct).toFixed(1)}% menos que el mes pasado` 
              : "Al día con el mes pasado"}
          </Label>
        </View>
      ) : (
        <View style={styles.debtTrend}>
          <MaterialIcons
            name="trending-up"
            color="#ef4444" // red for upward debt trend
            size={18}
          />
          <Label style={styles.text}>
            {`${diffPct.toFixed(1)}% más que el mes pasado`}
          </Label>
        </View>
      )}
      
      <NextPay debt={nextPay || null} />
    </View>
  );
}

const useStyles = makeStyles((t, sp, fs, tw, r) =>
  StyleSheet.create({
    container: {
      elevation: 1,
      margin: sp[2],
      padding: sp[4],
      flexDirection: "column",
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
      opacity: 1,
    },
    info: {
      color: t.textInverse,
    },
    debtTrend: {
      gap: sp[2],
      flexDirection: "row",
      alignItems: "center",
      marginTop: sp[1],
    },
  }),
);

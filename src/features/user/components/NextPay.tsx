import React from "react";
import Card from "@/components/Card";
import { Label } from "@/components/StyledText";
import Colors from "@/constants/Colors";
import { makeStyles } from "@/hooks/useTheme";
import MaterialIcons from "@react-native-vector-icons/material-icons";
import { StyleSheet, View } from "react-native";
import { DebtWithCreditor } from "@/types";

interface NextPayProps {
  debt: DebtWithCreditor | null;
}

export default function NextPay({ debt }: NextPayProps) {
  const styles = useStyles();

  if (!debt) {
    return (
      <Card style={styles.card}>
        <View style={styles.top}>
          <MaterialIcons name="event" color="#ffffff" size={24} />
          <Label style={styles.label}>Próximo Pago</Label>
        </View>
        <View style={styles.bottom}>
          <Label style={styles.amount}>Sin deudas</Label>
          <Label style={styles.date}>Al día</Label>
        </View>
      </Card>
    );
  }

  // Estimar cuota aproximada
  const installment = debt.amount * (debt.payFrecuency / 365);
  const displayInstallment = Math.min(debt.currentAmount, installment > 0 ? installment : debt.currentAmount);

  // Calcular próxima fecha de pago
  const getNextPayDate = () => {
    try {
      const baseDate = new Date(debt.debtDate);
      const today = new Date();
      // Incrementar hasta que la fecha sea futura
      while (baseDate < today) {
        baseDate.setDate(baseDate.getDate() + debt.payFrecuency);
      }
      
      const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
      return `${baseDate.getDate()} de ${months[baseDate.getMonth()]}, ${baseDate.getFullYear()}`;
    } catch (e) {
      return debt.debtDate;
    }
  };

  const formatCurrency = (val: number) => {
    return `C$ ${val.toLocaleString("es-NI", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <Card style={styles.card}>
      <View style={styles.top}>
        <MaterialIcons name="event" color="#ffffff" size={24} />
        <Label style={styles.label}>Próximo Pago: {debt.name}</Label>
      </View>
      <View style={styles.bottom}>
        <Label style={styles.amount}>{formatCurrency(displayInstallment)}</Label>
        <Label style={styles.date}>{getNextPayDate()}</Label>
      </View>
    </Card>
  );
}

const useStyles = makeStyles((t, sp, fs, fw) =>
  StyleSheet.create({
    card: {
      backgroundColor: t.tertiaryHover,
      marginTop: sp[2],
    },
    top: {
      flexDirection: "row",
      gap: sp[2],
      marginBottom: sp[1],
      alignItems: "center",
    },
    bottom: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    label: { color: t.textInverse, fontSize: fs.sm, fontWeight: fw.medium },
    amount: { color: t.textInverse, fontSize: fs.lg, fontWeight: fw.bold },
    date: { color: t.textInverse, fontWeight: fw.medium, fontSize: fs.sm },
  }),
);

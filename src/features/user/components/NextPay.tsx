import MaterialIcons from "@react-native-vector-icons/material-icons";
import React from "react";
import { StyleSheet } from "react-native";
import Card from "@/components/Card";
import { HStack, Text } from "@/components/layout";
import { makeStyles } from "@/hooks/useTheme";
import type { DebtWithCreditor } from "@/types";

interface NextPayProps {
  debt: DebtWithCreditor | null;
}

export default function NextPay({ debt }: NextPayProps) {
  const styles = useStyles();

  if (!debt) {
    return (
      <Card style={styles.card}>
        <HStack align="center" gap="2" style={styles.top}>
          <MaterialIcons name="event" color="#ffffff" size={24} />
          <Text size="sm" weight="medium" style={styles.textInverse}>
            Próximo Pago
          </Text>
        </HStack>
        <HStack justify="space-between" align="center">
          <Text size="lg" weight="bold" style={styles.textInverse}>
            Sin deudas
          </Text>
          <Text size="sm" weight="medium" style={styles.textInverse}>
            Al día
          </Text>
        </HStack>
      </Card>
    );
  }

  // Estimar cuota aproximada
  const installment = debt.amount * (debt.payFrecuency / 365);
  const displayInstallment = Math.min(
    debt.currentAmount,
    installment > 0 ? installment : debt.currentAmount,
  );

  // Calcular próxima fecha de pago
  const getNextPayDate = () => {
    try {
      const baseDate = new Date(debt.debtDate);
      const today = new Date();
      // Incrementar hasta que la fecha sea futura
      while (baseDate < today) {
        baseDate.setDate(baseDate.getDate() + debt.payFrecuency);
      }

      const months = [
        "Ene",
        "Feb",
        "Mar",
        "Abr",
        "May",
        "Jun",
        "Jul",
        "Ago",
        "Sep",
        "Oct",
        "Nov",
        "Dic",
      ];
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
      <HStack align="center" gap="2" style={styles.top}>
        <MaterialIcons name="event" color="#ffffff" size={24} />
        <Text size="sm" weight="medium" style={styles.textInverse}>
          Próximo Pago: {debt.name}
        </Text>
      </HStack>
      <HStack justify="space-between" align="center">
        <Text size="lg" weight="bold" style={styles.textInverse}>
          {formatCurrency(displayInstallment)}
        </Text>
        <Text size="sm" weight="medium" style={styles.textInverse}>
          {getNextPayDate()}
        </Text>
      </HStack>
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
      marginBottom: sp[1],
    },
    textInverse: {
      color: t.textInverse,
    },
  }),
);

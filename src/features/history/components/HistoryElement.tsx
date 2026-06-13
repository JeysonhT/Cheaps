import React from "react";
import { StyleSheet, View, Pressable } from "react-native";
import { CardTitle, Label, SubTitle } from "@/components/StyledText";
import { makeStyles } from "@/hooks/useTheme";
import MaterialIcons from "@react-native-vector-icons/material-icons";
import { PayDebtWithDebt } from "@/types";
import { useRouter } from "expo-router";

interface HistoryElementProps {
  payment: PayDebtWithDebt;
}

export default function HistoryElement({ payment }: HistoryElementProps) {
  const styles = useStyles();
  const router = useRouter();

  // Formato de fecha legible
  const formatDate = (isoString: string) => {
    try {
      const parts = isoString.split("-");
      if (parts.length === 3) {
        const year = parts[0];
        const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
        const monthIndex = parseInt(parts[1], 10) - 1;
        const day = parseInt(parts[2], 10);
        if (monthIndex >= 0 && monthIndex < 12) {
          return `${day} ${months[monthIndex]}, ${year}`;
        }
      }
      return isoString;
    } catch (e) {
      return isoString;
    }
  };

  const handlePress = () => {
    // Navegar a los detalles de la deuda asociada
    router.push(`/(tabs)/debts/${payment.idDebt}` as any);
  };

  return (
    <Pressable onPress={handlePress} style={({ pressed }) => [styles.container, pressed && styles.pressed]}>
      <View style={styles.info}>
        <View style={styles.iconView}>
          <MaterialIcons
            name="check-circle"
            size={24}
            color={styles.checkIconColor.color}
          />
        </View>
        <View style={styles.textContainer}>
          <CardTitle style={styles.title}>{payment.debt.name}</CardTitle>
          <SubTitle style={styles.date}>{formatDate(payment.payDate)}</SubTitle>
        </View>
      </View>
      
      <View style={styles.statusAndAmount}>
        <SubTitle style={styles.amount}>{`C$ ${payment.amount.toLocaleString("es-NI", { minimumFractionDigits: 2 })}`}</SubTitle>
        <View style={styles.statusView}>
          <Label style={styles.statusText}>Pagado</Label>
        </View>
      </View>
    </Pressable>
  );
}

const useStyles = makeStyles((t, sp, fs, fw, r) =>
  StyleSheet.create({
    container: {
      backgroundColor: t.bgElevated,
      padding: sp[4],
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: sp[2],
      width: "100%",
    },
    pressed: {
      opacity: 0.8,
      backgroundColor: t.bgSubtle,
    },
    info: { 
      flexDirection: "row", 
      alignItems: "center", 
      gap: sp[3],
      flex: 1,
    },
    textContainer: {
      flex: 1,
    },
    title: {
      fontSize: fs.base,
      fontWeight: fw.semibold,
      color: t.text,
    },
    date: {
      fontSize: fs.xs,
      color: t.textMuted,
      marginTop: 2,
    },
    statusAndAmount: { 
      justifyContent: "center", 
      alignItems: "flex-end",
      gap: sp[1],
    },
    amount: {
      fontSize: fs.sm,
      fontWeight: fw.bold,
      color: t.primary,
    },
    iconView: {
      borderRadius: r.full,
      backgroundColor: t.bgSubtle,
      padding: sp[2],
      alignItems: "center",
      justifyContent: "center",
    },
    checkIconColor: {
      color: t.tertiary,
    },
    statusView: {
      borderRadius: r.full,
      backgroundColor: "#d1fae5", // soft emerald green background
      paddingHorizontal: sp[2],
      paddingVertical: 2,
      justifyContent: "center",
    },
    statusText: {
      fontSize: 10,
      fontWeight: fw.bold,
      color: "#047857",
    },
  }),
);

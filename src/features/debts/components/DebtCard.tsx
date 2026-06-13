import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Label, SubTitle } from "@/components/StyledText";
import Card from "@/components/Card";
import { makeStyles } from "@/hooks/useTheme";
import MaterialIcons from "@react-native-vector-icons/material-icons";
import { DebtWithCreditor, DebtType } from "@/types";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

interface DebtCardProps {
  debt: DebtWithCreditor;
  onDelete?: (id: number) => void;
}

const getDebtIcon = (type: DebtType): string => {
  switch (type) {
    case "personal":
      return "person";
    case "tarjeta":
      return "credit-card";
    case "hipoteca":
      return "home";
    case "auto":
      return "directions-car";
    case "servicio":
      return "bolt";
    default:
      return "more-horiz";
  }
};

export default function DebtCard({ debt, onDelete }: DebtCardProps) {
  const styles = useStyles();
  const router = useRouter();

  // Calcular progreso (monto pagado vs monto original)
  const original = debt.amount;
  const current = debt.currentAmount;
  const paid = Math.max(0, original - current);
  const progressPct = original > 0 ? paid / original : 0;
  const displayPct = Math.round(progressPct * 100);

  // Formateador de moneda (C$)
  const formatCurrency = (val: number) => {
    return `C$ ${val.toLocaleString("es-NI", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <Card style={styles.card}>
      <Pressable onPress={() => router.push(`/(tabs)/debts/${debt.id}` as any)}>
        <View style={styles.mainView}>
          {/* Header section with Icon and Details */}
          <View style={styles.header}>
            <View style={styles.iconView}>
              <MaterialIcons
                name={getDebtIcon(debt.type) as any}
                color={styles.avatarIconColor.color}
                size={24}
              />
            </View>
            <View style={styles.titleContainer}>
              <Label style={styles.highlightText}>{debt.name}</Label>
              <SubTitle style={styles.creditorText}>
                {debt.creditor ? `Acreedor: ${debt.creditor.name}` : "Sin acreedor asignado"}
              </SubTitle>
            </View>
            {onDelete && (
              <Pressable
                onPress={() => onDelete(debt.id)}
                style={styles.deleteButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <MaterialIcons name="delete-outline" size={20} color={styles.deleteIconColor.color} />
              </Pressable>
            )}
          </View>

          {/* Progress Bar Section */}
          <View style={styles.progressContainer}>
            <View style={styles.progressHeader}>
              <SubTitle style={styles.progressLabel}>Progreso de liquidación</SubTitle>
              <Label style={styles.progressPctText}>{`${displayPct}%`}</Label>
            </View>
            
            <View style={styles.progressTrack}>
              <LinearGradient
                colors={[
                  styles.startProgressColor.color,
                  styles.endProgressColor.color,
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.progressFill, { width: `${displayPct}%` }]}
              />
            </View>
          </View>

          {/* Footer with remaining amounts */}
          <View style={styles.footer}>
            <View>
              <SubTitle style={styles.amountLabel}>Monto original</SubTitle>
              <Label style={styles.originalAmountText}>{formatCurrency(original)}</Label>
            </View>
            <View style={styles.remainingAmountContainer}>
              <SubTitle style={[styles.amountLabel, styles.alignRight]}>Saldo restante</SubTitle>
              <Label style={styles.remainingAmountText}>{formatCurrency(current)}</Label>
            </View>
          </View>
        </View>
      </Pressable>
    </Card>
  );
}

const useStyles = makeStyles((t, sp, fs, fw, r) =>
  StyleSheet.create({
    card: {
      backgroundColor: t.bgElevated,
      marginVertical: sp[2],
      marginHorizontal: sp[4],
      padding: sp[4],
      borderWidth: 1,
      borderColor: t.border,
      borderRadius: r.lg,
    },
    mainView: {
      flexDirection: "column",
      gap: sp[3],
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
    },
    iconView: {
      borderRadius: r.full,
      backgroundColor: t.bgMuted,
      width: 44,
      height: 44,
      alignItems: "center",
      justifyContent: "center",
      marginRight: sp[3],
    },
    avatarIconColor: {
      color: t.primary,
    },
    titleContainer: {
      flex: 1,
    },
    highlightText: { 
      fontWeight: fw.bold,
      fontSize: fs.md,
      color: t.text,
    },
    creditorText: {
      fontSize: fs.sm,
      color: t.textMuted,
      marginTop: 2,
    },
    deleteButton: {
      padding: sp[2],
      borderRadius: r.full,
      backgroundColor: "#fee2e2",
    },
    deleteIconColor: {
      color: t.error,
    },
    progressContainer: {
      marginTop: sp[1],
    },
    progressHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: sp[1],
    },
    progressLabel: {
      fontSize: fs.xs,
      color: t.textMuted,
    },
    progressPctText: {
      fontSize: fs.xs,
      fontWeight: fw.semibold,
      color: t.primary,
    },
    progressTrack: {
      height: 8,
      borderRadius: r.full,
      backgroundColor: t.bgMuted,
      overflow: "hidden",
    },
    progressFill: {
      height: "100%",
      borderRadius: r.full,
    },
    startProgressColor: {
      color: t.primary,
    },
    endProgressColor: { 
      color: t.tertiary,
    },
    footer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      borderTopWidth: 1,
      borderTopColor: t.border,
      paddingTop: sp[3],
      marginTop: sp[1],
    },
    amountLabel: {
      fontSize: fs.xs,
      color: t.textMuted,
      marginBottom: 2,
    },
    originalAmountText: {
      fontSize: fs.sm,
      color: t.text,
      fontWeight: fw.medium,
    },
    remainingAmountContainer: {
      alignItems: "flex-end",
    },
    remainingAmountText: {
      fontSize: fs.base,
      color: t.primary,
      fontWeight: fw.bold,
    },
    alignRight: {
      textAlign: "right",
    },
  })
);

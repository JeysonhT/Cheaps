import Card from "@/components/Card";
import { Label, SubTitle } from "@/components/StyledText";
import { makeStyles } from "@/hooks/useTheme";
import { Creditor, DebtType, DebtWithCreditor } from "@/types";
import MaterialIcons from "@react-native-vector-icons/material-icons";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, View } from "react-native";

interface SellerCardProps {
  creditor: Creditor;
  largestDebt: DebtWithCreditor | null;
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

export default function SellerCard({ creditor, largestDebt }: SellerCardProps) {
  const styles = useStyles();

  // Calcular progreso y valores financieros
  const hasDebt = largestDebt !== null;
  const original = largestDebt ? largestDebt.amount : 0;
  const current = largestDebt ? largestDebt.currentAmount : 0;
  const paid = Math.max(0, original - current);
  const progressPct = original > 0 ? paid / original : 0;

  const formatCurrency = (val: number) => {
    return `C$ ${val.toLocaleString("es-NI", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  return (
    <Card style={styles.card}>
      <View style={styles.mainView}>
        <View style={styles.header}>
          <View style={styles.iconView}>
            <MaterialIcons
              name={
                hasDebt
                  ? (getDebtIcon(largestDebt!.type) as any)
                  : "corporate-fare"
              }
              color="#ffffff"
              size={24}
            />
          </View>
          <View style={styles.textContainer}>
            <Label style={styles.highlightText} numberOfLines={1}>
              {creditor.name}
            </Label>
            <SubTitle numberOfLines={1}>
              {hasDebt ? largestDebt!.name : "Sin deudas activas"}
            </SubTitle>
          </View>
        </View>

        <View style={styles.progressSection}>
          <View style={styles.bodyHead}>
            <SubTitle>Progreso</SubTitle>
            <SubTitle
              style={styles.text}
            >{`${Math.round(progressPct * 100)}%`}</SubTitle>
          </View>
          {/* Progress bar track */}
          <View style={styles.progressTrack}>
            {/* Gradient fill */}
            <LinearGradient
              colors={[
                styles.startProgressColor.color,
                styles.endProgressColor.color,
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[
                styles.progressFill,
                { width: `${Math.round(progressPct * 100)}%` },
              ]}
            />
          </View>
        </View>

        <View style={styles.footer}>
          <SubTitle>Restante</SubTitle>
          <Label style={styles.highlightText}>{formatCurrency(current)}</Label>
        </View>
      </View>
    </Card>
  );
}

const useStyles = makeStyles((t, sp, fs, fw, r) =>
  StyleSheet.create({
    card: {
      backgroundColor: t.bgSubtle,
      width: 280,
      padding: sp[3],
    },
    mainView: {
      flexDirection: "column",
      gap: sp[2],
    },
    iconView: {
      borderRadius: r.full,
      backgroundColor: t.primary,
      width: 40,
      height: 40,
      alignItems: "center",
      justifyContent: "center",
    },
    highlightText: {
      fontWeight: fw.bold,
      color: t.text,
      fontSize: fs.base,
    },
    text: { color: t.text },
    textContainer: {
      flex: 1,
      justifyContent: "center",
      marginLeft: sp[2],
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
    },
    progressSection: {
      marginTop: sp[1],
    },
    bodyHead: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: sp[1],
    },
    startProgressColor: {
      color: t.primary,
    },
    endProgressColor: {
      color: t.tertiary,
    },
    progressTrack: {
      height: 6,
      borderRadius: r.full,
      backgroundColor: t.bgMuted,
      overflow: "hidden",
    },
    progressFill: {
      height: "100%",
      borderRadius: r.full,
    },
    footer: {
      marginTop: sp[1],
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      borderTopWidth: 1,
      borderTopColor: t.border,
      paddingTop: sp[2],
    },
  }),
);

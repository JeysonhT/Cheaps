import MaterialIcons, {
  type MaterialIconsIconName,
} from "@react-native-vector-icons/material-icons";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, View } from "react-native";
import Card from "@/components/Card";
import { HStack, Text, VStack } from "@/components/layout";
import { makeStyles } from "@/hooks/useTheme";
import type { Creditor, DebtType, DebtWithCreditor } from "@/types";

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
      <VStack gap="2">
        <HStack align="center">
          <View style={styles.iconView}>
            <MaterialIcons
              name={
                hasDebt
                  ? (getDebtIcon(largestDebt!.type) as MaterialIconsIconName)
                  : "corporate-fare"
              }
              color="#ffffff"
              size={24}
            />
          </View>
          <VStack flex={1} justify="center" style={{ marginLeft: 8 }}>
            <Text size="base" weight="bold" color="text" numberOfLines={1}>
              {creditor.name}
            </Text>
            <Text size="xs" color="textMuted" numberOfLines={1}>
              {hasDebt ? largestDebt!.name : "Sin deudas activas"}
            </Text>
          </VStack>
        </HStack>

        <VStack style={styles.progressSection}>
          <HStack
            justify="space-between"
            align="center"
            style={styles.bodyHead}
          >
            <Text size="xs" color="textMuted">
              Progreso
            </Text>
            <Text
              size="xs"
              color="text"
            >{`${Math.round(progressPct * 100)}%`}</Text>
          </HStack>
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
        </VStack>

        <HStack justify="space-between" align="center" style={styles.footer}>
          <Text size="xs" color="textMuted">
            Restante
          </Text>
          <Text size="base" weight="bold" color="text">
            {formatCurrency(current)}
          </Text>
        </HStack>
      </VStack>
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
    iconView: {
      borderRadius: r.full,
      backgroundColor: t.primary,
      width: 40,
      height: 40,
      alignItems: "center",
      justifyContent: "center",
    },
    progressSection: {
      marginTop: sp[1],
    },
    bodyHead: {
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
      borderTopWidth: 1,
      borderTopColor: t.border,
      paddingTop: sp[2],
    },
  }),
);

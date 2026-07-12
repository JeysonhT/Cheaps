import MaterialIcons, {
  type MaterialIconsIconName,
} from "@react-native-vector-icons/material-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import Card from "@/components/Card";
import { HStack, Text, VStack } from "@/components/layout";
import { makeStyles } from "@/hooks/useTheme";
import type { DebtType, DebtWithCreditor } from "@/types";

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
      <Pressable onPress={() => router.push(`/(tabs)/debts/${debt.id}`)}>
        <VStack gap="3">
          {/* Header section with Icon and Details */}
          <HStack align="center">
            <View style={styles.iconView}>
              <MaterialIcons
                name={getDebtIcon(debt.type) as MaterialIconsIconName}
                color={styles.avatarIconColor.color}
                size={24}
              />
            </View>
            <VStack flex={1}>
              <Text size="md" weight="bold" color="text">
                {debt.name}
              </Text>
              <Text size="sm" color="textMuted" mt="1">
                {debt.creditor
                  ? `Acreedor: ${debt.creditor.name}`
                  : "Sin acreedor asignado"}
              </Text>
            </VStack>
            {onDelete && (
              <Pressable
                onPress={() => onDelete(debt.id)}
                style={styles.deleteButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <MaterialIcons
                  name="delete-outline"
                  size={20}
                  color={styles.deleteIconColor.color}
                />
              </Pressable>
            )}
          </HStack>

          {/* Progress Bar Section */}
          <VStack style={styles.progressContainer}>
            <HStack
              justify="space-between"
              align="center"
              style={styles.progressHeader}
            >
              <Text size="xs" color="textMuted">
                Progreso de liquidación
              </Text>
              <Text
                size="xs"
                weight="semibold"
                color="primary"
              >{`${displayPct}%`}</Text>
            </HStack>

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
          </VStack>

          {/* Footer with remaining amounts */}
          <HStack justify="space-between" align="center" style={styles.footer}>
            <VStack>
              <Text size="xs" color="textMuted" mb="1">
                Monto original
              </Text>
              <Text size="sm" weight="medium" color="text">
                {formatCurrency(original)}
              </Text>
            </VStack>
            <VStack align="flex-end">
              <Text size="xs" color="textMuted" mb="1" align="right">
                Saldo restante
              </Text>
              <Text size="base" weight="bold" color="primary">
                {formatCurrency(current)}
              </Text>
            </VStack>
          </HStack>
        </VStack>
      </Pressable>
    </Card>
  );
}

const useStyles = makeStyles((t, sp, _fs, _fw, r) =>
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
      marginBottom: sp[1],
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
      borderTopWidth: 1,
      borderTopColor: t.border,
      paddingTop: sp[3],
      marginTop: sp[1],
    },
  }),
);

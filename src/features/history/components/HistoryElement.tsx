import MaterialIcons from "@react-native-vector-icons/material-icons";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import { HStack, Text, VStack } from "@/components/layout";
import { makeStyles } from "@/hooks/useTheme";
import type { PayDebtWithDebt } from "@/types";
import { formatDate } from "@/utils";

interface HistoryElementProps {
  payment: PayDebtWithDebt;
}

export default function HistoryElement({ payment }: HistoryElementProps) {
  const styles = useStyles();
  const router = useRouter();

  const handlePress = () => {
    // Navegar a los detalles de la deuda asociada
    router.push(`/(tabs)/debts/${payment.idDebt}`);
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
    >
      <HStack align="center" gap="3" flex={1}>
        <View style={styles.iconView}>
          <MaterialIcons
            name="check-circle"
            size={24}
            color={styles.checkIconColor.color}
          />
        </View>
        <VStack flex={1}>
          <Text size="base" weight="semibold" color="text">
            {payment.debt.name}
          </Text>
          <Text size="xs" color="textMuted" mt="1">
            {formatDate(payment.payDate)}
          </Text>
        </VStack>
      </HStack>

      <VStack align="flex-end" justify="center" gap="1">
        <Text size="sm" weight="bold" color="primary">
          {`C$ ${payment.amount.toLocaleString("es-NI", { minimumFractionDigits: 2 })}`}
        </Text>
        <View style={styles.statusView}>
          <Text weight="bold" style={styles.statusText}>
            Pagado
          </Text>
        </View>
      </VStack>
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
      color: "#047857",
    },
  }),
);

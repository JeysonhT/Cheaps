import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, View } from "react-native";
import Card from "@/components/Card";
import { HStack, Text, VStack } from "@/components/layout";
import { makeStyles } from "@/hooks/useTheme";

interface DebtDetailsCardProps {
  original: number;
  current: number;
}

export default function DebtDetailsCard({
  original,
  current,
}: DebtDetailsCardProps) {
  const styles = useStyles();

  const paid = Math.max(0, original - current);
  const progressPct = original > 0 ? paid / original : 0;
  const displayPct = Math.round(progressPct * 100);

  const formatCurrency = (val: number) => {
    return `C$ ${val.toLocaleString("es-NI", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  return (
    <Card style={styles.financialCard}>
      <HStack justify="space-between" align="flex-end">
        <VStack>
          <Text size="xs" color="textMuted" mb="1">
            Saldo Pendiente
          </Text>
          <Text size="2xl" weight="bold" color="primary">
            {formatCurrency(current)}
          </Text>
        </VStack>
        <VStack align="flex-end">
          <Text size="xs" color="textMuted" mb="1" align="right">
            Monto Original
          </Text>
          <Text size="lg" weight="semibold" color="text">
            {formatCurrency(original)}
          </Text>
        </VStack>
      </HStack>

      {/* Progress bar inside bento card */}
      <VStack style={styles.progressSection}>
        <HStack
          justify="space-between"
          align="center"
          style={styles.progressHeader}
        >
          <Text size="sm" weight="medium" color="primary">
            Progreso de Pago
          </Text>
          <Text size="sm" weight="semibold" color="primary">
            {`${displayPct}% Completado`}
          </Text>
        </HStack>
        <View style={styles.progressTrack}>
          <LinearGradient
            colors={["#064e3b", "#10b981"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.progressFill, { width: `${displayPct}%` }]}
          />
        </View>
        <Text
          size="xs"
          color="textMuted"
          mt="2"
          style={{ fontStyle: "italic" }}
        >
          {`Has pagado ${formatCurrency(paid)} de tu deuda total.`}
        </Text>
      </VStack>
    </Card>
  );
}

const useStyles = makeStyles((t, sp, _fs, _fw, r) =>
  StyleSheet.create({
    financialCard: {
      backgroundColor: t.bgElevated,
      borderRadius: r.lg,
      padding: sp[4],
      borderWidth: 1,
      borderColor: t.border,
      marginBottom: sp[4],
    },
    progressSection: {
      marginTop: sp[4],
      borderTopWidth: 1,
      borderTopColor: t.border,
      paddingTop: sp[4],
    },
    progressHeader: {
      marginBottom: sp[1],
    },
    progressTrack: {
      height: 12,
      backgroundColor: t.bgMuted,
      borderRadius: r.full,
      overflow: "hidden",
      marginVertical: sp[1],
    },
    progressFill: {
      height: "100%",
      borderRadius: r.full,
    },
  }),
);

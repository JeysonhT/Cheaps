import { useRouter } from "expo-router";
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  History,
  Info,
  Settings,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import Card from "@/components/Card";
import { HStack, Text, VStack } from "@/components/layout";
import Main from "@/components/StyledView";
import { makeStyles } from "@/hooks/useTheme";
import { formatDate } from "@/utils";
import DebtDetailsCard from "./components/DebtDetailsCard";
import NextPaymentCard from "./components/NextPaymentCard";
import PaymentModal from "./components/PaymentModal";
import { useDebts } from "./hooks/useDebts";

interface DebtDetailsProps {
  id: number;
}

export default function DebtDetailsScreen({ id }: DebtDetailsProps) {
  const styles = useStyles();
  const router = useRouter();
  const { debts, payments, fetchDebts, fetchPayments } = useDebts();

  const [isPayModalOpen, setIsPayModalOpen] = useState(false);

  useEffect(() => {
    fetchDebts();
    fetchPayments(id);
  }, [id, fetchDebts, fetchPayments]);

  const debt = debts.find((d) => d.id === id);
  const debtPayments = payments[id] || [];

  if (!debt) {
    return (
      <Main style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={styles.loaderColor.color} />
      </Main>
    );
  }

  // Cálculos financieros
  const original = debt.amount;
  const current = debt.currentAmount;

  // Frecuencia en texto
  const getFrequencyText = (days: number) => {
    if (days === 1) return "Diario";
    if (days === 7) return "Semanal (7 días)";
    if (days === 15) return "Quincenal (15 días)";
    if (days === 30) return "Mensual (30 días)";
    return `Cada ${days} días`;
  };

  // Estimación de cuota
  const estimatedInstallment = original * (debt.payFrecuency / 365);

  // Formato de moneda
  const formatCurrency = (val: number) => {
    return `C$ ${val.toLocaleString("es-NI", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Estimación de próxima fecha de pago
  const getNextPayDate = () => {
    try {
      const baseDate =
        debtPayments.length > 0
          ? new Date(debtPayments[0].payDate)
          : new Date(debt.debtDate);
      baseDate.setDate(baseDate.getDate() + debt.payFrecuency);
      return baseDate.toISOString().split("T")[0];
    } catch (_e) {
      return debt.debtDate;
    }
  };

  const suggestedPaymentAmount = Math.min(
    current,
    estimatedInstallment > 0 ? estimatedInstallment : current,
  );

  return (
    <Main style={styles.outerContainer}>
      {/* Custom Header */}
      <HStack align="center" justify="space-between" style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft
            size={24}
            color={styles.iconColor.color}
          />
        </Pressable>
        <Text size="lg" weight="bold" color="primary">
          Detalles de la Deuda
        </Text>
        <View style={styles.helpButton}>
          <Settings
            size={24}
            color={styles.iconMutedColor.color}
          />
        </View>
      </HStack>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Debt Name Section */}
        <VStack style={styles.debtHeaderSection}>
          <Text
            size="xs"
            color="secondary"
            weight="semibold"
            style={styles.debtCategoryText}
          >
            {`Detalles de ${debt.type}`}
          </Text>
          <Text size="2xl" weight="bold" color="text" mt="1">
            {debt.name}
          </Text>
          <HStack align="center" gap="2" style={styles.creditorRow}>
            <View style={styles.creditorIconBg}>
              <Building2
                size={16}
                color={styles.iconColor.color}
              />
            </View>
            <Text size="base" weight="medium" color="textMuted">
              {debt.creditor ? debt.creditor.name : "Sin acreedor asignado"}
            </Text>
          </HStack>
        </VStack>

        {/* Financial Summary Bento Card */}
        <DebtDetailsCard original={original} current={current} />

        {/* Next Payment Card */}
        <NextPaymentCard
          currentAmount={current}
          nextPayDate={getNextPayDate()}
          estimatedInstallment={estimatedInstallment}
          onRegisterPayment={() => setIsPayModalOpen(true)}
        />

        {/* Technical Details Card */}
        <Card style={styles.technicalCard}>
          <HStack align="center" gap="2" style={styles.techCardTitle}>
            <Info
              size={20}
              color={styles.iconColor.color}
            />
            <Text size="base" weight="bold" color="text">
              Detalles Técnicos
            </Text>
          </HStack>
          <VStack>
            <HStack
              justify="space-between"
              align="center"
              style={styles.techRow}
            >
              <Text size="sm" color="textMuted">
                Frecuencia
              </Text>
              <Text size="sm" weight="semibold" color="text">
                {getFrequencyText(debt.payFrecuency)}
              </Text>
            </HStack>
            <HStack
              justify="space-between"
              align="center"
              style={styles.techRow}
            >
              <Text size="sm" color="textMuted">
                Fecha Inicio
              </Text>
              <Text size="sm" weight="semibold" color="text">
                {formatDate(debt.debtDate)}
              </Text>
            </HStack>
            <HStack
              justify="space-between"
              align="center"
              style={[styles.techRow, styles.noBorder]}
            >
              <Text size="sm" color="textMuted">
                Tipo
              </Text>
              <Text
                size="sm"
                weight="semibold"
                color="text"
                style={{ textTransform: "capitalize" }}
              >
                {debt.type}
              </Text>
            </HStack>
          </VStack>
        </Card>

        {/* Recent Payment History Card */}
        <Card style={styles.technicalCard}>
          <HStack justify="space-between" align="center">
            <HStack align="center" gap="2" style={styles.techCardTitle}>
              <History
                size={20}
                color={styles.iconColor.color}
              />
              <Text size="base" weight="bold" color="text">
                Historial Reciente
              </Text>
            </HStack>
          </HStack>

          {debtPayments.length === 0 ? (
            <VStack align="center" style={styles.emptyHistoryContainer}>
              <Text size="sm" color="textMuted" style={{ fontStyle: "italic" }}>
                No se han registrado pagos aún.
              </Text>
            </VStack>
          ) : (
            <VStack style={styles.tableContainer}>
              <HStack style={styles.tableHeader}>
                <Text size="xs" weight="bold" color="textMuted" flex={1}>
                  FECHA
                </Text>
                <Text size="xs" weight="bold" color="textMuted" flex={1}>
                  MONTO
                </Text>
                <Text
                  size="xs"
                  weight="bold"
                  color="textMuted"
                  flex={1}
                  align="right"
                >
                  ESTADO
                </Text>
              </HStack>
              {debtPayments.slice(0, 5).map((pay) => (
                <HStack key={pay.id} align="center" style={styles.tableRow}>
                  <Text size="xs" color="text" flex={1}>
                    {formatDate(pay.payDate)}
                  </Text>
                  <Text size="sm" weight="bold" color="text" flex={1}>
                    {formatCurrency(pay.amount)}
                  </Text>
                  <HStack align="center" gap="1" style={styles.statusBadge}>
                    <CheckCircle2
                      size={12}
                      color="#047857"
                    />
                    <Text weight="bold" style={styles.statusBadgeText}>
                      Completado
                    </Text>
                  </HStack>
                </HStack>
              ))}
            </VStack>
          )}
        </Card>
      </ScrollView>

      {/* Payment Registration Modal */}
      <PaymentModal
        visible={isPayModalOpen}
        onClose={() => setIsPayModalOpen(false)}
        debtId={id}
        currentAmount={current}
        suggestedAmount={suggestedPaymentAmount}
      />
    </Main>
  );
}

const useStyles = makeStyles((t, sp, _fs, _fw, r) =>
  StyleSheet.create({
    outerContainer: {
      flex: 1,
      backgroundColor: t.bgSubtle,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: t.bgSubtle,
    },
    loaderColor: {
      color: t.primary,
    },
    header: {
      height: 60,
      paddingHorizontal: sp[3],
      backgroundColor: t.bgElevated,
      borderBottomWidth: 1,
      borderBottomColor: t.border,
    },
    backButton: {
      padding: sp[2],
      borderRadius: r.full,
    },
    helpButton: {
      padding: sp[2],
      opacity: 0.8,
    },
    iconColor: {
      color: t.text,
    },
    iconMutedColor: {
      color: t.textMuted,
    },
    scrollContent: {
      padding: sp[4],
      paddingBottom: sp[8],
    },
    debtHeaderSection: {
      marginBottom: sp[4],
    },
    debtCategoryText: {
      textTransform: "uppercase",
      letterSpacing: 0.8,
    },
    creditorRow: {
      marginTop: sp[2],
    },
    creditorIconBg: {
      width: 24,
      height: 24,
      borderRadius: r.full,
      backgroundColor: t.bgMuted,
      alignItems: "center",
      justifyContent: "center",
    },
    technicalCard: {
      backgroundColor: t.bgElevated,
      borderRadius: r.lg,
      padding: sp[4],
      borderWidth: 1,
      borderColor: t.border,
      marginBottom: sp[4],
    },
    techCardTitle: {
      marginBottom: sp[3],
    },
    techRow: {
      paddingVertical: sp[2],
      borderBottomWidth: 1,
      borderBottomColor: t.border,
    },
    noBorder: {
      borderBottomWidth: 0,
      paddingBottom: 0,
    },
    emptyHistoryContainer: {
      paddingVertical: sp[4],
    },
    tableContainer: {
      marginTop: sp[1],
    },
    tableHeader: {
      borderBottomWidth: 1,
      borderBottomColor: t.borderStrong,
      paddingBottom: sp[2],
      marginBottom: sp[2],
    },
    tableRow: {
      paddingVertical: sp[3],
      borderBottomWidth: 1,
      borderBottomColor: t.border,
    },
    statusBadge: {
      backgroundColor: "#d1fae5", // soft emerald background
      paddingHorizontal: sp[2],
      paddingVertical: sp[1],
      borderRadius: r.full,
    },
    statusBadgeText: {
      fontSize: 10,
      color: "#047857",
    },
  }),
);

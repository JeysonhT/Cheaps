import Card from "@/components/Card";
import { Label, SubTitle, Title } from "@/components/StyledText";
import Main from "@/components/StyledView";
import { makeStyles } from "@/hooks/useTheme";
import MaterialIcons from "@react-native-vector-icons/material-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { useDebts } from "./hooks/useDebts";

interface DebtDetailsProps {
  id: number;
}

export default function DebtDetailsScreen({ id }: DebtDetailsProps) {
  const styles = useStyles();
  const router = useRouter();
  const { debts, payments, fetchDebts, fetchPayments, addPayment } = useDebts();

  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [payAmount, setPayAmount] = useState("");
  const [payReference, setPayReference] = useState("");
  const [payDate, setPayDate] = useState(
    () => new Date().toISOString().split("T")[0],
  );
  const [isSubmittingPay, setIsSubmittingPay] = useState(false);

  useEffect(() => {
    fetchDebts();
    fetchPayments(id);
  }, [id]);

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
  const paid = Math.max(0, original - current);
  const progressPct = original > 0 ? paid / original : 0;
  const displayPct = Math.round(progressPct * 100);

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

  // Formato de fecha legible
  const formatDate = (isoString: string) => {
    try {
      const parts = isoString.split("-");
      if (parts.length === 3) {
        const year = parts[0];
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

  // Estimar próxima fecha de pago
  const getNextPayDate = () => {
    try {
      const baseDate =
        debtPayments.length > 0
          ? new Date(debtPayments[0].payDate)
          : new Date(debt.debtDate);
      baseDate.setDate(baseDate.getDate() + debt.payFrecuency);
      return baseDate.toISOString().split("T")[0];
    } catch (e) {
      return debt.debtDate;
    }
  };

  const handleRegisterPayment = async () => {
    const amountVal = parseFloat(payAmount);
    if (isNaN(amountVal) || amountVal <= 0) {
      Alert.alert("Error", "Por favor ingresa un monto válido mayor a 0");
      return;
    }
    if (amountVal > current) {
      Alert.alert(
        "Monto excedido",
        "¿Estás seguro de pagar más del saldo pendiente?",
        [
          { text: "Cancelar", style: "cancel" },
          { text: "Proceder", onPress: executePayment },
        ],
      );
    } else {
      executePayment();
    }
  };

  const executePayment = async () => {
    const amountVal = parseFloat(payAmount);
    setIsSubmittingPay(true);
    try {
      await addPayment({
        idDebt: id,
        amount: amountVal,
        reference: payReference.trim() || null,
        payDate: payDate,
      });
      setIsPayModalOpen(false);
      setPayAmount("");
      setPayReference("");
      Alert.alert("Éxito", "Pago registrado exitosamente");
    } catch (e) {
      Alert.alert("Error", "No se pudo registrar el pago");
    } finally {
      setIsSubmittingPay(false);
    }
  };

  const openPaymentModal = () => {
    // Sugerir monto de cuota estimada o saldo restante, lo que sea menor
    const suggested = Math.min(
      current,
      estimatedInstallment > 0 ? estimatedInstallment : current,
    );
    setPayAmount(suggested.toFixed(2));
    setPayDate(new Date().toISOString().split("T")[0]);
    setIsPayModalOpen(true);
  };

  return (
    <Main style={styles.outerContainer}>
      {/* Custom Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons
            name="arrow-back"
            size={24}
            color={styles.iconColor.color}
          />
        </Pressable>
        <Title style={styles.headerTitle}>Detalles de la Deuda</Title>
        <View style={styles.helpButton}>
          <MaterialIcons
            name="settings"
            size={24}
            color={styles.iconMutedColor.color}
          />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Debt Name Section */}
        <View style={styles.debtHeaderSection}>
          <SubTitle
            style={styles.debtCategoryText}
          >{`Detalles de ${debt.type}`}</SubTitle>
          <Title style={styles.debtTitleText}>{debt.name}</Title>
          <View style={styles.creditorRow}>
            <View style={styles.creditorIconBg}>
              <MaterialIcons
                name="account-balance"
                size={16}
                color={styles.iconColor.color}
              />
            </View>
            <Label style={styles.creditorNameText}>
              {debt.creditor ? debt.creditor.name : "Sin acreedor asignado"}
            </Label>
          </View>
        </View>

        {/* Financial Summary Bento Card */}
        <Card style={styles.financialCard}>
          <View style={styles.financialRow}>
            <View>
              <SubTitle style={styles.financialLabel}>Saldo Pendiente</SubTitle>
              <Title style={styles.outstandingAmountText}>
                {formatCurrency(current)}
              </Title>
            </View>
            <View style={styles.alignRightContainer}>
              <SubTitle style={styles.financialLabel}>Monto Original</SubTitle>
              <Label style={styles.originalAmountText}>
                {formatCurrency(original)}
              </Label>
            </View>
          </View>

          {/* Progress bar inside bento card */}
          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <Label style={styles.progressLabel}>Progreso de Pago</Label>
              <Label
                style={styles.progressPctText}
              >{`${displayPct}% Completado`}</Label>
            </View>
            <View style={styles.progressTrack}>
              <LinearGradient
                colors={["#064e3b", "#10b981"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.progressFill, { width: `${displayPct}%` }]}
              />
            </View>
            <SubTitle style={styles.progressSubtext}>
              {`Has pagado ${formatCurrency(paid)} de tu deuda total.`}
            </SubTitle>
          </View>
        </Card>

        {/* Next Payment Card */}
        <View style={styles.nextPayCard}>
          <View>
            <View style={styles.nextPayHeader}>
              <MaterialIcons
                name="event-repeat"
                size={24}
                color="#ffffff"
                style={styles.nextPayIcon}
              />
              <Title style={styles.nextPayTitle}>Próximo Pago</Title>
            </View>
            <View style={styles.nextPayDetailRow}>
              <View>
                <SubTitle style={styles.nextPayLabel}>Fecha límite</SubTitle>
                <Label style={styles.nextPayValText}>
                  {formatDate(getNextPayDate())}
                </Label>
              </View>
              <View style={styles.alignRightContainer}>
                <SubTitle style={styles.nextPayLabel}>Monto a pagar</SubTitle>
                <Label style={styles.nextPayValText}>
                  {formatCurrency(
                    estimatedInstallment > 0 ? estimatedInstallment : current,
                  )}
                </Label>
              </View>
            </View>
          </View>
          {current > 0 ? (
            <Pressable
              style={({ pressed }) => [
                styles.registerPayBtn,
                pressed && styles.registerPayBtnPressed,
              ]}
              onPress={openPaymentModal}
            >
              <MaterialIcons name="payments" size={20} color="#064e3b" />
              <Label style={styles.registerPayBtnText}>Registrar Pago</Label>
            </Pressable>
          ) : (
            <View style={styles.paidBadge}>
              <MaterialIcons name="check-circle" size={20} color="#ffffff" />
              <Label style={styles.paidBadgeText}>Deuda Liquidada</Label>
            </View>
          )}
        </View>

        {/* Technical Details Card */}
        <Card style={styles.technicalCard}>
          <Title style={styles.techCardTitle}>
            <MaterialIcons
              name="info"
              size={20}
              color={styles.iconColor.color}
            />{" "}
            Detalles Técnicos
          </Title>
          <View style={styles.techList}>
            <View style={styles.techRow}>
              <SubTitle style={styles.techLabel}>Frecuencia</SubTitle>
              <Label style={styles.techValue}>
                {getFrequencyText(debt.payFrecuency)}
              </Label>
            </View>
            <View style={styles.techRow}>
              <SubTitle style={styles.techLabel}>Fecha Inicio</SubTitle>
              <Label style={styles.techValue}>
                {formatDate(debt.debtDate)}
              </Label>
            </View>
            <View style={[styles.techRow, styles.noBorder]}>
              <SubTitle style={styles.techLabel}>Tipo</SubTitle>
              <Label style={[styles.techValue, styles.capitalize]}>
                {debt.type}
              </Label>
            </View>
          </View>
        </Card>

        {/* Recent Payment History Card */}
        <Card style={styles.technicalCard}>
          <View style={styles.historyHeader}>
            <Title style={styles.techCardTitle}>
              <MaterialIcons
                name="history"
                size={20}
                color={styles.iconColor.color}
              />{" "}
              Historial Reciente
            </Title>
          </View>

          {debtPayments.length === 0 ? (
            <View style={styles.emptyHistoryContainer}>
              <SubTitle style={styles.emptyHistoryText}>
                No se han registrado pagos aún.
              </SubTitle>
            </View>
          ) : (
            <View style={styles.tableContainer}>
              <View style={styles.tableHeader}>
                <Label style={styles.tableHeaderCell}>FECHA</Label>
                <Label style={styles.tableHeaderCell}>MONTO</Label>
                <Label style={[styles.tableHeaderCell, styles.alignRight]}>
                  ESTADO
                </Label>
              </View>
              {debtPayments.slice(0, 5).map((pay) => (
                <View key={pay.id} style={styles.tableRow}>
                  <Label style={styles.tableCellDate}>
                    {formatDate(pay.payDate)}
                  </Label>
                  <Label style={styles.tableCellAmount}>
                    {formatCurrency(pay.amount)}
                  </Label>
                  <View style={styles.statusBadge}>
                    <MaterialIcons
                      name="check-circle"
                      size={12}
                      color="#047857"
                    />
                    <Label style={styles.statusBadgeText}>Completado</Label>
                  </View>
                </View>
              ))}
            </View>
          )}
        </Card>
      </ScrollView>

      {/* Payment Registration Modal */}
      <Modal
        visible={isPayModalOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsPayModalOpen(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Title style={styles.modalTitle}>Registrar Pago</Title>
              <Pressable onPress={() => setIsPayModalOpen(false)}>
                <MaterialIcons
                  name="close"
                  size={24}
                  color={styles.iconColor.color}
                />
              </Pressable>
            </View>

            <ScrollView
              style={styles.modalScrollView}
              contentContainerStyle={styles.modalBody}
            >
              <SubTitle style={styles.modalSubtitle}>
                Registra un abono para reducir el saldo pendiente de tu deuda.
              </SubTitle>

              {/* Field: Amount */}
              <View style={styles.modalInputGroup}>
                <Label style={styles.modalInputLabel}>Monto del Pago</Label>
                <View style={styles.modalInputWrapper}>
                  <Label style={styles.modalCurrency}>C$</Label>
                  <TextInput
                    value={payAmount}
                    onChangeText={setPayAmount}
                    placeholder="0.00"
                    placeholderTextColor={styles.placeholderColor.color}
                    keyboardType="numeric"
                    style={styles.modalTextInput}
                  />
                </View>
              </View>

              {/* Field: Reference */}
              <View style={styles.modalInputGroup}>
                <Label style={styles.modalInputLabel}>Referencia / Nota</Label>
                <View style={styles.modalInputWrapper}>
                  <TextInput
                    value={payReference}
                    onChangeText={setPayReference}
                    placeholder="Ej. Transferencia Bancaria, Pago en Sucursal"
                    placeholderTextColor={styles.placeholderColor.color}
                    style={styles.modalTextInput}
                  />
                </View>
              </View>

              {/* Field: Date */}
              <View style={styles.modalInputGroup}>
                <Label style={styles.modalInputLabel}>Fecha del Pago</Label>
                <View style={styles.modalInputWrapper}>
                  <TextInput
                    value={payDate}
                    onChangeText={setPayDate}
                    placeholder="AAAA-MM-DD"
                    placeholderTextColor={styles.placeholderColor.color}
                    style={styles.modalTextInput}
                  />
                </View>
              </View>

              <Pressable
                style={({ pressed }) => [
                  styles.modalSubmitBtn,
                  pressed && styles.modalSubmitBtnPressed,
                  isSubmittingPay && styles.modalSubmitBtnDisabled,
                ]}
                onPress={handleRegisterPayment}
                disabled={isSubmittingPay}
              >
                {isSubmittingPay ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <>
                    <MaterialIcons name="save" size={20} color="#ffffff" />
                    <Label style={styles.modalSubmitBtnText}>
                      Guardar Pago
                    </Label>
                  </>
                )}
              </Pressable>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </Main>
  );
}

const useStyles = makeStyles((t, sp, fs, fw, r) =>
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
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: sp[3],
      backgroundColor: t.bgElevated,
      borderBottomWidth: 1,
      borderBottomColor: t.border,
    },
    backButton: {
      padding: sp[2],
      borderRadius: r.full,
    },
    headerTitle: {
      fontSize: fs.lg,
      fontWeight: fw.bold,
      color: t.primary,
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
    placeholderColor: {
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
      fontSize: fs.xs,
      color: t.secondary,
      textTransform: "uppercase",
      fontWeight: fw.semibold,
      letterSpacing: 0.8,
    },
    debtTitleText: {
      fontSize: fs["2xl"],
      fontWeight: fw.bold,
      color: t.text,
      marginTop: sp[1],
    },
    creditorRow: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: sp[2],
      gap: sp[2],
    },
    creditorIconBg: {
      width: 24,
      height: 24,
      borderRadius: r.full,
      backgroundColor: t.bgMuted,
      alignItems: "center",
      justifyContent: "center",
    },
    creditorNameText: {
      fontSize: fs.base,
      color: t.textMuted,
      fontWeight: fw.medium,
    },
    financialCard: {
      backgroundColor: t.bgElevated,
      borderRadius: r.lg,
      padding: sp[4],
      borderWidth: 1,
      borderColor: t.border,
      marginBottom: sp[4],
    },
    financialRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-end",
    },
    financialLabel: {
      fontSize: fs.xs,
      color: t.textMuted,
      marginBottom: sp[1],
    },
    outstandingAmountText: {
      fontSize: fs["2xl"],
      fontWeight: fw.bold,
      color: t.primary,
    },
    alignRightContainer: {
      alignItems: "flex-end",
    },
    originalAmountText: {
      fontSize: fs.lg,
      fontWeight: fw.semibold,
      color: t.text,
    },
    progressSection: {
      marginTop: sp[4],
      borderTopWidth: 1,
      borderTopColor: t.border,
      paddingTop: sp[4],
    },
    progressHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: sp[1],
    },
    progressLabel: {
      fontSize: fs.sm,
      fontWeight: fw.medium,
      color: t.primary,
    },
    progressPctText: {
      fontSize: fs.sm,
      fontWeight: fw.semibold,
      color: t.primary,
      fontFamily: "SpaceMono",
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
    progressSubtext: {
      fontSize: fs.xs,
      color: t.textMuted,
      fontStyle: "italic",
      marginTop: sp[2],
    },
    nextPayCard: {
      backgroundColor: "#064e3b", // solid primary green
      borderRadius: r.lg,
      padding: sp[4],
      marginBottom: sp[4],
      gap: sp[4],
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
    nextPayHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: sp[2],
      marginBottom: sp[3],
    },
    nextPayIcon: {
      marginTop: -2,
    },
    nextPayTitle: {
      color: "#ffffff",
      fontSize: fs.md,
      fontWeight: fw.bold,
    },
    nextPayDetailRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    nextPayLabel: {
      color: "rgba(255, 255, 255, 0.7)",
      fontSize: fs.xs,
      marginBottom: 2,
    },
    nextPayValText: {
      color: "#ffffff",
      fontSize: fs.md,
      fontWeight: fw.bold,
    },
    registerPayBtn: {
      backgroundColor: "#ffffff",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      height: 44,
      borderRadius: r.md,
      gap: sp[2],
    },
    registerPayBtnPressed: {
      opacity: 0.9,
      transform: [{ scale: 0.98 }],
    },
    registerPayBtnText: {
      color: "#064e3b",
      fontWeight: fw.bold,
      fontSize: fs.base,
    },
    paidBadge: {
      backgroundColor: "#10b981", // Success green badge
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      height: 44,
      borderRadius: r.md,
      gap: sp[2],
    },
    paidBadgeText: {
      color: "#ffffff",
      fontWeight: fw.bold,
      fontSize: fs.base,
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
      fontSize: fs.base,
      fontWeight: fw.bold,
      color: t.text,
      marginBottom: sp[3],
    },
    techList: {
      flexDirection: "column",
    },
    techRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: sp[2],
      borderBottomWidth: 1,
      borderBottomColor: t.border,
    },
    noBorder: {
      borderBottomWidth: 0,
      paddingBottom: 0,
    },
    techLabel: {
      fontSize: fs.sm,
      color: t.textMuted,
    },
    techValue: {
      fontSize: fs.sm,
      fontWeight: fw.semibold,
      color: t.text,
    },
    capitalize: {
      textTransform: "capitalize",
    },
    historyHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    emptyHistoryContainer: {
      paddingVertical: sp[4],
      alignItems: "center",
    },
    emptyHistoryText: {
      fontSize: fs.sm,
      color: t.textMuted,
      fontStyle: "italic",
    },
    tableContainer: {
      marginTop: sp[1],
    },
    tableHeader: {
      flexDirection: "row",
      borderBottomWidth: 1,
      borderBottomColor: t.borderStrong,
      paddingBottom: sp[2],
      marginBottom: sp[2],
    },
    tableHeaderCell: {
      flex: 1,
      fontSize: fs.xs,
      fontWeight: fw.bold,
      color: t.textMuted,
    },
    tableRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: sp[3],
      borderBottomWidth: 1,
      borderBottomColor: t.border,
    },
    tableCellDate: {
      flex: 1,
      fontSize: fs.xs,
      color: t.text,
      fontFamily: "SpaceMono",
    },
    tableCellAmount: {
      flex: 1,
      fontSize: fs.sm,
      fontWeight: fw.bold,
      color: t.text,
    },
    statusBadge: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#d1fae5", // soft emerald background
      paddingHorizontal: sp[2],
      paddingVertical: sp[1],
      borderRadius: r.full,
      gap: 4,
    },
    statusBadgeText: {
      fontSize: 10,
      fontWeight: fw.bold,
      color: "#047857",
    },
    insightBanner: {
      backgroundColor: t.bgElevated,
      borderRadius: r.lg,
      borderLeftWidth: 4,
      borderLeftColor: t.secondary,
      padding: sp[4],
      flexDirection: "row",
      alignItems: "center",
      gap: sp[3],
      borderWidth: 1,
      borderColor: t.border,
    },
    insightIconBg: {
      width: 44,
      height: 44,
      borderRadius: r.full,
      backgroundColor: "rgba(37, 99, 235, 0.08)", // light secondary blue
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    },
    insightIconColor: {
      color: t.secondary,
    },
    insightTextContainer: {
      flex: 1,
    },
    insightTitle: {
      fontSize: fs.base,
      fontWeight: fw.bold,
      color: t.text,
      marginBottom: 2,
    },
    insightDesc: {
      fontSize: fs.sm,
      color: t.textMuted,
      lineHeight: 18,
    },
    alignRight: {
      textAlign: "right",
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "center",
      alignItems: "center",
      padding: sp[4],
    },
    modalContent: {
      backgroundColor: t.bgElevated,
      borderRadius: r.lg,
      width: "100%",
      maxWidth: 360,
      maxHeight: "85%",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 10,
      elevation: 5,
    },
    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: sp[4],
      borderBottomWidth: 1,
      borderBottomColor: t.border,
    },
    modalTitle: {
      fontSize: fs.lg,
      fontWeight: fw.bold,
      color: t.text,
    },
    modalScrollView: {
      flexShrink: 1,
    },
    modalBody: {
      padding: sp[4],
      gap: sp[4],
    },
    modalSubtitle: {
      fontSize: fs.sm,
      color: t.textMuted,
      marginBottom: sp[2],
    },
    modalInputGroup: {
      gap: sp[1],
    },
    modalInputLabel: {
      fontSize: fs.xs,
      fontWeight: fw.bold,
      color: t.primary,
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    modalInputWrapper: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: t.bg,
      borderWidth: 1,
      borderColor: t.borderStrong,
      borderRadius: r.md,
      paddingHorizontal: sp[3],
      height: 48,
    },
    modalCurrency: {
      marginRight: sp[2],
      fontWeight: fw.bold,
      color: t.textMuted,
    },
    modalTextInput: {
      flex: 1,
      fontSize: fs.base,
      color: t.text,
      height: "100%",
    },
    modalSubmitBtn: {
      backgroundColor: t.primary,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      height: 50,
      borderRadius: r.md,
      gap: sp[2],
      marginTop: sp[4],
    },
    modalSubmitBtnPressed: {
      opacity: 0.9,
      transform: [{ scale: 0.98 }],
    },
    modalSubmitBtnDisabled: {
      opacity: 0.6,
    },
    modalSubmitBtnText: {
      color: "#ffffff",
      fontWeight: fw.bold,
      fontSize: fs.base,
    },
  }),
);

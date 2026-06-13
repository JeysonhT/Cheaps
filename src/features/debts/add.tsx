import { Label, SubTitle, Title } from "@/components/StyledText";
import Main from "@/components/StyledView";
import { useCreditors } from "@/features/seller/hooks/useCreditors";
import { makeStyles } from "@/hooks/useTheme";
import { DebtType } from "@/types";
import MaterialIcons from "@react-native-vector-icons/material-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { useDebts } from "./hooks/useDebts";

export default function AddDebtScreen() {
  const styles = useStyles();
  const router = useRouter();
  const { addDebt } = useDebts();
  const { creditors, fetchCreditors } = useCreditors();

  useEffect(() => {
    fetchCreditors();
  }, []);

  const [selectedCreditorId, setSelectedCreditorId] = useState<string>("");
  const [name, setName] = useState("");
  const [debtType, setDebtType] = useState<DebtType>("personal");
  const [amount, setAmount] = useState("");
  const [currentAmount, setCurrentAmount] = useState("");
  const [payFrequency, setPayFrequency] = useState("30");
  const [startDate, setStartDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // YYYY-MM-DD
  });

  const [isNameFocused, setIsNameFocused] = useState(false);
  const [isAmountFocused, setIsAmountFocused] = useState(false);
  const [isCurrentAmountFocused, setIsCurrentAmountFocused] = useState(false);
  const [isFrequencyFocused, setIsFrequencyFocused] = useState(false);
  const [isDateFocused, setIsDateFocused] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Calcular progreso en tiempo real
  const originalVal = parseFloat(amount) || 0;
  const currentVal = parseFloat(currentAmount) || 0;
  const paidVal = Math.max(0, originalVal - currentVal);
  const progressPct = originalVal > 0 ? (paidVal / originalVal) * 100 : 0;
  const displayPct = Math.round(Math.min(100, Math.max(0, progressPct)));

  const getFreqDescription = (val: number) => {
    if (val === 1) return "Pago diario";
    if (val === 7) return "Pago semanal recurrente";
    if (val === 15) return "Pago quincenal recurrente";
    if (val === 30) return "Pago mensual estándar (cada 30 días)";
    return `Pago cada ${val} días`;
  };

  const handleSave = async () => {
    if (!selectedCreditorId.trim()) {
      setErrorMsg("El id del acreedor es necesario");
      return;
    }

    if (!name.trim()) {
      setErrorMsg("El nombre de la deuda es requerido");
      return;
    }
    if (!amount.trim() || isNaN(originalVal) || originalVal <= 0) {
      setErrorMsg("El monto original debe ser un número mayor a 0");
      return;
    }
    if (!currentAmount.trim() || isNaN(currentVal) || currentVal < 0) {
      setErrorMsg("El saldo pendiente debe ser un número válido");
      return;
    }
    if (currentVal > originalVal) {
      setErrorMsg(
        "El saldo pendiente no puede ser mayor que el monto original",
      );
      return;
    }
    const freq = parseInt(payFrequency);
    if (isNaN(freq) || freq <= 0) {
      setErrorMsg("La frecuencia de pago debe ser al menos 1 día");
      return;
    }

    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      await addDebt({
        idCreditor: selectedCreditorId ? parseInt(selectedCreditorId) : null,
        type: debtType,
        payFrecuency: freq,
        name: name.trim(),
        debtDate: startDate,
        amount: originalVal,
        currentAmount: currentVal,
      });
      router.back();
    } catch (error: any) {
      setErrorMsg(error.message || "Ocurrió un error al registrar la deuda");
      setIsSubmitting(false);
    }
  };

  const typesList: { type: DebtType; label: string; icon: string }[] = [
    { type: "personal", label: "Personal", icon: "person" },
    { type: "tarjeta", label: "Tarjeta", icon: "credit-card" },
    { type: "hipoteca", label: "Hipoteca", icon: "home" },
    { type: "auto", label: "Auto", icon: "directions-car" },
    { type: "servicio", label: "Servicio", icon: "bolt" },
    { type: "otro", label: "Otro", icon: "more-horiz" },
  ];

  const selectedCreditorName = selectedCreditorId
    ? creditors.find((c) => c.id.toString() === selectedCreditorId)?.name
    : "Selecciona un acreedor";

  return (
    <Main style={styles.outerContainer}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.keyboardContainer}
      >
        {/* Custom Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <MaterialIcons
              name="arrow-back"
              size={24}
              color={styles.iconColor.color}
            />
          </Pressable>
          <Title style={styles.headerTitle}>Registrar Deuda</Title>
          <View style={styles.helpButton}>
            <MaterialIcons
              name="info-outline"
              size={24}
              color={styles.iconMutedColor.color}
            />
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Welcome Info Card */}
          <View style={styles.introCard}>
            <View style={styles.introIconContainer}>
              <MaterialIcons name="add-card" size={24} color="#064e3b" />
            </View>
            <View style={styles.introTextContainer}>
              <Title style={styles.introTitle}>Detalles de la Deuda</Title>
              <SubTitle style={styles.introSubtitle}>
                Ingresa la información detallada de tu deuda para hacer un
                seguimiento eficiente
              </SubTitle>
            </View>
          </View>

          {/* Form container */}
          <View style={styles.formCard}>
            {/* Field: Creditor */}
            <View style={styles.inputGroup}>
              <Label style={styles.inputLabel}>Acreedor</Label>
              <Pressable
                style={styles.dropdownButton}
                onPress={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <Label
                  style={
                    selectedCreditorId
                      ? styles.dropdownTextSelected
                      : styles.dropdownTextPlaceholder
                  }
                >
                  {selectedCreditorName}
                </Label>
                <MaterialIcons
                  name="expand-more"
                  size={24}
                  color={styles.iconMutedColor.color}
                />
              </Pressable>

              {isDropdownOpen && (
                <View style={styles.dropdownList}>
                  {creditors.map((c) => (
                    <Pressable
                      key={c.id}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setSelectedCreditorId(c.id.toString());
                        setIsDropdownOpen(false);
                      }}
                    >
                      <Label style={styles.dropdownItemText}>{c.name}</Label>
                    </Pressable>
                  ))}
                </View>
              )}
            </View>

            {/* Field: Name */}
            <View style={styles.inputGroup}>
              <Label style={styles.inputLabel}>Nombre de la Deuda</Label>
              <View
                style={[
                  styles.inputWrapper,
                  isNameFocused && styles.inputWrapperFocused,
                ]}
              >
                <TextInput
                  value={name}
                  onChangeText={(val) => {
                    setName(val);
                    if (errorMsg) setErrorMsg(null);
                  }}
                  placeholder="Ej. Préstamo Personal"
                  placeholderTextColor={styles.placeholderColor.color}
                  style={styles.textInput}
                  onFocus={() => setIsNameFocused(true)}
                  onBlur={() => setIsNameFocused(false)}
                />
              </View>
            </View>

            {/* Field: Debt Type */}
            <View style={styles.inputGroup}>
              <Label style={styles.inputLabel}>Tipo de Deuda</Label>
              <View style={styles.typesGrid}>
                {typesList.map((item) => {
                  const isActive = debtType === item.type;
                  return (
                    <Pressable
                      key={item.type}
                      style={[
                        styles.typeButton,
                        isActive && styles.typeButtonActive,
                      ]}
                      onPress={() => setDebtType(item.type)}
                    >
                      <MaterialIcons
                        name={item.icon as any}
                        size={20}
                        color={
                          isActive ? "#ffffff" : styles.iconMutedColor.color
                        }
                      />
                      <Label
                        style={[
                          styles.typeButtonText,
                          isActive && styles.typeButtonTextActive,
                        ]}
                      >
                        {item.label}
                      </Label>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* Financials Row */}
            <View style={styles.row}>
              {/* Monto Original */}
              <View style={[styles.inputGroup, styles.flexHalf]}>
                <Label style={styles.inputLabel}>Monto Original</Label>
                <View
                  style={[
                    styles.inputWrapper,
                    isAmountFocused && styles.inputWrapperFocused,
                  ]}
                >
                  <Label style={styles.currencyPrefix}>C$</Label>
                  <TextInput
                    value={amount}
                    onChangeText={setAmount}
                    placeholder="0.00"
                    placeholderTextColor={styles.placeholderColor.color}
                    keyboardType="numeric"
                    style={styles.textInputNumeric}
                    onFocus={() => setIsAmountFocused(true)}
                    onBlur={() => setIsAmountFocused(false)}
                  />
                </View>
              </View>

              {/* Saldo Pendiente */}
              <View style={[styles.inputGroup, styles.flexHalf]}>
                <Label style={styles.inputLabel}>Saldo Pendiente</Label>
                <View
                  style={[
                    styles.inputWrapper,
                    isCurrentAmountFocused && styles.inputWrapperFocused,
                  ]}
                >
                  <Label style={styles.currencyPrefix}>C$</Label>
                  <TextInput
                    value={currentAmount}
                    onChangeText={setCurrentAmount}
                    placeholder="0.00"
                    placeholderTextColor={styles.placeholderColor.color}
                    keyboardType="numeric"
                    style={styles.textInputNumeric}
                    onFocus={() => setIsCurrentAmountFocused(true)}
                    onBlur={() => setIsCurrentAmountFocused(false)}
                  />
                </View>
              </View>
            </View>

            {/* Timing row */}
            <View style={styles.row}>
              {/* Frecuencia de Pago */}
              <View style={[styles.inputGroup, styles.flexHalf]}>
                <Label style={styles.inputLabel}>Frecuencia (Días)</Label>
                <View
                  style={[
                    styles.inputWrapper,
                    isFrequencyFocused && styles.inputWrapperFocused,
                  ]}
                >
                  <TextInput
                    value={payFrequency}
                    onChangeText={setPayFrequency}
                    placeholder="30"
                    placeholderTextColor={styles.placeholderColor.color}
                    keyboardType="numeric"
                    style={styles.textInputNumeric}
                    onFocus={() => setIsFrequencyFocused(true)}
                    onBlur={() => setIsFrequencyFocused(false)}
                  />
                  <Label style={styles.inputSuffix}>días</Label>
                </View>
              </View>

              {/* Fecha de Inicio */}
              <View style={[styles.inputGroup, styles.flexHalf]}>
                <Label style={styles.inputLabel}>Fecha de Inicio</Label>
                <View
                  style={[
                    styles.inputWrapper,
                    isDateFocused && styles.inputWrapperFocused,
                  ]}
                >
                  <TextInput
                    value={startDate}
                    onChangeText={setStartDate}
                    placeholder="AAAA-MM-DD"
                    placeholderTextColor={styles.placeholderColor.color}
                    style={styles.textInput}
                    onFocus={() => setIsDateFocused(true)}
                    onBlur={() => setIsDateFocused(false)}
                  />
                </View>
              </View>
            </View>

            <SubTitle style={styles.frequencyDesc}>
              {getFreqDescription(parseInt(payFrequency) || 0)}
            </SubTitle>

            {errorMsg && <Label style={styles.errorText}>{errorMsg}</Label>}
          </View>

          {/* Real-time Visualization Component */}
          <View style={styles.visualCard}>
            <View style={styles.visualHeader}>
              <Label style={styles.visualTitle}>Progreso Estimado</Label>
              <Label style={styles.visualPct}>{displayPct}%</Label>
            </View>
            <View style={styles.visualTrack}>
              <View style={[styles.visualFill, { width: `${displayPct}%` }]} />
            </View>
            <View style={styles.visualFooter}>
              <SubTitle style={styles.visualFooterText}>
                Inicio del Ciclo
              </SubTitle>
              <SubTitle style={styles.visualFooterText}>
                Meta de Liquidación
              </SubTitle>
            </View>
          </View>
        </ScrollView>

        {/* Footer sticky */}
        <View style={styles.footer}>
          <Pressable
            style={({ pressed }) => [
              styles.submitButton,
              pressed && styles.submitButtonPressed,
              isSubmitting && styles.submitButtonDisabled,
            ]}
            onPress={handleSave}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <>
                <MaterialIcons name="save" size={20} color="#ffffff" />
                <Label style={styles.submitButtonText}>Registrar Deuda</Label>
              </>
            )}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Main>
  );
}

const useStyles = makeStyles((t, sp, fs, fw, r) =>
  StyleSheet.create({
    outerContainer: {
      flex: 1,
      backgroundColor: t.bgSubtle,
    },
    keyboardContainer: {
      flex: 1,
    },
    scrollView: {
      flex: 1,
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
    introCard: {
      backgroundColor: t.bgElevated,
      borderWidth: 1,
      borderColor: t.border,
      borderRadius: r.lg,
      padding: sp[4],
      flexDirection: "row",
      alignItems: "flex-start",
      gap: sp[3],
      marginBottom: sp[4],
    },
    introIconContainer: {
      backgroundColor: "#b0f0d6", // light emerald background
      width: 44,
      height: 44,
      borderRadius: r.md,
      alignItems: "center",
      justifyContent: "center",
    },
    introTextContainer: {
      flex: 1,
    },
    introTitle: {
      fontSize: fs.md,
      fontWeight: fw.bold,
      color: t.text,
      marginBottom: 2,
    },
    introSubtitle: {
      fontSize: fs.sm,
      color: t.textMuted,
      lineHeight: 18,
    },
    formCard: {
      backgroundColor: t.bgElevated,
      borderRadius: r.lg,
      padding: sp[4],
      borderWidth: 1,
      borderColor: t.border,
      gap: sp[4],
      zIndex: 10,
    },
    inputGroup: {
      gap: sp[1],
    },
    inputLabel: {
      fontSize: fs.sm,
      fontWeight: fw.semibold,
      color: t.primary,
      textTransform: "uppercase",
      letterSpacing: 0.5,
      paddingLeft: sp[1],
    },
    dropdownButton: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: t.bg,
      borderWidth: 1,
      borderColor: t.borderStrong,
      borderRadius: r.md,
      paddingHorizontal: sp[3],
      height: 48,
    },
    dropdownTextPlaceholder: {
      color: t.textMuted,
      fontSize: fs.base,
    },
    dropdownTextSelected: {
      color: t.text,
      fontSize: fs.base,
    },
    dropdownList: {
      backgroundColor: t.bgElevated,
      borderWidth: 1,
      borderColor: t.borderStrong,
      borderRadius: r.md,
      marginTop: sp[1],
      maxHeight: 200,
      overflow: "scroll",
    },
    dropdownItem: {
      padding: sp[3],
      borderBottomWidth: 1,
      borderBottomColor: t.border,
    },
    dropdownItemText: {
      fontSize: fs.base,
      color: t.text,
    },
    inputWrapper: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: t.bg,
      borderWidth: 1,
      borderColor: t.borderStrong,
      borderRadius: r.md,
      paddingHorizontal: sp[3],
      height: 48,
    },
    inputWrapperFocused: {
      borderColor: t.primary,
      borderWidth: 2,
    },
    textInput: {
      flex: 1,
      fontSize: fs.base,
      color: t.text,
      height: "100%",
    },
    textInputNumeric: {
      flex: 1,
      fontSize: fs.base,
      color: t.text,
      height: "100%",
      fontFamily: "SpaceMono", // Using custom tabular fonts
    },
    currencyPrefix: {
      marginRight: sp[2],
      fontWeight: fw.semibold,
      color: t.textMuted,
    },
    inputSuffix: {
      marginLeft: sp[2],
      color: t.textMuted,
      fontSize: fs.sm,
    },
    typesGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: sp[2],
      backgroundColor: t.bgSubtle,
      padding: sp[2],
      borderRadius: r.lg,
      borderWidth: 1,
      borderColor: t.border,
    },
    typeButton: {
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      width: "30.5%", // Approx 3 items per row
      paddingVertical: sp[2],
      borderRadius: r.md,
      backgroundColor: t.bgElevated,
      borderWidth: 1,
      borderColor: t.border,
      gap: sp[1],
    },
    typeButtonActive: {
      backgroundColor: "#064e3b", // solid primary container color from stitch
      borderColor: "#064e3b",
    },
    typeButtonText: {
      fontSize: fs.xs,
      fontWeight: fw.medium,
      color: t.textMuted,
    },
    typeButtonTextActive: {
      color: "#ffffff",
      fontWeight: fw.semibold,
    },
    row: {
      flexDirection: "row",
      gap: sp[3],
    },
    flexHalf: {
      flex: 1,
    },
    frequencyDesc: {
      fontSize: fs.xs,
      color: t.textMuted,
      fontStyle: "italic",
      paddingLeft: sp[1],
      marginTop: -sp[2],
    },
    errorText: {
      color: t.error,
      fontSize: fs.sm,
      fontWeight: fw.semibold,
      paddingHorizontal: sp[1],
    },
    visualCard: {
      backgroundColor: t.bgElevated,
      borderRadius: r.lg,
      padding: sp[4],
      borderWidth: 1,
      borderColor: t.border,
      marginTop: sp[4],
      gap: sp[2],
    },
    visualHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-end",
    },
    visualTitle: {
      fontSize: fs.sm,
      color: t.textMuted,
    },
    visualPct: {
      fontSize: fs.base,
      fontWeight: fw.bold,
      color: t.primary,
    },
    visualTrack: {
      height: 12,
      backgroundColor: t.bgMuted,
      borderRadius: r.full,
      overflow: "hidden",
      marginVertical: sp[1],
    },
    visualFill: {
      height: "100%",
      backgroundColor: "#064e3b", // solid primary green
      borderRadius: r.full,
    },
    visualFooter: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    visualFooterText: {
      fontSize: fs.xs,
      color: t.textMuted,
      textTransform: "uppercase",
      fontWeight: fw.medium,
    },
    footer: {
      backgroundColor: t.bgElevated,
      borderTopWidth: 1,
      borderTopColor: t.border,
      padding: sp[4],
    },
    submitButton: {
      backgroundColor: t.primary,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      height: 52,
      borderRadius: r.lg,
      gap: sp[2],
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    submitButtonPressed: {
      opacity: 0.9,
      transform: [{ scale: 0.98 }],
    },
    submitButtonDisabled: {
      opacity: 0.6,
    },
    submitButtonText: {
      color: "#ffffff",
      fontWeight: fw.bold,
      fontSize: fs.md,
    },
  }),
);

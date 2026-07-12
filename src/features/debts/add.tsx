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
import { HStack, Text, VStack } from "@/components/layout";
import Main from "@/components/StyledView";
import { useCreditors } from "@/features/seller/hooks/useCreditors";
import { makeStyles } from "@/hooks/useTheme";
import type { DebtType } from "@/types";
import useCheckCreditors from "./hooks/useCheckCreditors";
import { useDebts } from "./hooks/useDebts";

export default function AddDebtScreen() {
  const styles = useStyles();
  const router = useRouter();
  const { addDebt } = useDebts();
  const { creditors, fetchCreditors } = useCreditors();

  const { isLoading, response } = useCheckCreditors();

  useEffect(() => {
    fetchCreditors();
  }, [fetchCreditors]);

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
    const freq = parseInt(payFrequency, 10);
    if (isNaN(freq) || freq <= 0) {
      setErrorMsg("La frecuencia de pago debe ser al menos 1 día");
      return;
    }

    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      await addDebt({
        idCreditor: selectedCreditorId
          ? parseInt(selectedCreditorId, 10)
          : null,
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

  if (isLoading) {
    return (
      <Main>
        <VStack flex={1} justify="center" align="center" p="2" gap="2">
          <ActivityIndicator color="#000" />
          <Text size="md" weight="bold" align="center">
            Cargando datos de Acreedores
          </Text>
        </VStack>
      </Main>
    );
  }

  if (response?.totalCreditors === 0) {
    return (
      <Main>
        <VStack flex={1} justify="center" align="center" p="2" gap="2">
          <Text size="xl" weight="bold" align="center">
            Para crear una deuda ingresa primero un acreedor
          </Text>
        </VStack>
      </Main>
    );
  }

  return (
    <Main style={styles.outerContainer}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.keyboardContainer}
      >
        {/* Custom Header */}
        <HStack align="center" justify="space-between" style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <MaterialIcons
              name="arrow-back"
              size={24}
              color={styles.iconColor.color}
            />
          </Pressable>
          <Text size="lg" weight="bold" color="primary">
            Registrar Deuda
          </Text>
          <View style={styles.helpButton}>
            <MaterialIcons
              name="info-outline"
              size={24}
              color={styles.iconMutedColor.color}
            />
          </View>
        </HStack>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Welcome Info Card */}
          <HStack align="flex-start" gap="3" style={styles.introCard}>
            <View style={styles.introIconContainer}>
              <MaterialIcons name="add-card" size={24} color="#064e3b" />
            </View>
            <VStack flex={1}>
              <Text size="md" weight="bold" color="text" mb="1">
                Detalles de la Deuda
              </Text>
              <Text size="sm" color="textMuted" style={styles.introSubtitle}>
                Ingresa la información detallada de tu deuda para hacer un
                seguimiento eficiente
              </Text>
            </VStack>
          </HStack>

          {/* Form container */}
          <VStack gap="4" style={styles.formCard}>
            {/* Field: Creditor */}
            <VStack gap="1">
              <Text
                size="sm"
                weight="semibold"
                color="primary"
                pl="1"
                style={styles.inputLabel}
              >
                Acreedor
              </Text>
              <Pressable onPress={() => setIsDropdownOpen(!isDropdownOpen)}>
                <HStack
                  align="center"
                  justify="space-between"
                  style={styles.dropdownButton}
                >
                  <Text
                    size="base"
                    color={selectedCreditorId ? "text" : "textMuted"}
                  >
                    {selectedCreditorName}
                  </Text>
                  <MaterialIcons
                    name="expand-more"
                    size={24}
                    color={styles.iconMutedColor.color}
                  />
                </HStack>
              </Pressable>

              {isDropdownOpen && (
                <VStack style={styles.dropdownList}>
                  {creditors.map((c) => (
                    <Pressable
                      key={c.id}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setSelectedCreditorId(c.id.toString());
                        setIsDropdownOpen(false);
                      }}
                    >
                      <Text size="base" color="text">
                        {c.name}
                      </Text>
                    </Pressable>
                  ))}
                </VStack>
              )}
            </VStack>

            {/* Field: Name */}
            <VStack gap="1">
              <Text
                size="sm"
                weight="semibold"
                color="primary"
                pl="1"
                style={styles.inputLabel}
              >
                Nombre de la Deuda
              </Text>
              <HStack
                align="center"
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
              </HStack>
            </VStack>

            {/* Field: Debt Type */}
            <VStack gap="1">
              <Text
                size="sm"
                weight="semibold"
                color="primary"
                pl="1"
                style={styles.inputLabel}
              >
                Tipo de Deuda
              </Text>
              <View style={styles.typesGrid}>
                {typesList.map((item) => {
                  const isActive = debtType === item.type;
                  return (
                    <Pressable
                      key={item.type}
                      onPress={() => setDebtType(item.type)}
                      style={{ width: "30.5%" }}
                    >
                      <VStack
                        align="center"
                        justify="center"
                        gap="1"
                        style={[
                          styles.typeButton,
                          isActive && styles.typeButtonActive,
                        ]}
                      >
                        <MaterialIcons
                          name={item.icon as any}
                          size={20}
                          color={
                            isActive ? "#ffffff" : styles.iconMutedColor.color
                          }
                        />
                        <Text
                          size="xs"
                          weight={isActive ? "semibold" : "medium"}
                          style={[
                            styles.typeButtonText,
                            isActive && styles.typeButtonTextActive,
                          ]}
                        >
                          {item.label}
                        </Text>
                      </VStack>
                    </Pressable>
                  );
                })}
              </View>
            </VStack>

            {/* Financials Row */}
            <HStack gap="3">
              {/* Monto Original */}
              <VStack flex={1} gap="1">
                <Text
                  size="sm"
                  weight="semibold"
                  color="primary"
                  pl="1"
                  style={styles.inputLabel}
                >
                  Monto Original
                </Text>
                <HStack
                  align="center"
                  style={[
                    styles.inputWrapper,
                    isAmountFocused && styles.inputWrapperFocused,
                  ]}
                >
                  <Text weight="semibold" color="textMuted" mr="2">
                    C$
                  </Text>
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
                </HStack>
              </VStack>

              {/* Saldo Pendiente */}
              <VStack flex={1} gap="1">
                <Text
                  size="sm"
                  weight="semibold"
                  color="primary"
                  pl="1"
                  style={styles.inputLabel}
                >
                  Saldo Pendiente
                </Text>
                <HStack
                  align="center"
                  style={[
                    styles.inputWrapper,
                    isCurrentAmountFocused && styles.inputWrapperFocused,
                  ]}
                >
                  <Text weight="semibold" color="textMuted" mr="2">
                    C$
                  </Text>
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
                </HStack>
              </VStack>
            </HStack>

            {/* Timing row */}
            <HStack gap="3">
              {/* Frecuencia de Pago */}
              <VStack flex={1} gap="1">
                <Text
                  size="sm"
                  weight="semibold"
                  color="primary"
                  pl="1"
                  style={styles.inputLabel}
                >
                  Frecuencia (Días)
                </Text>
                <HStack
                  align="center"
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
                  <Text size="sm" color="textMuted" ml="2">
                    días
                  </Text>
                </HStack>
              </VStack>

              {/* Fecha de Inicio */}
              <VStack flex={1} gap="1">
                <Text
                  size="sm"
                  weight="semibold"
                  color="primary"
                  pl="1"
                  style={styles.inputLabel}
                >
                  Fecha de Inicio
                </Text>
                <HStack
                  align="center"
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
                </HStack>
              </VStack>
            </HStack>

            <Text
              size="xs"
              color="textMuted"
              pl="1"
              style={styles.frequencyDesc}
            >
              {getFreqDescription(parseInt(payFrequency, 10) || 0)}
            </Text>

            {errorMsg && (
              <Text size="sm" weight="semibold" color="error" px="1">
                {errorMsg}
              </Text>
            )}
          </VStack>

          {/* Real-time Visualization Component */}
          <VStack gap="2" style={styles.visualCard}>
            <HStack align="flex-end" justify="space-between">
              <Text size="sm" color="textMuted">
                Progreso Estimado
              </Text>
              <Text size="base" weight="bold" color="primary">
                {displayPct}%
              </Text>
            </HStack>
            <View style={styles.visualTrack}>
              <View style={[styles.visualFill, { width: `${displayPct}%` }]} />
            </View>
            <HStack justify="space-between">
              <Text
                size="xs"
                weight="medium"
                color="textMuted"
                style={styles.visualFooterText}
              >
                Inicio del Ciclo
              </Text>
              <Text
                size="xs"
                weight="medium"
                color="textMuted"
                style={styles.visualFooterText}
              >
                Meta de Liquidación
              </Text>
            </HStack>
          </VStack>
        </ScrollView>

        {/* Footer sticky */}
        <View style={styles.footer}>
          <Pressable onPress={handleSave} disabled={isSubmitting}>
            <HStack
              align="center"
              justify="center"
              gap="2"
              style={[
                styles.submitButton,
                isSubmitting && styles.submitButtonDisabled,
              ]}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <>
                  <MaterialIcons name="save" size={20} color="#ffffff" />
                  <Text size="md" weight="bold" style={styles.submitButtonText}>
                    Registrar Deuda
                  </Text>
                </>
              )}
            </HStack>
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
    introSubtitle: {
      lineHeight: 18,
    },
    formCard: {
      backgroundColor: t.bgElevated,
      borderRadius: r.lg,
      padding: sp[4],
      borderWidth: 1,
      borderColor: t.border,
      zIndex: 10,
    },
    inputLabel: {
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    dropdownButton: {
      backgroundColor: t.bg,
      borderWidth: 1,
      borderColor: t.borderStrong,
      borderRadius: r.md,
      paddingHorizontal: sp[3],
      height: 48,
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
    inputWrapper: {
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
      fontFamily: "Inter", // Using custom tabular fonts
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
      width: "100%",
      paddingVertical: sp[2],
      borderRadius: r.md,
      backgroundColor: t.bgElevated,
      borderWidth: 1,
      borderColor: t.border,
    },
    typeButtonActive: {
      backgroundColor: "#064e3b", // solid primary container color from stitch
      borderColor: "#064e3b",
    },
    typeButtonText: {
      color: t.textMuted,
    },
    typeButtonTextActive: {
      color: "#ffffff",
    },
    frequencyDesc: {
      fontStyle: "italic",
      marginTop: -sp[2],
    },
    visualCard: {
      backgroundColor: t.bgElevated,
      borderRadius: r.lg,
      padding: sp[4],
      borderWidth: 1,
      borderColor: t.border,
      marginTop: sp[4],
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
    visualFooterText: {
      textTransform: "uppercase",
    },
    footer: {
      backgroundColor: t.bgElevated,
      borderTopWidth: 1,
      borderTopColor: t.border,
      padding: sp[4],
    },
    submitButton: {
      backgroundColor: t.primary,
      height: 52,
      borderRadius: r.lg,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    submitButtonDisabled: {
      opacity: 0.6,
    },
    submitButtonText: {
      color: "#ffffff",
    },
  }),
);

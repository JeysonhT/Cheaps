import { useRouter } from "expo-router";
import {
  ArrowLeft,
  Car,
  ChevronDown,
  CircleHelp,
  CreditCard,
  Home,
  type LucideIcon,
  MoreHorizontal,
  Save,
  User,
  Zap,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import Button from "@/components/Button";
import Main from "@/components/StyledView";
import { useCreditors } from "@/features/seller/hooks/useCreditors";
import type { DebtType } from "@/types";
import useCheckCreditors from "./hooks/useCheckCreditors";
import { useDebts } from "./hooks/useDebts";

export default function AddDebtScreen() {
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
    if (!amount.trim() || Number.isNaN(originalVal) || originalVal <= 0) {
      setErrorMsg("El monto original debe ser un número mayor a 0");
      return;
    }
    if (!currentAmount.trim() || Number.isNaN(currentVal) || currentVal < 0) {
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
    if (Number.isNaN(freq) || freq <= 0) {
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

      Toast.show({
        type: "success",
        text1: "¡Éxito!",
        text2: "La deuda se registró correctamente",
      });

      router.back();
    } catch (error: any) {
      setErrorMsg(error.message || "Ocurrió un error al registrar la deuda");
      setIsSubmitting(false);
    }
  };

  const typesList: { type: DebtType; label: string; icon: LucideIcon }[] = [
    { type: "personal", label: "Personal", icon: User },
    { type: "tarjeta", label: "Tarjeta", icon: CreditCard },
    { type: "hipoteca", label: "Hipoteca", icon: Home },
    { type: "auto", label: "Auto", icon: Car },
    { type: "servicio", label: "Servicio", icon: Zap },
    { type: "otro", label: "Otro", icon: MoreHorizontal },
  ];

  const selectedCreditorName = selectedCreditorId
    ? creditors.find((c) => c.id.toString() === selectedCreditorId)?.name
    : "Selecciona un acreedor";

  if (isLoading) {
    return (
      <Main className="flex-1 justify-center items-center bg-slate-50">
        <View className="items-center justify-center p-2 gap-2">
          <ActivityIndicator
            color="#064E3B"
            size="large"
          />
          <Text className="text-base font-bold text-slate-900 text-center">
            Cargando datos de Acreedores
          </Text>
        </View>
      </Main>
    );
  }

  if (response?.totalCreditors === 0) {
    return (
      <Main className="flex-1 justify-center items-center bg-slate-50">
        <View className="items-center justify-center p-6 gap-2">
          <Text className="text-xl font-bold text-slate-900 text-center">
            Para crear una deuda ingresa primero un acreedor
          </Text>
        </View>
      </Main>
    );
  }

  return (
    <Main className="flex-1 bg-slate-50">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        {/* Custom Header */}
        <View className="h-14 px-3 bg-white border-b border-slate-200 flex-row items-center justify-between">
          <Pressable
            onPress={() => router.back()}
            className="p-2 rounded-full active:bg-slate-100"
          >
            <ArrowLeft
              size={24}
              color="#0f172a"
            />
          </Pressable>
          <Text className="text-lg font-bold text-primary">
            Registrar Deuda
          </Text>
          <View className="p-2">
            <CircleHelp
              size={24}
              color="#94a3b8"
            />
          </View>
        </View>

        <ScrollView
          className="flex-1"
          contentContainerClassName="p-4 pb-8"
          keyboardShouldPersistTaps="handled"
        >
          {/* Welcome Info Card */}
          <View className="bg-white border border-slate-200 rounded-xl p-4 mb-4 flex-row items-start gap-3 shadow-sm">
            <View className="bg-emerald-100 w-11 h-11 rounded-lg items-center justify-center">
              <CreditCard
                size={24}
                color="#064e3b"
              />
            </View>
            <View className="flex-1">
              <Text className="text-base font-bold text-slate-900 mb-1">
                Detalles de la Deuda
              </Text>
              <Text className="text-sm text-slate-500 leading-5">
                Ingresa la información detallada de tu deuda para hacer un
                seguimiento eficiente
              </Text>
            </View>
          </View>

          {/* Form container */}
          <View className="bg-white rounded-xl p-4 border border-slate-200 gap-4 shadow-sm z-10">
            {/* Field: Creditor */}
            <View className="gap-1">
              <Text className="text-xs font-semibold uppercase tracking-wider text-primary pl-1">
                Acreedor
              </Text>
              <Pressable onPress={() => setIsDropdownOpen(!isDropdownOpen)}>
                <View className="flex-row items-center justify-between bg-slate-50 border border-slate-300 rounded-lg px-3 h-12">
                  <Text
                    className={`text-base ${
                      selectedCreditorId ? "text-slate-900" : "text-slate-400"
                    }`}
                  >
                    {selectedCreditorName}
                  </Text>
                  <ChevronDown
                    size={24}
                    color="#94a3b8"
                  />
                </View>
              </Pressable>

              {isDropdownOpen && (
                <View className="bg-white border border-slate-300 rounded-lg mt-1 max-h-48 overflow-hidden shadow-md">
                  {creditors.map((c) => (
                    <Pressable
                      key={c.id}
                      className="p-3 border-b border-slate-100 active:bg-slate-50"
                      onPress={() => {
                        setSelectedCreditorId(c.id.toString());
                        setIsDropdownOpen(false);
                      }}
                    >
                      <Text className="text-base text-slate-900">{c.name}</Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </View>

            {/* Field: Name */}
            <View className="gap-1">
              <Text className="text-xs font-semibold uppercase tracking-wider text-primary pl-1">
                Nombre de la Deuda
              </Text>
              <View
                className={`flex-row items-center bg-slate-50 rounded-lg px-3 h-12 border ${
                  isNameFocused
                    ? "border-2 border-primary bg-white"
                    : "border-slate-300"
                }`}
              >
                <TextInput
                  value={name}
                  onChangeText={(val) => {
                    setName(val);
                    if (errorMsg) setErrorMsg(null);
                  }}
                  placeholder="Ej. Préstamo Personal"
                  placeholderTextColor="#94a3b8"
                  className="flex-1 text-base text-slate-900 h-full"
                  onFocus={() => setIsNameFocused(true)}
                  onBlur={() => setIsNameFocused(false)}
                />
              </View>
            </View>

            {/* Field: Debt Type */}
            <View className="gap-1">
              <Text className="text-xs font-semibold uppercase tracking-wider text-primary pl-1">
                Tipo de Deuda
              </Text>
              <View className="flex-row flex-wrap gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
                {typesList.map((item) => {
                  const isActive = debtType === item.type;
                  const TypeIcon = item.icon;
                  return (
                    <Pressable
                      key={item.type}
                      onPress={() => setDebtType(item.type)}
                      style={{ width: "30.5%" }}
                    >
                      <View
                        className={`w-full py-2 rounded-lg items-center justify-center gap-1 border ${
                          isActive
                            ? "bg-primary border-primary"
                            : "bg-white border-slate-200"
                        }`}
                      >
                        <TypeIcon
                          size={20}
                          color={isActive ? "#ffffff" : "#94a3b8"}
                        />
                        <Text
                          className={`text-xs ${
                            isActive
                              ? "font-semibold text-white"
                              : "font-medium text-slate-500"
                          }`}
                        >
                          {item.label}
                        </Text>
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* Financials Row */}
            <View className="flex-row gap-3">
              {/* Monto Original */}
              <View className="flex-1 gap-1">
                <Text className="text-xs font-semibold uppercase tracking-wider text-primary pl-1">
                  Monto Original
                </Text>
                <View
                  className={`flex-row items-center bg-slate-50 rounded-lg px-3 h-12 border ${
                    isAmountFocused
                      ? "border-2 border-primary bg-white"
                      : "border-slate-300"
                  }`}
                >
                  <Text className="font-semibold text-slate-400 mr-2">C$</Text>
                  <TextInput
                    value={amount}
                    onChangeText={setAmount}
                    placeholder="0.00"
                    placeholderTextColor="#94a3b8"
                    keyboardType="numeric"
                    className="flex-1 text-base text-slate-900 h-full"
                    onFocus={() => setIsAmountFocused(true)}
                    onBlur={() => setIsAmountFocused(false)}
                  />
                </View>
              </View>

              {/* Saldo Pendiente */}
              <View className="flex-1 gap-1">
                <Text className="text-xs font-semibold uppercase tracking-wider text-primary pl-1">
                  Saldo Pendiente
                </Text>
                <View
                  className={`flex-row items-center bg-slate-50 rounded-lg px-3 h-12 border ${
                    isCurrentAmountFocused
                      ? "border-2 border-primary bg-white"
                      : "border-slate-300"
                  }`}
                >
                  <Text className="font-semibold text-slate-400 mr-2">C$</Text>
                  <TextInput
                    value={currentAmount}
                    onChangeText={setCurrentAmount}
                    placeholder="0.00"
                    placeholderTextColor="#94a3b8"
                    keyboardType="numeric"
                    className="flex-1 text-base text-slate-900 h-full"
                    onFocus={() => setIsCurrentAmountFocused(true)}
                    onBlur={() => setIsCurrentAmountFocused(false)}
                  />
                </View>
              </View>
            </View>

            {/* Timing row */}
            <View className="flex-row gap-3">
              {/* Frecuencia de Pago */}
              <View className="flex-1 gap-1">
                <Text className="text-xs font-semibold uppercase tracking-wider text-primary pl-1">
                  Frecuencia (Días)
                </Text>
                <View
                  className={`flex-row items-center bg-slate-50 rounded-lg px-3 h-12 border ${
                    isFrequencyFocused
                      ? "border-2 border-primary bg-white"
                      : "border-slate-300"
                  }`}
                >
                  <TextInput
                    value={payFrequency}
                    onChangeText={setPayFrequency}
                    placeholder="30"
                    placeholderTextColor="#94a3b8"
                    keyboardType="numeric"
                    className="flex-1 text-base text-slate-900 h-full"
                    onFocus={() => setIsFrequencyFocused(true)}
                    onBlur={() => setIsFrequencyFocused(false)}
                  />
                  <Text className="text-sm text-slate-400 ml-2">días</Text>
                </View>
              </View>

              {/* Fecha de Inicio */}
              <View className="flex-1 gap-1">
                <Text className="text-xs font-semibold uppercase tracking-wider text-primary pl-1">
                  Fecha de Inicio
                </Text>
                <View
                  className={`flex-row items-center bg-slate-50 rounded-lg px-3 h-12 border ${
                    isDateFocused
                      ? "border-2 border-primary bg-white"
                      : "border-slate-300"
                  }`}
                >
                  <TextInput
                    value={startDate}
                    onChangeText={setStartDate}
                    placeholder="AAAA-MM-DD"
                    placeholderTextColor="#94a3b8"
                    className="flex-1 text-base text-slate-900 h-full"
                    onFocus={() => setIsDateFocused(true)}
                    onBlur={() => setIsDateFocused(false)}
                  />
                </View>
              </View>
            </View>

            <Text className="text-xs text-slate-400 italic pl-1 -mt-2">
              {getFreqDescription(parseInt(payFrequency, 10) || 0)}
            </Text>

            {errorMsg && (
              <Text className="text-sm font-semibold text-red-500 px-1">
                {errorMsg}
              </Text>
            )}
          </View>

          {/* Real-time Visualization Component */}
          <View className="bg-white rounded-xl p-4 border border-slate-200 mt-4 gap-2 shadow-sm">
            <View className="flex-row items-end justify-between">
              <Text className="text-sm text-slate-500">Progreso Estimado</Text>
              <Text className="text-base font-bold text-primary">
                {displayPct}%
              </Text>
            </View>
            <View className="h-3 bg-slate-100 rounded-full overflow-hidden my-1">
              <View
                className="h-full bg-primary rounded-full"
                style={{ width: `${displayPct}%` }}
              />
            </View>
            <View className="flex-row justify-between">
              <Text className="text-xs font-medium uppercase tracking-wider text-slate-400">
                Inicio del Ciclo
              </Text>
              <Text className="text-xs font-medium uppercase tracking-wider text-slate-400">
                Meta de Liquidación
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Footer sticky */}
        <View className="bg-white border-t border-slate-200 p-4">
          <Button
            onPress={handleSave}
            loading={isSubmitting}
            label="Registrar Deuda"
            icon={Save}
          />
        </View>
      </KeyboardAvoidingView>
    </Main>
  );
}

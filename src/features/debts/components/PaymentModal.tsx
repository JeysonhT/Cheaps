import { Save, X } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { useDebts } from "../hooks/useDebts";

interface PaymentModalProps {
  visible: boolean;
  onClose: () => void;
  debtId: number;
  currentAmount: number;
  suggestedAmount: number;
}

export default function PaymentModal({
  visible,
  onClose,
  debtId,
  currentAmount,
  suggestedAmount,
}: PaymentModalProps) {
  const { addPayment } = useDebts();

  const [payAmount, setPayAmount] = useState("");
  const [payReference, setPayReference] = useState("");
  const [payDate, setPayDate] = useState("");
  const [isSubmittingPay, setIsSubmittingPay] = useState(false);

  useEffect(() => {
    if (visible) {
      setPayAmount(
        suggestedAmount > 0
          ? suggestedAmount.toFixed(2)
          : currentAmount.toFixed(2),
      );
      setPayReference("");
      setPayDate(new Date().toISOString().split("T")[0]);
    }
  }, [visible, suggestedAmount, currentAmount]);

  const handleRegisterPayment = async () => {
    const amountVal = parseFloat(payAmount);
    if (Number.isNaN(amountVal) || amountVal <= 0) {
      Alert.alert("Error", "Por favor ingresa un monto válido mayor a 0");
      return;
    }
    if (amountVal > currentAmount) {
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
        idDebt: debtId,
        amount: amountVal,
        reference: payReference.trim() || null,
        payDate: payDate,
      });
      onClose();
      Alert.alert("Éxito", "Pago registrado exitosamente");
    } catch (_e) {
      Alert.alert("Error", "No se pudo registrar el pago");
    } finally {
      setIsSubmittingPay(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1 bg-black/50 justify-center items-center p-4"
      >
        <View className="bg-white rounded-2xl w-full max-w-[360px] max-h-[85%] shadow-xl android:elevation-md overflow-hidden">
          <View className="p-4 border-b border-slate-200 flex-row justify-between items-center">
            <Text className="text-lg font-bold text-slate-900">
              Registrar Pago
            </Text>
            <Pressable
              onPress={onClose}
              className="p-1 rounded-full active:bg-slate-100"
            >
              <X
                size={24}
                color="#0f172a"
              />
            </Pressable>
          </View>

          <ScrollView
            className="shrink"
            contentContainerClassName="p-4"
            keyboardShouldPersistTaps="handled"
          >
            <Text className="text-sm text-slate-500 mb-3">
              Registra un abono para reducir el saldo pendiente de tu deuda.
            </Text>

            {/* Field: Amount */}
            <View className="gap-1">
              <Text className="text-xs font-bold uppercase tracking-wider text-primary">
                Monto del Pago
              </Text>
              <View className="flex-row items-center bg-slate-50 border border-slate-300 rounded-lg px-3 h-12">
                <Text className="font-bold text-slate-400 mr-2">C$</Text>
                <TextInput
                  value={payAmount}
                  onChangeText={setPayAmount}
                  placeholder="0.00"
                  placeholderTextColor="#94a3b8"
                  keyboardType="numeric"
                  className="flex-1 text-base text-slate-900 h-full"
                />
              </View>
            </View>

            {/* Field: Reference */}
            <View className="gap-1 mt-4">
              <Text className="text-xs font-bold uppercase tracking-wider text-primary">
                Referencia / Nota
              </Text>
              <View className="flex-row items-center bg-slate-50 border border-slate-300 rounded-lg px-3 h-12">
                <TextInput
                  value={payReference}
                  onChangeText={setPayReference}
                  placeholder="Ej. Transferencia Bancaria, Pago en Sucursal"
                  placeholderTextColor="#94a3b8"
                  numberOfLines={2}
                  className="flex-1 text-base text-slate-900 h-full"
                />
              </View>
            </View>

            {/* Field: Date */}
            <View className="gap-1 mt-4">
              <Text className="text-xs font-bold uppercase tracking-wider text-primary">
                Fecha del Pago
              </Text>
              <View className="flex-row items-center bg-slate-50 border border-slate-300 rounded-lg px-3 h-12">
                <TextInput
                  value={payDate}
                  onChangeText={setPayDate}
                  placeholder="AAAA-MM-DD"
                  placeholderTextColor="#94a3b8"
                  className="flex-1 text-base text-slate-900 h-full"
                />
              </View>
            </View>

            <Pressable
              className="bg-primary h-12 items-center justify-center rounded-lg mt-5 flex-row gap-2 active:opacity-90 disabled:opacity-60"
              onPress={handleRegisterPayment}
              disabled={isSubmittingPay}
            >
              {isSubmittingPay ? (
                <ActivityIndicator
                  size="small"
                  color="#ffffff"
                />
              ) : (
                <>
                  <Save
                    size={20}
                    color="#ffffff"
                  />
                  <Text className="text-base font-bold text-white">
                    Guardar Pago
                  </Text>
                </>
              )}
            </Pressable>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

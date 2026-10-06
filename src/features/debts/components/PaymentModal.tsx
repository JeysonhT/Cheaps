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
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { HStack, Text, VStack } from "@/components/layout";
import { makeStyles } from "@/hooks/useTheme";
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
  const styles = useStyles();
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
        style={styles.modalOverlay}
      >
        <View style={styles.modalContent}>
          <HStack
            justify="space-between"
            align="center"
            style={styles.modalHeader}
          >
            <Text size="lg" weight="bold" color="text">
              Registrar Pago
            </Text>
            <Pressable onPress={onClose}>
              <X
                size={24}
                color={styles.iconColor.color}
              />
            </Pressable>
          </HStack>

          <ScrollView
            style={styles.modalScrollView}
            contentContainerStyle={styles.modalBody}
          >
            <Text size="sm" color="textMuted" mb="2">
              Registra un abono para reducir el saldo pendiente de tu deuda.
            </Text>

            {/* Field: Amount */}
            <VStack gap="1">
              <Text
                size="xs"
                weight="bold"
                color="primary"
                style={styles.modalInputLabel}
              >
                Monto del Pago
              </Text>
              <HStack align="center" style={styles.modalInputWrapper}>
                <Text weight="bold" color="textMuted" mr="2">
                  C$
                </Text>
                <TextInput
                  value={payAmount}
                  onChangeText={setPayAmount}
                  placeholder="0.00"
                  placeholderTextColor={styles.placeholderColor.color}
                  keyboardType="numeric"
                  style={styles.modalTextInput}
                />
              </HStack>
            </VStack>

            {/* Field: Reference */}
            <VStack gap="1" style={styles.modalInputSpacing}>
              <Text
                size="xs"
                weight="bold"
                color="primary"
                style={styles.modalInputLabel}
              >
                Referencia / Nota
              </Text>
              <HStack align="center" style={styles.modalInputWrapper}>
                <TextInput
                  value={payReference}
                  onChangeText={setPayReference}
                  placeholder="Ej. Transferencia Bancaria, Pago en Sucursal"
                  placeholderTextColor={styles.placeholderColor.color}
                  numberOfLines={2}
                  style={styles.modalTextInput}
                />
              </HStack>
            </VStack>

            {/* Field: Date */}
            <VStack gap="1" style={styles.modalInputSpacing}>
              <Text
                size="xs"
                weight="bold"
                color="primary"
                style={styles.modalInputLabel}
              >
                Fecha del Pago
              </Text>
              <HStack align="center" style={styles.modalInputWrapper}>
                <TextInput
                  value={payDate}
                  onChangeText={setPayDate}
                  placeholder="AAAA-MM-DD"
                  placeholderTextColor={styles.placeholderColor.color}
                  style={styles.modalTextInput}
                />
              </HStack>
            </VStack>

            <Pressable
              style={({ pressed }) => [
                styles.modalSubmitBtn,
                pressed && styles.modalSubmitBtnPressed,
                isSubmittingPay && styles.modalSubmitBtnDisabled,
              ]}
              onPress={handleRegisterPayment}
              disabled={isSubmittingPay}
            >
              <HStack align="center" justify="center" gap="2">
                {isSubmittingPay ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <>
                    <Save size={20} color="#ffffff" />
                    <Text
                      size="base"
                      weight="bold"
                      style={styles.modalSubmitBtnText}
                    >
                      Guardar Pago
                    </Text>
                  </>
                )}
              </HStack>
            </Pressable>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const useStyles = makeStyles((t, sp, fs, _fw, r) =>
  StyleSheet.create({
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
      padding: sp[4],
      borderBottomWidth: 1,
      borderBottomColor: t.border,
    },
    modalScrollView: {
      flexShrink: 1,
    },
    modalBody: {
      padding: sp[4],
    },
    modalInputLabel: {
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    modalInputWrapper: {
      backgroundColor: t.bg,
      borderWidth: 1,
      borderColor: t.borderStrong,
      borderRadius: r.md,
      paddingHorizontal: sp[3],
      height: 48,
    },
    modalTextInput: {
      flex: 1,
      fontSize: fs.base,
      color: t.text,
      height: "100%",
    },
    modalSubmitBtn: {
      backgroundColor: t.primary,
      height: 50,
      alignItems: "center",
      padding: 12,
      borderRadius: r.md,
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
    },
    iconColor: {
      color: t.text,
    },
    placeholderColor: {
      color: t.textMuted,
    },
    modalInputSpacing: {
      marginTop: sp[4],
    },
  }),
);

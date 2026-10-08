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
  Text,
  View,
} from "react-native";
import Card from "@/components/Card";
import Main from "@/components/StyledView";
import { formatDate } from "@/utils";
import DebtDetailsCard from "./components/DebtDetailsCard";
import NextPaymentCard from "./components/NextPaymentCard";
import PaymentModal from "./components/PaymentModal";
import { useDebts } from "./hooks/useDebts";

interface DebtDetailsProps {
  id: number;
}

export default function DebtDetailsScreen({ id }: DebtDetailsProps) {
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
      <Main className="flex-1 justify-center items-center bg-slate-50">
        <ActivityIndicator
          size="large"
          color="#064E3B"
        />
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
    return `C$ ${val.toLocaleString("es-NI", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
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
    <Main className="flex-1 bg-slate-50">
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
          Detalles de la Deuda
        </Text>
        <View className="p-2 opacity-80">
          <Settings
            size={24}
            color="#94a3b8"
          />
        </View>
      </View>

      <ScrollView contentContainerClassName="p-4 pb-8">
        {/* Debt Name Section */}
        <View className="mb-4">
          <Text className="text-xs font-semibold uppercase tracking-wider text-blue-600">
            {`Detalles de ${debt.type}`}
          </Text>
          <Text className="text-2xl font-bold text-slate-900 mt-1">
            {debt.name}
          </Text>
          <View className="flex-row items-center gap-2 mt-2">
            <View className="w-6 h-6 rounded-full bg-slate-200 items-center justify-center">
              <Building2
                size={14}
                color="#0f172a"
              />
            </View>
            <Text className="text-base font-medium text-slate-500">
              {debt.creditor ? debt.creditor.name : "Sin acreedor asignado"}
            </Text>
          </View>
        </View>

        {/* Financial Summary Bento Card */}
        <DebtDetailsCard
          original={original}
          current={current}
        />

        {/* Next Payment Card */}
        <NextPaymentCard
          currentAmount={current}
          nextPayDate={getNextPayDate()}
          estimatedInstallment={estimatedInstallment}
          onRegisterPayment={() => setIsPayModalOpen(true)}
        />

        {/* Technical Details Card */}
        <Card className="bg-white rounded-xl p-4 border border-slate-200 mb-4 shadow-sm">
          <View className="flex-row items-center gap-2 mb-3">
            <Info
              size={20}
              color="#0f172a"
            />
            <Text className="text-base font-bold text-slate-900">
              Detalles Técnicos
            </Text>
          </View>
          <View>
            <View className="flex-row justify-between items-center py-2 border-b border-slate-100">
              <Text className="text-sm text-slate-400">Frecuencia</Text>
              <Text className="text-sm font-semibold text-slate-900">
                {getFrequencyText(debt.payFrecuency)}
              </Text>
            </View>
            <View className="flex-row justify-between items-center py-2 border-b border-slate-100">
              <Text className="text-sm text-slate-400">Fecha Inicio</Text>
              <Text className="text-sm font-semibold text-slate-900">
                {formatDate(debt.debtDate)}
              </Text>
            </View>
            <View className="flex-row justify-between items-center py-2">
              <Text className="text-sm text-slate-400">Tipo</Text>
              <Text className="text-sm font-semibold text-slate-900 capitalize">
                {debt.type}
              </Text>
            </View>
          </View>
        </Card>

        {/* Recent Payment History Card */}
        <Card className="bg-white rounded-xl p-4 border border-slate-200 mb-4 shadow-sm">
          <View className="flex-row items-center gap-2 mb-3">
            <History
              size={20}
              color="#0f172a"
            />
            <Text className="text-base font-bold text-slate-900">
              Historial Reciente
            </Text>
          </View>

          {debtPayments.length === 0 ? (
            <View className="py-4 items-center">
              <Text className="text-sm text-slate-400 italic">
                No se han registrado pagos aún.
              </Text>
            </View>
          ) : (
            <View className="mt-1">
              <View className="flex-row border-b border-slate-200 pb-2 mb-2">
                <Text className="text-xs font-bold text-slate-400 flex-1">
                  FECHA
                </Text>
                <Text className="text-xs font-bold text-slate-400 flex-1">
                  MONTO
                </Text>
                <Text className="text-xs font-bold text-slate-400 flex-1 text-right">
                  ESTADO
                </Text>
              </View>
              {debtPayments.slice(0, 5).map((pay) => (
                <View
                  key={pay.id}
                  className="flex-row items-center py-3 border-b border-slate-100"
                >
                  <Text className="text-xs text-slate-900 flex-1">
                    {formatDate(pay.payDate)}
                  </Text>
                  <Text className="text-sm font-bold text-slate-900 flex-1">
                    {formatCurrency(pay.amount)}
                  </Text>
                  <View className="flex-1 items-end">
                    <View className="bg-emerald-100 px-2 py-0.5 rounded-full flex-row items-center gap-1">
                      <CheckCircle2
                        size={12}
                        color="#047857"
                      />
                      <Text className="text-[10px] font-bold text-emerald-700">
                        Completado
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
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

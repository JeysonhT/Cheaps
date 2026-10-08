import { ReceiptText } from "lucide-react-native";
import { useEffect } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import HistoryElement from "./components/HistoryElement";
import { useHistory } from "./hooks/useHistory";

export default function HistoryDashboard() {
  const { payments, isLoading, fetchHistory } = useHistory();

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const totalPayments = payments.reduce((sum, p) => sum + p.amount, 0);

  const formatCurrency = (val: number) => {
    return `C$ ${val.toLocaleString("es-NI", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const renderHeader = () => (
    <View className="pt-4 pb-2">
      {/* Resumen Card */}
      <View className="bg-primary rounded-2xl p-4 mx-4 mb-4 shadow-sm">
        <Text className="text-xs font-semibold text-[#85f8c4] uppercase tracking-wider">
          Total Abonado al Historial
        </Text>
        <Text className="text-2xl font-bold text-white mt-1">
          {formatCurrency(totalPayments)}
        </Text>
        <Text className="text-xs text-white/80 italic mt-2">
          {`Has registrado un total de ${payments.length} abonos.`}
        </Text>
      </View>
      <Text className="text-lg font-bold text-slate-900 mx-4 mt-2">
        Historial de Transacciones
      </Text>
    </View>
  );

  const renderEmpty = () => (
    <View className="items-center justify-center px-8 mt-20">
      <View className="w-20 h-20 rounded-full bg-white items-center justify-center mb-4 border border-slate-200">
        <ReceiptText
          size={36}
          color="#94a3b8"
        />
      </View>
      <Text className="text-lg font-bold text-slate-900 text-center mb-2">
        No hay transacciones registradas
      </Text>
      <Text className="text-base text-slate-400 text-center leading-6">
        Tus abonos registrados a deudas aparecerán listados aquí para llevar un
        control estricto.
      </Text>
    </View>
  );

  return (
    <View className="flex-1 bg-slate-50">
      {isLoading && payments.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator
            size="large"
            color="#064E3B"
          />
        </View>
      ) : (
        <FlatList
          data={payments}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View className="bg-white mx-4 my-1 rounded-xl overflow-hidden border border-slate-200 shadow-sm">
              <HistoryElement payment={item} />
            </View>
          )}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={renderEmpty}
          contentContainerClassName="pb-6"
          onRefresh={fetchHistory}
          refreshing={isLoading}
        />
      )}
    </View>
  );
}

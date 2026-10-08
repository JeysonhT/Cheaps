import { useRouter } from "expo-router";
import { CreditCard, Plus, User } from "lucide-react-native";
import { useEffect } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";
import Button from "@/components/Button";
import DebtCard from "./components/DebtCard";
import { useDebts } from "./hooks/useDebts";

export default function DebtsDashboard() {
  const router = useRouter();
  const { debts, isLoading, fetchDebts, deleteDebt } = useDebts();

  useEffect(() => {
    fetchDebts();
  }, [fetchDebts]);

  const handleDelete = (id: number) => {
    Alert.alert(
      "Eliminar Deuda",
      "¿Estás seguro de que deseas eliminar esta deuda? También se eliminarán los pagos asociados.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            await deleteDebt(id);
          },
        },
      ],
    );
  };

  // Calcular métricas
  const totalPending = debts.reduce((sum, d) => sum + d.currentAmount, 0);
  const totalOriginal = debts.reduce((sum, d) => sum + d.amount, 0);
  const totalPaid = Math.max(0, totalOriginal - totalPending);
  const averageProgress =
    totalOriginal > 0 ? (totalPaid / totalOriginal) * 100 : 0;

  const formatCurrency = (val: number) => {
    return `C$ ${val.toLocaleString("es-NI", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const handleClickCreditors = () => {
    router.navigate({ pathname: "/(tabs)/debts/sellers" });
  };

  const renderHeader = () => (
    <View className="pt-4 pb-2">
      {/* Resumen Card */}
      <View className="bg-primary rounded-2xl p-4 mx-4 mb-4 shadow-sm android:elevation-sm">
        <Text className="text-xs font-semibold uppercase tracking-wider text-emerald-200">
          Deuda total pendiente
        </Text>
        <Text className="text-3xl font-bold text-white mt-1">
          {formatCurrency(totalPending)}
        </Text>

        {totalOriginal > 0 && (
          <View className="mt-3 pt-3 border-t border-white/20">
            <View className="flex-row justify-between mb-1">
              <Text className="text-xs font-medium text-white">
                Liquidado: {formatCurrency(totalPaid)} (
                {Math.round(averageProgress)}%)
              </Text>
            </View>
            <View className="h-2 bg-white/20 rounded-full overflow-hidden mt-1">
              <View
                className="h-full bg-emerald-400 rounded-full"
                style={{ width: `${averageProgress}%` }}
              />
            </View>
          </View>
        )}
      </View>

      <View className="flex-row items-center justify-between px-4 mt-2 mb-1">
        <Text className="text-lg font-bold text-slate-900">
          Desglose de Deudas
        </Text>
        <Button
          label="Acreedores"
          icon={User}
          onPress={handleClickCreditors}
        />
      </View>
    </View>
  );

  const renderEmpty = () => (
    <View className="items-center justify-center px-8 mt-20">
      <View className="w-20 h-20 rounded-full bg-white items-center justify-center mb-4 border border-slate-200">
        <CreditCard
          size={40}
          color="#94a3b8"
        />
      </View>
      <Text className="text-lg font-bold text-slate-900 text-center mb-2">
        Sin deudas registradas
      </Text>
      <Text className="text-base text-slate-400 text-center leading-6">
        Añade tus compromisos financieros para realizar un seguimiento óptimo de
        tus finanzas.
      </Text>
    </View>
  );

  return (
    <View className="flex-1 bg-slate-50">
      {isLoading && debts.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator
            size="large"
            color="#064E3B"
          />
        </View>
      ) : (
        <FlatList
          data={debts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <DebtCard
              debt={item}
              onDelete={handleDelete}
            />
          )}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={renderEmpty}
          contentContainerClassName="pb-24"
          onRefresh={fetchDebts}
          refreshing={isLoading}
        />
      )}

      {/* FAB Largo */}
      <Pressable
        className="absolute bottom-6 right-4 bg-primary flex-row items-center px-4 py-3 rounded-full gap-2 shadow-lg android:elevation-md active:opacity-90"
        onPress={() => router.push("/(tabs)/debts/add")}
      >
        <Plus
          size={24}
          color="#ffffff"
        />
        <Text className="text-base font-bold text-white">Agregar Deuda</Text>
      </Pressable>
    </View>
  );
}

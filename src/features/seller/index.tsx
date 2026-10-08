import { useRouter } from "expo-router";
import { Building2, Plus } from "lucide-react-native";
import { useEffect } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { VStack } from "@/components/layout";
import { useCreditors } from "@/features/seller/hooks/useCreditors";
import type { Creditor } from "@/types";
import CreditorCard from "./components/CreditorCard";

export default function SellerDashboard() {
  const router = useRouter();
  const { creditors, isLoading, fetchCreditors, deleteCreditor } =
    useCreditors();

  useEffect(() => {
    fetchCreditors();
  }, [fetchCreditors]);

  const handleDelete = (id: number) => {
    Alert.alert(
      "Eliminar Acreedor",
      "¿Estás seguro de que deseas eliminar este acreedor? Esto no se puede deshacer.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            await deleteCreditor(id);
          },
        },
      ],
    );
  };

  const handleEdit = (creditor: Creditor) => {
    router.push({
      pathname: "/(tabs)/debts/addCreditor",
      params: { id: creditor.id.toString() },
    });
  };

  const renderHeader = () => (
    <VStack className="px-4 py-4 pb-2">
      <Text className="text-2xl font-bold text-primary">Mis Acreedores</Text>
      <Text className="text-base text-slate-400 mt-1">
        Lista y gestiona las entidades a las que les debes
      </Text>
    </VStack>
  );

  const renderEmpty = () => (
    <VStack className="align-center justify-center px-8 mt-20">
      <View className="w-20 h-20 rounded-full bg-slate-50 items-center justify-center mb-4">
        <Building2 size={48} color={Styles.emptyIconColor.color} />
      </View>
      <Text className="text-lg font-bold text-center mb-2">
        No hay acreedores registrados
      </Text>
      <Text className="text-center text-slate-400 leading-6">
        Comienza agregando tu primer acreedor para llevar el control de tus
        deudas.
      </Text>
    </VStack>
  );

  return (
    <VStack className="flex-1 bg-white">
      {isLoading && creditors.length === 0 ? (
        <VStack className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={Styles.loaderColor.color} />
        </VStack>
      ) : (
        <FlatList
          data={creditors}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <CreditorCard
              creditor={item}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={renderEmpty}
          contentContainerClassName="pb-24"
          onRefresh={fetchCreditors}
          refreshing={isLoading}
        />
      )}

      {/* FAB Largo */}
      <Pressable
        className="absolute bottom-6 right-4 bg-primary flex-row items-center px-4 py-3 rounded-full gap-2 android:elevation-md ios:shadow-black ios:shadow-opacity-25 ios:shadow-offset-[0,4] ios:shadow-radius-4"
        onPress={() => router.push("/(tabs)/debts/addCreditor")}
      >
        <Plus size={24} color="#ffffff" />
        <Text className="text-white font-bold">Agregar Acreedor</Text>
      </Pressable>
    </VStack>
  );
}

const Styles = StyleSheet.create({
  loaderColor: {
    color: "#064E3B",
  },
  emptyIconColor: {
    color: "#94a3b8",
  },
});

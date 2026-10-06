import { useRouter } from "expo-router";
import { CreditCard, Plus, User } from "lucide-react-native";
import { useEffect } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import Button from "@/components/Button/Button";
import { HStack, Text, VStack } from "@/components/layout";
import { makeStyles } from "@/hooks/useTheme";
import DebtCard from "./components/DebtCard";
import { useDebts } from "./hooks/useDebts";

export default function DebtsDashboard() {
  const styles = useStyles();
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
    return `C$ ${val.toLocaleString("es-NI", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const handleClickCreditors = () => {
    router.navigate({ pathname: "/(tabs)/debts/sellers" });
  };

  const renderHeader = () => (
    <VStack style={styles.header}>
      {/* Resumen Card */}
      <VStack style={styles.summaryCard}>
        <Text size="xs" weight="semibold" style={styles.summaryLabel}>
          Deuda total pendiente
        </Text>
        <Text size="3xl" weight="bold" mt="1" style={styles.summaryAmount}>
          {formatCurrency(totalPending)}
        </Text>

        {totalOriginal > 0 && (
          <VStack style={styles.progressContainer}>
            <HStack justify="space-between" style={styles.progressTextRow}>
              <Text size="xs" weight="medium" style={styles.progressText}>
                Liquidado: {formatCurrency(totalPaid)} (
                {Math.round(averageProgress)}%)
              </Text>
            </HStack>
            <View style={styles.progressTrack}>
              <View
                style={[styles.progressFill, { width: `${averageProgress}%` }]}
              />
            </View>
          </VStack>
        )}
      </VStack>

      <Text size="lg" weight="bold" color="text" mx="4" mt="2">
        Desglose de Deudas
      </Text>
      {/**
       * Esta sección permite ver a los acreedores
       */}
      <HStack justify="flex-end" p="2">
        <Button
          label="Acreedores"
          icon={User}
          onPress={handleClickCreditors}
        />
      </HStack>
    </VStack>
  );

  const renderEmpty = () => (
    <VStack align="center" justify="center" style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <CreditCard
          size={48}
          color={styles.emptyIconColor.color}
        />
      </View>
      <Text size="lg" weight="bold" color="text" align="center" mb="2">
        Sin deudas registradas
      </Text>
      <Text
        size="base"
        color="textMuted"
        align="center"
        style={styles.emptyText}
      >
        Añade tus compromisos financieros para realizar un seguimiento óptimo de
        tus finanzas.
      </Text>
    </VStack>
  );

  return (
    <View style={styles.container}>
      {isLoading && debts.length === 0 ? (
        <VStack flex={1} justify="center" align="center">
          <ActivityIndicator size="large" color={styles.loaderColor.color} />
        </VStack>
      ) : (
        <FlatList
          data={debts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <DebtCard debt={item} onDelete={handleDelete} />
          )}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={renderEmpty}
          contentContainerStyle={styles.listContent}
          onRefresh={fetchDebts}
          refreshing={isLoading}
        />
      )}

      {/* FAB Largo */}
      <Pressable
        style={styles.fab}
        onPress={() => router.push("/(tabs)/debts/add")}
      >
        <Plus size={24} color="#ffffff" />
        <Text size="base" weight="bold" style={styles.fabText}>
          Agregar Deuda
        </Text>
      </Pressable>
    </View>
  );
}

const useStyles = makeStyles((t, sp, fs, fw, r) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: t.bgSubtle,
    },
    header: {
      paddingTop: sp[4],
      paddingBottom: sp[2],
    },
    summaryCard: {
      backgroundColor: t.primary,
      borderRadius: r.lg,
      padding: sp[4],
      marginHorizontal: sp[4],
      marginBottom: sp[4],
      elevation: 3,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    summaryLabel: {
      color: "#a7f3d0", // Light green tint text
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    summaryAmount: {
      color: "#ffffff",
    },
    progressContainer: {
      marginTop: sp[3],
      borderTopWidth: 1,
      borderTopColor: "rgba(255, 255, 255, 0.15)",
      paddingTop: sp[3],
    },
    progressTextRow: {
      marginBottom: sp[1],
    },
    progressText: {
      color: "#ffffff",
    },
    progressTrack: {
      height: 6,
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      borderRadius: r.full,
      overflow: "hidden",
      marginTop: sp[1],
    },
    progressFill: {
      height: "100%",
      backgroundColor: "#34d399", // Emerald color for progress
      borderRadius: r.full,
    },
    listContent: {
      paddingBottom: 100, // Espacio para el FAB
    },
    loaderColor: {
      color: t.primary,
    },
    emptyContainer: {
      paddingHorizontal: sp[8],
      marginTop: 80,
    },
    emptyIconContainer: {
      width: 80,
      height: 80,
      borderRadius: r.full,
      backgroundColor: t.bgElevated,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: sp[4],
      borderWidth: 1,
      borderColor: t.border,
    },
    emptyIconColor: {
      color: t.textMuted,
    },
    emptyText: {
      lineHeight: 22,
    },
    fab: {
      position: "absolute",
      bottom: sp[6],
      right: sp[4],
      backgroundColor: t.primary,
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: sp[4],
      paddingVertical: sp[3],
      borderRadius: r.full,
      gap: sp[2],
      elevation: 6,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
    },
    fabText: {
      color: "#ffffff",
    },
  }),
);

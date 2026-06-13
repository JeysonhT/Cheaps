import React, { useEffect } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Label, Title, SubTitle } from "@/components/StyledText";
import { makeStyles } from "@/hooks/useTheme";
import MaterialIcons from "@react-native-vector-icons/material-icons";
import { useDebts } from "./hooks/useDebts";
import DebtCard from "./components/DebtCard";

export default function DebtsDashboard() {
  const styles = useStyles();
  const router = useRouter();
  const { debts, isLoading, fetchDebts, deleteDebt } = useDebts();

  useEffect(() => {
    fetchDebts();
  }, []);

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
      ]
    );
  };

  // Calcular métricas
  const totalPending = debts.reduce((sum, d) => sum + d.currentAmount, 0);
  const totalOriginal = debts.reduce((sum, d) => sum + d.amount, 0);
  const totalPaid = Math.max(0, totalOriginal - totalPending);
  const averageProgress = totalOriginal > 0 ? (totalPaid / totalOriginal) * 100 : 0;

  const formatCurrency = (val: number) => {
    return `C$ ${val.toLocaleString("es-NI", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const renderHeader = () => (
    <View style={styles.header}>
      {/* Resumen Card */}
      <View style={styles.summaryCard}>
        <SubTitle style={styles.summaryLabel}>Deuda total pendiente</SubTitle>
        <Title style={styles.summaryAmount}>{formatCurrency(totalPending)}</Title>
        
        {totalOriginal > 0 && (
          <View style={styles.progressContainer}>
            <View style={styles.progressTextRow}>
              <Label style={styles.progressText}>
                Liquidado: {formatCurrency(totalPaid)} ({Math.round(averageProgress)}%)
              </Label>
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${averageProgress}%` }]} />
            </View>
          </View>
        )}
      </View>

      <Title style={styles.sectionTitle}>Desglose de Deudas</Title>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <MaterialIcons name="add-card" size={48} color={styles.emptyIconColor.color} />
      </View>
      <Label style={styles.emptyTitle}>Sin deudas registradas</Label>
      <SubTitle style={styles.emptyText}>
        Añade tus compromisos financieros para realizar un seguimiento óptimo de tus finanzas.
      </SubTitle>
    </View>
  );

  return (
    <View style={styles.container}>
      {isLoading && debts.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={styles.loaderColor.color} />
        </View>
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
        <MaterialIcons name="add" size={24} color="#ffffff" />
        <Label style={styles.fabText}>Agregar Deuda</Label>
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
      fontWeight: fw.semibold,
      fontSize: fs.xs,
      letterSpacing: 0.5,
    },
    summaryAmount: {
      color: "#ffffff",
      fontSize: fs["3xl"],
      fontWeight: fw.bold,
      marginTop: sp[1],
    },
    progressContainer: {
      marginTop: sp[3],
      borderTopWidth: 1,
      borderTopColor: "rgba(255, 255, 255, 0.15)",
      paddingTop: sp[3],
    },
    progressTextRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: sp[1],
    },
    progressText: {
      color: "#ffffff",
      fontSize: fs.xs,
      fontWeight: fw.medium,
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
    sectionTitle: {
      fontSize: fs.lg,
      fontWeight: fw.bold,
      color: t.text,
      marginHorizontal: sp[4],
      marginTop: sp[2],
    },
    listContent: {
      paddingBottom: 100, // Espacio para el FAB
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    loaderColor: {
      color: t.primary,
    },
    emptyContainer: {
      alignItems: "center",
      justifyContent: "center",
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
    emptyTitle: {
      fontSize: fs.lg,
      fontWeight: fw.bold,
      color: t.text,
      textAlign: "center",
      marginBottom: sp[2],
    },
    emptyText: {
      fontSize: fs.base,
      color: t.textMuted,
      textAlign: "center",
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
      fontWeight: fw.bold,
      fontSize: fs.base,
    },
  })
);

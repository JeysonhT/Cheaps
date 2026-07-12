import MaterialIcons from "@react-native-vector-icons/material-icons";
import { useEffect } from "react";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";
import { Text, VStack } from "@/components/layout";
import { makeStyles } from "@/hooks/useTheme";
import HistoryElement from "./components/HistoryElement";
import { useHistory } from "./hooks/useHistory";

export default function HistoryDashboard() {
  const styles = useStyles();
  const { payments, isLoading, fetchHistory } = useHistory();

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const totalPayments = payments.reduce((sum, p) => sum + p.amount, 0);

  const formatCurrency = (val: number) => {
    return `C$ ${val.toLocaleString("es-NI", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const renderHeader = () => (
    <VStack style={styles.header}>
      {/* Resumen Card */}
      <VStack style={styles.summaryCard}>
        <Text size="xs" weight="semibold" style={styles.summaryLabel}>
          Total Abonado al Historial
        </Text>
        <Text size="2xl" weight="bold" mt="1" style={styles.summaryAmount}>
          {formatCurrency(totalPayments)}
        </Text>
        <Text size="xs" mt="2" style={styles.summarySubtext}>
          {`Has registrado un total de ${payments.length} abonos.`}
        </Text>
      </VStack>
      <Text size="lg" weight="bold" color="text" mx="4" mt="2">
        Historial de Transacciones
      </Text>
    </VStack>
  );

  const renderEmpty = () => (
    <VStack align="center" justify="center" style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <MaterialIcons
          name="receipt-long"
          size={24}
          color={styles.emptyIconColor.color}
        />
      </View>
      <Text size="lg" weight="bold" color="text" align="center" mb="2">
        No hay transacciones registradas
      </Text>
      <Text
        size="base"
        color="textMuted"
        align="center"
        style={styles.emptyText}
      >
        Tus abonos registrados a deudas aparecerán listados aquí para llevar un
        control estricto.
      </Text>
    </VStack>
  );

  return (
    <View style={styles.container}>
      {isLoading && payments.length === 0 ? (
        <VStack flex={1} justify="center" align="center">
          <ActivityIndicator size="large" color={styles.loaderColor.color} />
        </VStack>
      ) : (
        <FlatList
          data={payments}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.elementWrapper}>
              <HistoryElement payment={item} />
            </View>
          )}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={renderEmpty}
          contentContainerStyle={styles.listContent}
          onRefresh={fetchHistory}
          refreshing={isLoading}
        />
      )}
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
      elevation: 2,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
    },
    summaryLabel: {
      color: "#85f8c4", // Light green tint
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    summaryAmount: {
      color: "#ffffff",
    },
    summarySubtext: {
      color: "rgba(255, 255, 255, 0.8)",
      fontStyle: "italic",
    },
    listContent: {
      paddingBottom: sp[6],
    },
    elementWrapper: {
      backgroundColor: t.bgElevated,
      marginHorizontal: sp[4],
      borderRadius: r.md,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: t.border,
      marginVertical: sp[1],
    },
    loaderColor: {
      color: t.primary,
    },
    emptyContainer: {
      marginTop: 80,
    },
    emptyIconContainer: {
      width: 80,
      height: 80,
      paddingHorizontal: 6,
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
  }),
);

import { Label, SubTitle, Title } from "@/components/StyledText";
import { makeStyles } from "@/hooks/useTheme";
import MaterialIcons from "@react-native-vector-icons/material-icons";
import { useEffect } from "react";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";
import HistoryElement from "./components/HistoryElement";
import { useHistory } from "./hooks/useHistory";

export default function HistoryDashboard() {
  const styles = useStyles();
  const { payments, isLoading, fetchHistory } = useHistory();

  useEffect(() => {
    fetchHistory();
  }, []);

  const totalPayments = payments.reduce((sum, p) => sum + p.amount, 0);

  const formatCurrency = (val: number) => {
    return `C$ ${val.toLocaleString("es-NI", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const renderHeader = () => (
    <View style={styles.header}>
      {/* Resumen Card */}
      <View style={styles.summaryCard}>
        <SubTitle style={styles.summaryLabel}>
          Total Abonado al Historial
        </SubTitle>
        <Title style={styles.summaryAmount}>
          {formatCurrency(totalPayments)}
        </Title>
        <SubTitle style={styles.summarySubtext}>
          {`Has registrado un total de ${payments.length} abonos.`}
        </SubTitle>
      </View>
      <Title style={styles.sectionTitle}>Historial de Transacciones</Title>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <MaterialIcons
          name="receipt-long"
          size={48}
          color={styles.emptyIconColor.color}
        />
      </View>
      <Label style={styles.emptyTitle}>No hay transacciones registradas</Label>
      <SubTitle style={styles.emptyText}>
        Tus abonos registrados a deudas aparecerán listados aquí para llevar un
        control estricto.
      </SubTitle>
    </View>
  );

  return (
    <View style={styles.container}>
      {isLoading && payments.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={styles.loaderColor.color} />
        </View>
      ) : (
        <FlatList
          data={payments}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.elementWrapper}>
              <HistoryElement payment={item} />
              <View style={styles.separator} />
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
      fontWeight: fw.semibold,
      fontSize: fs.xs,
      letterSpacing: 0.5,
    },
    summaryAmount: {
      color: "#ffffff",
      fontSize: fs["2xl"],
      fontWeight: fw.bold,
      marginTop: sp[1],
    },
    summarySubtext: {
      color: "rgba(255, 255, 255, 0.8)",
      fontSize: fs.xs,
      marginTop: sp[2],
      fontStyle: "italic",
    },
    sectionTitle: {
      fontSize: fs.lg,
      fontWeight: fw.bold,
      color: t.text,
      marginHorizontal: sp[4],
      marginTop: sp[2],
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
    separator: {
      height: 0,
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
  }),
);

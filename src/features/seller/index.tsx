import { Label, SubTitle, Title } from "@/components/StyledText";
import { useCreditors } from "@/features/seller/hooks/useCreditors";
import { makeStyles } from "@/hooks/useTheme";
import MaterialIcons from "@react-native-vector-icons/material-icons";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import CreditorCard from "./components/CreditorCard";

export default function SellerDashboard() {
  const styles = useStyles();
  const router = useRouter();
  const { creditors, isLoading, error, fetchCreditors, deleteCreditor } =
    useCreditors();

  useEffect(() => {
    fetchCreditors();
  }, []);

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

  const renderHeader = () => (
    <View style={styles.header}>
      <Title style={styles.headerTitle}>Mis Acreedores</Title>
      <SubTitle style={styles.headerSubtitle}>
        Lista y gestiona las entidades a las que les debes
      </SubTitle>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <MaterialIcons
          name="account-balance"
          size={48}
          color={styles.emptyIconColor.color}
        />
      </View>
      <Label style={styles.emptyTitle}>No hay acreedores registrados</Label>
      <SubTitle style={styles.emptyText}>
        Comienza agregando tu primer acreedor para llevar el control de tus
        deudas.
      </SubTitle>
    </View>
  );

  return (
    <View style={styles.container}>
      {isLoading && creditors.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={styles.loaderColor.color} />
        </View>
      ) : (
        <FlatList
          data={creditors}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <CreditorCard creditor={item} onDelete={handleDelete} />
          )}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={renderEmpty}
          contentContainerStyle={styles.listContent}
          onRefresh={fetchCreditors}
          refreshing={isLoading}
        />
      )}

      {/* FAB Largo */}
      <Pressable
        style={styles.fab}
        onPress={() => router.push("/(tabs)/dashboard/add")}
      >
        <MaterialIcons name="add" size={24} color="#ffffff" />
        <Label style={styles.fabText}>Agregar Acreedor</Label>
      </Pressable>
    </View>
  );
}

const useStyles = makeStyles((t, sp, fs, fw, r) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: t.bg,
    },
    header: {
      paddingHorizontal: sp[4],
      paddingTop: sp[4],
      paddingBottom: sp[2],
    },
    headerTitle: {
      fontSize: fs["2xl"],
      fontWeight: fw.bold,
      color: t.primary,
    },
    headerSubtitle: {
      fontSize: fs.base,
      color: t.textMuted,
      marginTop: sp[1],
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
      backgroundColor: t.bgSubtle,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: sp[4],
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
  }),
);

import { useRouter } from "expo-router";
import { Building2, Plus } from "lucide-react-native";
import { useEffect } from "react";
import {
	ActivityIndicator,
	Alert,
	FlatList,
	Pressable,
	StyleSheet,
	View,
} from "react-native";
import { Text, VStack } from "@/components/layout";
import { useCreditors } from "@/features/seller/hooks/useCreditors";
import { makeStyles } from "@/hooks/useTheme";
import type { Creditor } from "@/types";
import CreditorCard from "./components/CreditorCard";

export default function SellerDashboard() {
	const styles = useStyles();
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
		<VStack style={styles.header}>
			<Text size="2xl" weight="bold" color="primary">
				Mis Acreedores
			</Text>
			<Text size="base" color="textMuted" mt="1">
				Lista y gestiona las entidades a las que les debes
			</Text>
		</VStack>
	);

	const renderEmpty = () => (
		<VStack align="center" justify="center" style={styles.emptyContainer}>
			<View style={styles.emptyIconContainer}>
				<Building2
					size={48}
					color={styles.emptyIconColor.color}
				/>
			</View>
			<Text size="lg" weight="bold" color="text" align="center" mb="2">
				No hay acreedores registrados
			</Text>
			<Text
				size="base"
				color="textMuted"
				align="center"
				style={styles.emptyText}
			>
				Comienza agregando tu primer acreedor para llevar el control de tus
				deudas.
			</Text>
		</VStack>
	);

	return (
		<View style={styles.container}>
			{isLoading && creditors.length === 0 ? (
				<VStack flex={1} justify="center" align="center">
					<ActivityIndicator size="large" color={styles.loaderColor.color} />
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
					contentContainerStyle={styles.listContent}
					onRefresh={fetchCreditors}
					refreshing={isLoading}
				/>
			)}

			{/* FAB Largo */}
			<Pressable
				style={styles.fab}
				onPress={() => router.push("/(tabs)/debts/addCreditor")}
			>
				<Plus size={24} color="#ffffff" />
				<Text size="base" weight="bold" style={styles.fabText}>
					Agregar Acreedor
				</Text>
			</Pressable>
		</View>
	);
}

const useStyles = makeStyles((t, sp, _fs, _fw, r) =>
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
			backgroundColor: t.bgSubtle,
			alignItems: "center",
			justifyContent: "center",
			marginBottom: sp[4],
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

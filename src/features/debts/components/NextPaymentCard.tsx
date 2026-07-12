import MaterialIcons from "@react-native-vector-icons/material-icons";
import { Pressable, StyleSheet } from "react-native";
import { HStack, Text, VStack } from "@/components/layout";
import { makeStyles } from "@/hooks/useTheme";
import { formatDate } from "@/utils";

interface NextPaymentCardProps {
	currentAmount: number;
	nextPayDate: string;
	estimatedInstallment: number;
	onRegisterPayment: () => void;
}

export default function NextPaymentCard({
	currentAmount,
	nextPayDate,
	estimatedInstallment,
	onRegisterPayment,
}: NextPaymentCardProps) {
	const styles = useStyles();

	const formatCurrency = (val: number) => {
		return `C$ ${val.toLocaleString("es-NI", {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		})}`;
	};

	const amountToPay =
		estimatedInstallment > 0 ? estimatedInstallment : currentAmount;

	return (
		<VStack gap="4" style={styles.nextPayCard}>
			<VStack>
				<HStack align="center" gap="2" style={styles.nextPayHeader}>
					<MaterialIcons
						name="event-repeat"
						size={24}
						color="#ffffff"
						style={styles.nextPayIcon}
					/>
					<Text size="md" weight="bold" style={styles.nextPayTitle}>
						Próximo Pago
					</Text>
				</HStack>
				<HStack justify="space-between" align="center">
					<VStack>
						<Text size="xs" mb="1" style={styles.nextPayLabel}>
							Fecha límite
						</Text>
						<Text size="md" weight="bold" style={styles.nextPayValText}>
							{formatDate(nextPayDate)}
						</Text>
					</VStack>
					<VStack align="flex-end">
						<Text size="xs" mb="1" align="right" style={styles.nextPayLabel}>
							Monto a pagar
						</Text>
						<Text size="md" weight="bold" style={styles.nextPayValText}>
							{formatCurrency(amountToPay)}
						</Text>
					</VStack>
				</HStack>
			</VStack>
			{currentAmount > 0 ? (
				<Pressable
					style={({ pressed }) => [
						styles.registerPayBtn,
						pressed && styles.registerPayBtnPressed,
					]}
					onPress={onRegisterPayment}
				>
					<HStack align="center" justify="center" gap="2" p="2">
						<MaterialIcons name="payments" size={20} color="#064e3b" />
						<Text size="base" weight="bold" style={styles.registerPayBtnText}>
							Registrar Pago
						</Text>
					</HStack>
				</Pressable>
			) : (
				<HStack
					align="center"
					justify="center"
					gap="2"
					style={styles.paidBadge}
				>
					<MaterialIcons name="check-circle" size={20} color="#ffffff" />
					<Text size="base" weight="bold" style={styles.paidBadgeText}>
						Deuda Liquidada
					</Text>
				</HStack>
			)}
		</VStack>
	);
}

const useStyles = makeStyles((_t, sp, _fs, _fw, r) =>
	StyleSheet.create({
		nextPayCard: {
			backgroundColor: "#064e3b", // solid primary green
			borderRadius: r.lg,
			padding: sp[4],
			marginBottom: sp[4],
			shadowColor: "#000",
			shadowOffset: { width: 0, height: 4 },
			shadowOpacity: 0.15,
			shadowRadius: 8,
			elevation: 4,
		},
		nextPayHeader: {
			marginBottom: sp[3],
		},
		nextPayIcon: {
			marginTop: -2,
		},
		nextPayTitle: {
			color: "#ffffff",
		},
		nextPayLabel: {
			color: "rgba(255, 255, 255, 0.7)",
		},
		nextPayValText: {
			color: "#ffffff",
		},
		registerPayBtn: {
			backgroundColor: "#ffffff",
			height: 44,
			borderRadius: r.md,
		},
		registerPayBtnPressed: {
			opacity: 0.9,
			transform: [{ scale: 0.98 }],
		},
		registerPayBtnText: {
			color: "#064e3b",
		},
		paidBadge: {
			backgroundColor: "#10b981", // Success green badge
			height: 44,
			borderRadius: r.md,
		},
		paidBadgeText: {
			color: "#ffffff",
		},
	}),
);

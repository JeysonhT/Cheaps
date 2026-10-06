import { useLocalSearchParams, useRouter } from "expo-router";
import {
	ArrowLeft,
	Banknote,
	Building2,
	CircleHelp,
	Info,
	Phone,
	Save,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import {
	ActivityIndicator,
	KeyboardAvoidingView,
	Platform,
	Pressable,
	ScrollView,
	StyleSheet,
	TextInput,
	View,
} from "react-native";
import { HStack, Text, VStack } from "@/components/layout";
import Main from "@/components/StyledView";
import { useCreditors } from "@/features/seller/hooks/useCreditors";
import { makeStyles } from "@/hooks/useTheme";

export default function AddCreditorScreen() {
	const styles = useStyles();
	const router = useRouter();
	const { id } = useLocalSearchParams<{ id?: string }>();
	const creditorId = id ? parseInt(id, 10) : null;
	const isEditing = creditorId !== null && !Number.isNaN(creditorId);

	const { creditors, fetchCreditors, addCreditor, updateCreditor } =
		useCreditors();
	const creditor = isEditing
		? creditors.find((c) => c.id === creditorId)
		: null;

	const [name, setName] = useState("");
	const [phoneNumber, setPhoneNumber] = useState("");

	const [isNameFocused, setIsNameFocused] = useState(false);
	const [isPhoneFocused, setIsPhoneFocused] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [errorMsg, setErrorMsg] = useState<string | null>(null);

	useEffect(() => {
		if (isEditing && creditors.length === 0) {
			fetchCreditors();
		}
	}, [isEditing, creditors, fetchCreditors]);

	useEffect(() => {
		if (isEditing && creditor) {
			setName(creditor.name);
			setPhoneNumber(creditor.phoneNumber || "");
		}
	}, [isEditing, creditor]);

	const handleSave = async () => {
		if (!name.trim()) {
			setErrorMsg("El nombre del acreedor es requerido");
			return;
		}
		setErrorMsg(null);
		setIsSubmitting(true);
		try {
			if (isEditing && creditorId !== null) {
				await updateCreditor(creditorId, {
					name: name.trim(),
					phoneNumber: phoneNumber.trim() || null,
				});
			} else {
				await addCreditor({
					name: name.trim(),
					phoneNumber: phoneNumber.trim() || null,
				});
			}
			router.back();
		} catch (error: any) {
			setErrorMsg(error.message || "Ocurrió un error al guardar el acreedor");
			setIsSubmitting(false);
		}
	};

	return (
		<Main style={styles.outerContainer}>
			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : undefined}
				style={styles.keyboardContainer}
			>
				{/* Custom Header */}
				<HStack align="center" justify="space-between" style={styles.header}>
					<Pressable onPress={() => router.back()} style={styles.backButton}>
						<ArrowLeft
							size={24}
							color={styles.iconColor.color}
						/>
					</Pressable>
					<Text size="lg" weight="bold" color="primary">
						{isEditing ? "Editar Acreedor" : "Agregar Acreedor"}
					</Text>
					<View style={styles.helpButton}>
						<CircleHelp
							size={24}
							color={styles.iconMutedColor.color}
						/>
					</View>
				</HStack>

				<ScrollView
					style={styles.scrollView}
					contentContainerStyle={styles.scrollContent}
				>
					{/* Title Section */}
					<VStack style={{ marginBottom: 24 }}>
						<Text size="xl" weight="bold" color="primary" mb="1">
							Detalles del Acreedor
						</Text>
						<Text size="base" color="textMuted" style={styles.introSubtitle}>
							{isEditing
								? "Modifique la información del acreedor seleccionado en su sistema de gestión de deudas."
								: "Ingrese la información necesaria para registrar un nuevo acreedor en su sistema de gestión de deuda."}
						</Text>
					</VStack>

					{/* Form Card */}
					<VStack style={styles.formCard}>
						{/* Field: Name */}
						<VStack gap="1">
							<Text
								size="sm"
								weight="semibold"
								color="primary"
								pl="1"
								style={styles.inputLabel}
							>
								Nombre del Acreedor
							</Text>
							<HStack
								align="center"
								style={[
									styles.inputWrapper,
									isNameFocused && styles.inputWrapperFocused,
								]}
							>
								<Building2
									size={20}
									color={
										isNameFocused
											? styles.iconActiveColor.color
											: styles.iconMutedColor.color
									}
									style={styles.inputIcon}
								/>
								<TextInput
									value={name}
									onChangeText={(val) => {
										setName(val);
										if (errorMsg) setErrorMsg(null);
									}}
									placeholder="Ej. Banpro , Financiera Express..."
									placeholderTextColor={styles.placeholderColor.color}
									style={styles.textInput}
									onFocus={() => setIsNameFocused(true)}
									onBlur={() => setIsNameFocused(false)}
								/>
							</HStack>
							<Text size="xs" color="textMuted" pl="1" mt="1">
								Nombre legal o comercial de la entidad.
							</Text>
						</VStack>

						{/* Field: Phone */}
						<VStack gap="1">
							<Text
								size="sm"
								weight="semibold"
								color="primary"
								pl="1"
								style={styles.inputLabel}
							>
								Número de Teléfono
							</Text>
							<HStack
								align="center"
								style={[
									styles.inputWrapper,
									isPhoneFocused && styles.inputWrapperFocused,
								]}
							>
								<Phone
									size={20}
									color={
										isPhoneFocused
											? styles.iconActiveColor.color
											: styles.iconMutedColor.color
									}
									style={styles.inputIcon}
								/>
								<TextInput
									value={phoneNumber}
									onChangeText={setPhoneNumber}
									placeholder="+52 000 000 0000"
									placeholderTextColor={styles.placeholderColor.color}
									keyboardType="phone-pad"
									style={styles.textInput}
									onFocus={() => setIsPhoneFocused(true)}
									onBlur={() => setIsPhoneFocused(false)}
								/>
							</HStack>
							<Text size="xs" color="textMuted" pl="1" mt="1">
								Opcional: Para contacto directo de aclaraciones.
							</Text>
						</VStack>

						{errorMsg && (
							<Text size="sm" weight="semibold" color="error" px="1">
								{errorMsg}
							</Text>
						)}

						{/* Informational Note */}
						<HStack style={styles.infoNote}>
							<Info
								size={20}
								color={styles.infoIconColor.color}
								style={styles.infoIcon}
							/>
							<Text
								flex={1}
								size="sm"
								color="textMuted"
								style={styles.infoText}
							>
								Al guardar este acreedor, podrá comenzar a registrar
								transacciones, pagos programados y estados de cuenta vinculados
								a esta entidad.
							</Text>
						</HStack>
					</VStack>

					{/* Decorative Illustration Banner */}
					<VStack style={{ marginBottom: 24 }}>
						<VStack align="center" justify="center" style={styles.bannerCard}>
							<Banknote
								size={36}
								color={styles.bannerIconColor.color}
								style={styles.bannerIcon}
							/>
							<Text size="md" weight="bold" mb="1" style={styles.bannerTitle}>
								Estabilidad Personal
							</Text>
							<Text size="sm" align="center" style={styles.bannerSubtitle}>
								Mantenga un registro preciso de sus compromisos financieros.
							</Text>
						</VStack>
					</VStack>
				</ScrollView>

				{/* Footer actions */}
				<HStack align="center" justify="space-between" style={styles.footer}>
					<Text flex={1} size="xs" color="textMuted" mr="2">
						Todos los datos se cifran localmente.
					</Text>
					<Pressable
						style={({ pressed }) => [
							styles.submitButton,
							pressed && styles.submitButtonPressed,
							isSubmitting && styles.submitButtonDisabled,
						]}
						onPress={handleSave}
						disabled={isSubmitting}
					>
						{isSubmitting ? (
							<ActivityIndicator size="small" color="#ffffff" />
						) : (
							<>
								<Text size="base" weight="bold" style={styles.submitButtonText}>
									{isEditing ? "Actualizar Acreedor" : "Guardar Acreedor"}
								</Text>
								<Save size={20} color="#ffffff" />
							</>
						)}
					</Pressable>
				</HStack>
			</KeyboardAvoidingView>
		</Main>
	);
}

const useStyles = makeStyles((t, sp, fs, _fw, r) =>
	StyleSheet.create({
		outerContainer: {
			flex: 1,
			backgroundColor: t.bgSubtle,
		},
		keyboardContainer: {
			flex: 1,
		},
		scrollView: {
			flex: 1,
		},
		header: {
			height: 60,
			paddingHorizontal: sp[3],
			backgroundColor: t.bgElevated,
			borderBottomWidth: 1,
			borderBottomColor: t.border,
		},
		backButton: {
			padding: sp[2],
			borderRadius: r.full,
		},
		helpButton: {
			padding: sp[2],
			opacity: 0.8,
		},
		iconColor: {
			color: t.text,
		},
		iconMutedColor: {
			color: t.textMuted,
		},
		iconActiveColor: {
			color: t.primary,
		},
		placeholderColor: {
			color: t.textMuted,
		},
		scrollContent: {
			padding: sp[4],
			paddingBottom: sp[8],
		},
		introSubtitle: {
			lineHeight: 22,
		},
		formCard: {
			backgroundColor: t.bgElevated,
			borderRadius: r.lg,
			padding: sp[4],
			borderWidth: 1,
			borderColor: t.border,
			gap: sp[4],
		},
		inputLabel: {
			textTransform: "uppercase",
			letterSpacing: 0.5,
		},
		inputWrapper: {
			backgroundColor: t.bg,
			borderWidth: 1,
			borderColor: t.borderStrong,
			borderRadius: r.md,
			paddingHorizontal: sp[3],
			height: 48,
		},
		inputWrapperFocused: {
			borderColor: t.primary,
			borderWidth: 2,
		},
		inputIcon: {
			marginRight: sp[2],
		},
		textInput: {
			flex: 1,
			fontSize: fs.base,
			color: t.text,
			height: "100%",
		},
		infoNote: {
			backgroundColor: t.bgSubtle,
			borderRadius: r.md,
			padding: sp[3],
			marginTop: sp[2],
			gap: sp[2],
		},
		infoIcon: {
			marginTop: 2,
		},
		infoIconColor: {
			color: t.secondary,
		},
		infoText: {
			fontStyle: "italic",
			lineHeight: 18,
		},
		bannerCard: {
			backgroundColor: "#064e3b",
			borderRadius: r.lg,
			padding: sp[4],
		},
		bannerIcon: {
			marginBottom: sp[2],
		},
		bannerIconColor: {
			color: "#a7f3d0",
		},
		bannerTitle: {
			color: "#ffffff",
		},
		bannerSubtitle: {
			color: "#cbd5e1",
			lineHeight: 18,
		},
		footer: {
			backgroundColor: t.bgElevated,
			borderTopWidth: 1,
			borderTopColor: t.border,
			padding: sp[4],
		},
		submitButton: {
			backgroundColor: t.primary,
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "center",
			paddingHorizontal: sp[5],
			paddingVertical: sp[3],
			borderRadius: r.full,
			gap: sp[2],
			shadowColor: "#000",
			shadowOffset: { width: 0, height: 2 },
			shadowOpacity: 0.1,
			shadowRadius: 4,
			elevation: 3,
		},
		submitButtonPressed: {
			opacity: 0.9,
			transform: [{ scale: 0.98 }],
		},
		submitButtonDisabled: {
			opacity: 0.6,
		},
		submitButtonText: {
			color: "#ffffff",
		},
	}),
);

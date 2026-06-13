import { Label, SubTitle, Title } from "@/components/StyledText";
import Main from "@/components/StyledView";
import { useCreditors } from "@/features/seller/hooks/useCreditors";
import { makeStyles } from "@/hooks/useTheme";
import MaterialIcons from "@react-native-vector-icons/material-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
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

export default function AddCreditorScreen() {
  const styles = useStyles();
  const router = useRouter();
  const { addCreditor } = useCreditors();

  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [isNameFocused, setIsNameFocused] = useState(false);
  const [isPhoneFocused, setIsPhoneFocused] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSave = async () => {
    if (!name.trim()) {
      setErrorMsg("El nombre del acreedor es requerido");
      return;
    }
    setErrorMsg(null);
    setIsSubmitting(true);
    try {
      await addCreditor({
        name: name.trim(),
        phoneNumber: phoneNumber.trim() || null,
      });
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
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <MaterialIcons
              name="arrow-back"
              size={24}
              color={styles.iconColor.color}
            />
          </Pressable>
          <Title style={styles.headerTitle}>Agregar Acreedor</Title>
          <View style={styles.helpButton}>
            <MaterialIcons
              name="help-outline"
              size={24}
              color={styles.iconMutedColor.color}
            />
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Title Section */}
          <View style={styles.introSection}>
            <Title style={styles.introTitle}>Detalles del Acreedor</Title>
            <SubTitle style={styles.introSubtitle}>
              Ingrese la información necesaria para registrar un nuevo acreedor
              en su sistema de gestión de deuda.
            </SubTitle>
          </View>

          {/* Form Card */}
          <View style={styles.formCard}>
            {/* Field: Name */}
            <View style={styles.inputGroup}>
              <Label style={styles.inputLabel}>Nombre del Acreedor</Label>
              <View
                style={[
                  styles.inputWrapper,
                  isNameFocused && styles.inputWrapperFocused,
                ]}
              >
                <MaterialIcons
                  name="corporate-fare"
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
                  placeholder="Ej. Banco Nacional, Financiera Express..."
                  placeholderTextColor={styles.placeholderColor.color}
                  style={styles.textInput}
                  onFocus={() => setIsNameFocused(true)}
                  onBlur={() => setIsNameFocused(false)}
                />
              </View>
              <SubTitle style={styles.inputHelper}>
                Nombre legal o comercial de la entidad.
              </SubTitle>
            </View>

            {/* Field: Phone */}
            <View style={styles.inputGroup}>
              <Label style={styles.inputLabel}>Número de Teléfono</Label>
              <View
                style={[
                  styles.inputWrapper,
                  isPhoneFocused && styles.inputWrapperFocused,
                ]}
              >
                <MaterialIcons
                  name="call"
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
              </View>
              <SubTitle style={styles.inputHelper}>
                Opcional: Para contacto directo de aclaraciones.
              </SubTitle>
            </View>

            {errorMsg && <Label style={styles.errorText}>{errorMsg}</Label>}

            {/* Informational Note */}
            <View style={styles.infoNote}>
              <MaterialIcons
                name="info-outline"
                size={20}
                color={styles.infoIconColor.color}
                style={styles.infoIcon}
              />
              <SubTitle style={styles.infoText}>
                Al guardar este acreedor, podrá comenzar a registrar
                transacciones, pagos programados y estados de cuenta vinculados
                a esta entidad.
              </SubTitle>
            </View>
          </View>

          {/* Decorative Illustration Banner */}
          <View style={styles.bannerContainer}>
            <View style={styles.bannerCard}>
              <MaterialIcons
                name="account-balance"
                size={36}
                color={styles.bannerIconColor.color}
                style={styles.bannerIcon}
              />
              <Title style={styles.bannerTitle}>
                Estabilidad Institucional
              </Title>
              <SubTitle style={styles.bannerSubtitle}>
                Mantenga un registro preciso de sus compromisos financieros.
              </SubTitle>
            </View>
          </View>
        </ScrollView>

        {/* Footer actions */}
        <View style={styles.footer}>
          <SubTitle style={styles.footerText}>
            Todos los datos se cifran localmente.
          </SubTitle>
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
                <Label style={styles.submitButtonText}>Guardar Acreedor</Label>
                <MaterialIcons name="save" size={20} color="#ffffff" />
              </>
            )}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Main>
  );
}

const useStyles = makeStyles((t, sp, fs, fw, r) =>
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
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: sp[3],
      backgroundColor: t.bgElevated,
      borderBottomWidth: 1,
      borderBottomColor: t.border,
    },
    backButton: {
      padding: sp[2],
      borderRadius: r.full,
    },
    headerTitle: {
      fontSize: fs.lg,
      fontWeight: fw.bold,
      color: t.primary,
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
    introSection: {
      marginBottom: sp[6],
    },
    introTitle: {
      fontSize: fs.xl,
      fontWeight: fw.bold,
      color: t.primary,
      marginBottom: sp[1],
    },
    introSubtitle: {
      fontSize: fs.base,
      color: t.textMuted,
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
    inputGroup: {
      gap: sp[1],
    },
    inputLabel: {
      fontSize: fs.sm,
      fontWeight: fw.semibold,
      color: t.primary,
      textTransform: "uppercase",
      letterSpacing: 0.5,
      paddingLeft: sp[1],
    },
    inputWrapper: {
      flexDirection: "row",
      alignItems: "center",
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
    inputHelper: {
      fontSize: fs.xs,
      color: t.textMuted,
      paddingLeft: sp[1],
      marginTop: sp[1],
    },
    errorText: {
      color: t.error,
      fontSize: fs.sm,
      fontWeight: fw.semibold,
      paddingHorizontal: sp[1],
    },
    infoNote: {
      flexDirection: "row",
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
      flex: 1,
      fontSize: fs.sm,
      color: t.textMuted,
      fontStyle: "italic",
      lineHeight: 18,
    },
    bannerContainer: {
      marginTop: sp[6],
    },
    bannerCard: {
      backgroundColor: "#064e3b",
      borderRadius: r.lg,
      padding: sp[4],
      alignItems: "center",
      justifyContent: "center",
    },
    bannerIcon: {
      marginBottom: sp[2],
    },
    bannerIconColor: {
      color: "#a7f3d0",
    },
    bannerTitle: {
      fontSize: fs.md,
      fontWeight: fw.bold,
      color: "#ffffff",
      marginBottom: sp[1],
    },
    bannerSubtitle: {
      fontSize: fs.sm,
      color: "#cbd5e1",
      textAlign: "center",
      lineHeight: 18,
    },
    footer: {
      backgroundColor: t.bgElevated,
      borderTopWidth: 1,
      borderTopColor: t.border,
      padding: sp[4],
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    footerText: {
      fontSize: fs.xs,
      color: t.textMuted,
      flex: 1,
      marginRight: sp[2],
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
      fontWeight: fw.bold,
      fontSize: fs.base,
    },
  }),
);

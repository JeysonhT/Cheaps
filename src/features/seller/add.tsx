import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ArrowLeft,
  Building2,
  CircleHelp,
  Info,
  Phone,
  Save,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import Button from "@/components/Button";
import Main from "@/components/StyledView";
import { useCreditors } from "@/features/seller/hooks/useCreditors";

export default function AddCreditorScreen() {
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
    <Main className="flex-1 bg-slate-50">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        {/* Custom Header */}
        <View className="h-[60px] px-3 bg-white border-b border-slate-200 flex-row items-center justify-between">
          <Pressable
            onPress={() => router.back()}
            className="p-2 rounded-full active:opacity-70"
          >
            <ArrowLeft
              size={24}
              color="#0f172a"
            />
          </Pressable>
          <Text className="text-lg font-bold text-primary">
            {isEditing ? "Editar Acreedor" : "Agregar Acreedor"}
          </Text>
          <View className="p-2 opacity-80">
            <CircleHelp
              size={24}
              color="#94a3b8"
            />
          </View>
        </View>

        <ScrollView
          className="flex-1"
          contentContainerClassName="p-4 pb-8"
        >
          {/* Title Section */}
          <View className="mb-6">
            <Text className="text-xl font-bold text-primary mb-1">
              Detalles del Acreedor
            </Text>
            <Text className="text-[15px] text-slate-500 leading-[22px]">
              {isEditing
                ? "Modifique la información del acreedor seleccionado en su sistema de gestión de deudas."
                : "Ingrese la información necesaria para registrar un nuevo acreedor en su sistema de gestión de deuda."}
            </Text>
          </View>

          {/* Form Card */}
          <View className="bg-white rounded-xl p-4 border border-slate-200 gap-4 shadow-sm">
            {/* Field: Name */}
            <View className="gap-1">
              <Text className="text-xs font-semibold uppercase tracking-wider text-primary pl-1">
                Nombre del Acreedor
              </Text>
              <View
                className={`flex-row items-center bg-white rounded-lg px-3 h-12 border ${
                  isNameFocused ? "border-2 border-primary" : "border-slate-300"
                }`}
              >
                <Building2
                  size={20}
                  color={isNameFocused ? "#064E3B" : "#94a3b8"}
                  className="mr-2"
                />
                <TextInput
                  value={name}
                  onChangeText={(val) => {
                    setName(val);
                    if (errorMsg) setErrorMsg(null);
                  }}
                  placeholder="Ej. Banpro , Financiera Express..."
                  placeholderTextColor="#94a3b8"
                  className="flex-1 text-[15px] text-slate-900 h-full"
                  placeholderClassName=""
                  onFocus={() => setIsNameFocused(true)}
                  onBlur={() => setIsNameFocused(false)}
                />
              </View>
              <Text className="text-xs text-slate-400 pl-1 mt-1">
                Nombre legal o comercial de la entidad.
              </Text>
            </View>

            {/* Field: Phone */}
            <View className="gap-1">
              <Text className="text-xs font-semibold uppercase tracking-wider text-primary pl-1">
                Número de Teléfono
              </Text>
              <View
                className={`flex-row items-center bg-white rounded-lg px-3 h-12 border ${
                  isPhoneFocused
                    ? "border-2 border-primary"
                    : "border-slate-300"
                }`}
              >
                <Phone
                  size={20}
                  color={isPhoneFocused ? "#064E3B" : "#94a3b8"}
                  className="mr-2"
                />
                <TextInput
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  placeholder="+52 000 000 0000"
                  placeholderTextColor="#94a3b8"
                  keyboardType="phone-pad"
                  className="flex-1 text-[15px] text-slate-900 h-full"
                  onFocus={() => setIsPhoneFocused(true)}
                  onBlur={() => setIsPhoneFocused(false)}
                />
              </View>
              <Text className="text-xs text-slate-400 pl-1 mt-1">
                Opcional: Para contacto directo de aclaraciones.
              </Text>
            </View>

            {errorMsg && (
              <Text className="text-sm font-semibold text-red-500 px-1">
                {errorMsg}
              </Text>
            )}

            {/* Informational Note */}
            <View className="bg-slate-50 rounded-lg p-3 mt-2 gap-2 flex-row">
              <Info
                size={20}
                color="#2563EB"
                className="mt-0.5"
              />
              <Text className="flex-1 text-xs text-slate-500 italic leading-[18px]">
                Al guardar este acreedor, podrá comenzar a registrar
                transacciones, pagos programados y estados de cuenta vinculados
                a esta entidad.
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Footer actions */}
        <View className="bg-white border-t border-slate-200 p-4 flex-row items-center justify-between">
          <Text className="flex-1 text-xs text-slate-400 mr-2">
            Todos los datos se cifran localmente.
          </Text>
          <Button
            onPress={handleSave}
            loading={isSubmitting}
            label={isEditing ? "Actualizar Acreedor" : "Guardar Acreedor"}
            icon={Save}
          />
        </View>
      </KeyboardAvoidingView>
    </Main>
  );
}

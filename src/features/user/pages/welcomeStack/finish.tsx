import { useAssets } from "expo-asset";
import { ActivityIndicator, Image, Text, View } from "react-native";
import Button from "@/components/Button";
import useUserContext from "@/context/useUserContext";
import type { welcomeProps } from "../../types/user.types";

export default function FinishScreen(_props: welcomeProps) {
  const { setInit } = useUserContext();
  const [image] = useAssets([
    require("../../../../assets/images/logotipo_cheaps.png"),
  ]);

  if (!image) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#064E3B" />
      </View>
    );
  }

  const handleFinish = () => {
    // Para las primeras versiones de la app pasamos valores por defecto y evitamos fricción
    setInit(true, "Usuario", "");
  };

  return (
    <View className="flex-1 items-center justify-center p-4 gap-2 w-full">
      {/* Content section */}
      <View className="flex-[3] items-center justify-center px-4">
        <Image
          source={{ uri: image[0].localUri ?? image[0].uri }}
          style={{ height: 200, width: 300 }}
          resizeMode="contain"
        />
        <Text className="text-2xl font-bold text-slate-900 text-center my-4">
          ¡Todo listo!
        </Text>
        <Text className="text-base font-semibold text-slate-800 text-center">
          Has completado la guía de inicio rápido.
        </Text>
        <Text className="text-sm text-slate-500 text-center my-4 leading-5">
          Ya puedes comenzar a registrar y dar seguimiento a tus cuentas sin
          ninguna fricción.
        </Text>
      </View>

      {/* Action button section */}
      <View className="flex-1 justify-center items-center w-full px-6">
        <Button
          label="Comenzar"
          onPress={handleFinish}
          className="w-full max-w-xs"
        />
      </View>
    </View>
  );
}

import { useAssets } from "expo-asset";
import { ActivityIndicator, Image, Text, View } from "react-native";
import Button from "@/components/Button";
import Main from "@/components/StyledView";
import type { welcomeProps } from "../../types/user.types";

export default function GreetingsScreen({ handleNext }: welcomeProps) {
  const [image] = useAssets([
    require("../../../../assets/images/logotipo_cheaps.png"),
  ]);

  if (!image) {
    return (
      <Main>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator
            size="large"
            color="#064E3B"
          />
        </View>
      </Main>
    );
  }

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
          Bienvenido a Cheaps
        </Text>
        <Text className="text-base font-semibold text-slate-800 text-center">
          Tu aliado para decirle adiós a las cuentas olvidadas.
        </Text>
        <Text className="text-sm text-slate-500 text-center my-4 leading-5">
          Gestiona tus compromisos financieros de forma rápida, eficiente y sin
          estrés. ¡Empecemos!
        </Text>
      </View>

      {/* Action button section */}
      <View className="flex-1 justify-center items-center w-full px-6">
        <Button
          label="Siguiente Página"
          onPress={handleNext}
          className="w-full max-w-xs"
        />
      </View>
    </View>
  );
}

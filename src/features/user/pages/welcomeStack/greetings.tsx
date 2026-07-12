import { useAssets } from "expo-asset";
import { ActivityIndicator, Image } from "react-native";
import Button from "@/components/Button/Button";
import { Text, VStack } from "@/components/layout";
import Main from "@/components/StyledView";
import type { welcomeProps } from "../../types/user.types";

export default function GreetingsScreen({ handleNext }: welcomeProps) {
  const [image, _] = useAssets([
    require("../../../../assets/images/logotipo_cheaps.png"),
  ]);

  if (!image) {
    return (
      <Main>
        <VStack align="center" justify="center" flex={1}>
          <ActivityIndicator color="#000" />
        </VStack>
      </Main>
    );
  }

  return (
    <VStack flex={1} align="center" justify="center" p="2" gap="2">
      <VStack flex={3} align="center" justify="center">
        <Image
          source={{ uri: image[0].localUri ?? image[0].uri }}
          style={{ height: 200, width: 300 }}
        />
        <Text
          variant="highlight"
          size="xl"
          weight="bold"
          color="text"
          align="center"
          my="4"
        >
          Bienvenido a Cheaps
        </Text>
        <Text size="md" weight="semibold" align="center">
          Tu aliado para decirle adiós a las cuentas olvidadas.
        </Text>
        <Text color="textMuted" align="center" my="4">
          Gestiona tus compromisos financieros de forma rápida, eficiente y sin
          estrés. ¡Empecemos!
        </Text>
      </VStack>
      <VStack flex={1} justify="center" align="center">
        <Button label="Siguiente Pagina" onPress={handleNext} />
      </VStack>
    </VStack>
  );
}

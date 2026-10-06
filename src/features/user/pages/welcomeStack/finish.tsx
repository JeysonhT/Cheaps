import { useAssets } from "expo-asset";
import { ActivityIndicator, Image } from "react-native";
import Button from "@/components/Button/Button";
import { Text, VStack } from "@/components/layout";
import useUserContext from "@/context/useUserContext";
import type { welcomeProps } from "../../types/user.types";

export default function FinishScreen(_props: welcomeProps) {
  const { setInit } = useUserContext();
  const [image, _] = useAssets([
    require("../../../../assets/images/logotipo_cheaps.png"),
  ]);

  if (!image) {
    return (
      <VStack align="center" justify="center" flex={1}>
        <ActivityIndicator color="#000" />
      </VStack>
    );
  }

  const handleFinish = () => {
    // Para las primeras versiones de la app pasamos valores por defecto y evitamos fricción
    setInit(true, "Usuario", "");
  };

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
          ¡Todo listo!
        </Text>
        <Text size="md" weight="semibold" align="center">
          Has completado la guía de inicio rápido.
        </Text>
        <Text color="textMuted" align="center" my="4">
          Ya puedes comenzar a registrar y dar seguimiento a tus cuentas sin
          ninguna fricción.
        </Text>
      </VStack>
      <VStack flex={1} justify="center" align="center">
        <Button label="Comenzar" onPress={handleFinish} />
      </VStack>
    </VStack>
  );
}

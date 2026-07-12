import Button from "@/components/Button/Button";
import { Text, VStack } from "@/components/layout";
import useUserContext from "@/context/useUserContext";
import type { welcomeProps } from "../../types/user.types";

export default function TipsScreen({ handleNext }: welcomeProps) {
  const { setInit } = useUserContext();

  return (
    <VStack align="center" justify="center" flex={1} p="2" gap="2">
      <Text>Esta es la pagina de tips</Text>
      <Button label="Entrar" onPress={() => setInit(true)} />
    </VStack>
  );
}

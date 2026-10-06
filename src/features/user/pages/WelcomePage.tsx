import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import { Text, VStack } from "@/components/layout";
import Main from "@/components/StyledView";
import useUserContext from "@/context/useUserContext";
import WELCOME_COMPONENTS from "../constants/welcomeComponents";
import useWelcomePageStore from "../store/useWelcomePage";

const WELCOME_ELEMENTS = ["greeting", "guide", "finish"];

export default function WelcomePage() {
  const { currentComponent, setNetx } = useWelcomePageStore();

  const [index, setIndex] = useState(0);

  const { isInit, isLoading } = useUserContext();

  useEffect(() => {
    if (!currentComponent) {
      setNetx(WELCOME_ELEMENTS[0]);
    }
  }, [currentComponent, setNetx]);

  useEffect(() => {
    setNetx(WELCOME_ELEMENTS[index]);
  }, [index, setNetx]);

  const Component = WELCOME_COMPONENTS[currentComponent];

  const handleNext = () => {
    if (index < WELCOME_ELEMENTS.length - 1) {
      setIndex(index + 1);
    }
  };

  if (isLoading) {
    return (
      <Main>
        <VStack gap="2" p="2" align="center" justify="center" flex={1}>
          <Text size="md" weight="semibold" color="text" align="center">
            Cargando...
          </Text>
          <ActivityIndicator color="#000" />
        </VStack>
      </Main>
    );
  }

  if (isInit) {
    return <Redirect href="/(tabs)/dashboard" />;
  }

  return (
    <Main>
      <VStack gap="2" p="2" align="center" justify="center" flex={1}>
        {!Component ? null : <Component handleNext={handleNext} />}
      </VStack>
    </Main>
  );
}

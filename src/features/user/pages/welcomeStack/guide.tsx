import { useState } from "react";
import { ActivityIndicator, Image, StyleSheet, View } from "react-native";
import {
  Directions,
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import Button from "@/components/Button/Button";
import { HStack, Text, VStack } from "@/components/layout";
import Main from "@/components/StyledView";
import { makeStyles } from "@/hooks/useTheme";
import useGetGuideImages from "../../hooks/useGetGuideImages";
import type { welcomeProps } from "../../types/user.types";

const _width = 300;

export default function GuideScreen({ handleNext }: welcomeProps) {
  const { images, error } = useGetGuideImages();

  const styles = useStyles();

  const [guideIndex, setGuideIndex] = useState(0);

  const translateX = useSharedValue(0);

  const prevSlide = () => {
    setGuideIndex((prev) => Math.max(0, prev - 1));
  };

  const nextSlide = () => {
    setGuideIndex((prev) => Math.min((images?.length ?? 1) - 1, prev + 1));
  };

  const rightFling = Gesture.Fling()
    .direction(Directions.RIGHT)
    .onStart(() => {
      translateX.value = withSequence(
        withTiming(400, { duration: 250 }),
        withSpring(0),
      );
      scheduleOnRN(prevSlide);
    });

  const leftFling = Gesture.Fling()
    .direction(Directions.LEFT)
    .onStart(() => {
      translateX.value = withSequence(
        withTiming(-400, { duration: 250 }),
        withSpring(0),
      );
      scheduleOnRN(nextSlide);
    });

  const fling = Gesture.Race(rightFling, leftFling);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  if (error) {
    return (
      <Main>
        <VStack align="center" justify="center" flex={1}>
          <Text>No se pudieron cargar las imagenes: {error.message}</Text>
        </VStack>
      </Main>
    );
  }

  if (!images || images.length === 0) {
    return (
      <Main>
        <VStack align="center" justify="center" flex={1}>
          <ActivityIndicator color="#000" />
        </VStack>
      </Main>
    );
  }

  const renderCircles = () => {
    return (
      <HStack p="2" gap="4" align="center" justify="center">
        {[...Array(images.length)].map((_, i) => (
          <View
            key={i.toString()}
            style={[
              styles.circle,
              i === guideIndex ? styles.isActive : styles.inactive,
            ]}
          />
        ))}
      </HStack>
    );
  };

  return (
    <GestureHandlerRootView>
      <VStack align="center" justify="center" flex={1} p="2" gap="4">
        <Text size="lg" weight="bold">
          Guia Básica
        </Text>
        <Text size="md" color="textMuted">
          Desliza a hacia la izquierda para avanzar
        </Text>
      </VStack>
      <GestureDetector gesture={fling}>
        <VStack flex={8} align="center" justify="center">
          <Animated.View style={animatedStyle}>
            <Image
              source={{ uri: images[guideIndex].image }}
              style={{ height: _width * 1.333, width: _width }}
            />
          </Animated.View>
          <Text size="md" align="center" my="4" variant="highlight">
            {images[guideIndex].title}
          </Text>
          {renderCircles()}
        </VStack>
      </GestureDetector>
      <VStack flex={1} align="center" justify="center">
        <Button
          label="Siguiente Pagina"
          onPress={handleNext}
          isInactive={guideIndex !== images.length - 1}
        />
      </VStack>
    </GestureHandlerRootView>
  );
}

const useStyles = makeStyles((t, sp, fs, fw, r) =>
  StyleSheet.create({
    circle: { borderRadius: r.full, width: 10, height: 10 },
    inactive: { backgroundColor: t.bgMuted },
    isActive: { backgroundColor: t.primary },
  }),
);

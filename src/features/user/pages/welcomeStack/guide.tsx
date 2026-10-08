import { useState } from "react";
import { ActivityIndicator, Image, Text, View } from "react-native";
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
import Button from "@/components/Button";
import Main from "@/components/StyledView";
import useGetGuideImages from "../../hooks/useGetGuideImages";
import type { welcomeProps } from "../../types/user.types";

const _width = 300;

export default function GuideScreen({ handleNext }: welcomeProps) {
  const { images, error } = useGetGuideImages();

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
        <View className="flex-1 items-center justify-center p-4">
          <Text className="text-base text-red-500 text-center">
            No se pudieron cargar las imágenes: {error.message}
          </Text>
        </View>
      </Main>
    );
  }

  if (!images || images.length === 0) {
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

  const renderCircles = () => {
    return (
      <View className="flex-row items-center justify-center p-2 gap-2">
        {images.map((_, i) => (
          <View
            key={i.toString()}
            className={`h-2.5 rounded-full ${
              i === guideIndex ? "w-6 bg-primary" : "w-2.5 bg-slate-300"
            }`}
          />
        ))}
      </View>
    );
  };

  return (
    <GestureHandlerRootView className="flex-1 w-full justify-between items-center">
      {/* Header section */}
      <View className="flex-1 items-center justify-center p-2">
        <Text className="text-2xl font-bold text-slate-900 mb-1">
          Guía Básica
        </Text>
        <Text className="text-base text-slate-500 text-center">
          Desliza hacia la izquierda para avanzar
        </Text>
      </View>

      {/* Carousel card section */}
      <GestureDetector gesture={fling}>
        <View className="flex-[8] items-center justify-center">
          <Animated.View style={animatedStyle}>
            <Image
              source={{ uri: images[guideIndex].image }}
              style={{ height: _width * 1.333, width: _width }}
              className="rounded-2xl"
            />
          </Animated.View>
          <Text className="text-base font-semibold text-slate-800 text-center my-4 px-4">
            {images[guideIndex].title}
          </Text>
          {renderCircles()}
        </View>
      </GestureDetector>

      {/* Action button section */}
      <View className="flex-1 items-center justify-center w-full px-6">
        <Button
          label="Siguiente Página"
          onPress={handleNext}
          isInactive={guideIndex !== images.length - 1}
          className="w-full"
        />
      </View>
    </GestureHandlerRootView>
  );
}

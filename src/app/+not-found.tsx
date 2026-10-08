import { Link, Stack } from "expo-router";
import { Text, View } from "react-native";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <View className="flex-1 items-center justify-center p-4">
        <Text className="text-xl font-bold text-slate-900">
          Esta Página no existe
        </Text>

        <Link
          href="/"
          className="mt-4 py-4"
        >
          <Text className="text-sm text-primary font-semibold">
            Go to home screen!
          </Text>
        </Link>
      </View>
    </>
  );
}

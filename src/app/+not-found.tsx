import { Text, VStack } from "@/components/layout";
import { Link, Stack } from "expo-router";
import { StyleSheet } from "react-native";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <VStack flex={1} align="center" justify="center" p="4">
        <Text size="xl" weight="bold" color="text">
          Esta Pagina no existe
        </Text>

        <Link href="/" style={styles.link}>
          <Text size="sm" color="primary">
            Go to home screen!
          </Text>
        </Link>
      </VStack>
    </>
  );
}

const styles = StyleSheet.create({
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});

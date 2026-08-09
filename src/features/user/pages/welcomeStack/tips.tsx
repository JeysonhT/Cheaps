import { useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import Button from "@/components/Button/Button";
import { HStack, Text, VStack } from "@/components/layout";
import useUserContext from "@/context/useUserContext";
import type { welcomeProps } from "../../types/user.types";

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 8,
    width: 250,
  },
  InputContainer: {
    padding: 16,
    borderRadius: 16,
    borderColor: "#ccc",
    backgroundColor: "#f5fdf5",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 1,
    elevation: 1,
  },
});

export default function TipsScreen({ handleNext }: welcomeProps) {
  const { setInit } = useUserContext();
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");

  return (
    <VStack align="center" justify="center" flex={1} p="2" gap="2">
      <VStack align="center" gap="4" style={styles.InputContainer}>
        <Text align="center" size="lg" variant="highlight">
          Ingresa tu nombre y apellido para personalizar tu experiencia
        </Text>
        <View style={{ gap: 8 }}>
          <Text size="md">Ingresa tu nombre</Text>
          <TextInput
            aria-label="Ingresa tu nombre"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />
        </View>
        <View style={{ gap: 8 }}>
          <Text size="md">Ingresa tu apellido</Text>
          <TextInput
            aria-label="Ingresa tu apellido"
            value={lastName}
            onChangeText={setLastName}
            style={styles.input}
          />
        </View>
        <HStack align="center" gap="2">
          <Button
            label={"Entrar"}
            onPress={(): void => setInit(true, name, lastName)}
          />
        </HStack>
      </VStack>
      <Text align="center" size="sm" variant="highlight" color={"textMuted"}>
        Este nombre y apellido se guardará en tu dispositivo y no se compartirá
        con nadie. Solo se utilizará para personalizar tu experiencia en la
        aplicación.
      </Text>
    </VStack>
  );
}

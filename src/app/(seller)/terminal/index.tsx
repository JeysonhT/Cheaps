import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TerminalScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Terminal</Text>
        <Text style={styles.subtitle}>Procesa pagos y cobra a tus clientes</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  content: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  title: { fontSize: 28, fontWeight: "700", color: "#064E3B", marginBottom: 8 },
  subtitle: { fontSize: 15, color: "#64748B", textAlign: "center" },
});

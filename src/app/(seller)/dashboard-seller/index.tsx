import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DashboardSellerScreen() {
  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <View className="flex-1 items-center justify-center p-6">
        <Text className="text-2xl font-bold text-primary mb-2">Dashboard</Text>
        <Text className="text-[15px] text-slate-500 text-center">
          Resumen de tu actividad como vendedor
        </Text>
      </View>
    </SafeAreaView>
  );
}

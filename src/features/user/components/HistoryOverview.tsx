import { Link } from "expo-router";
import { useEffect } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import Card from "@/components/Card";
import HistoryElement from "@/features/history/components/HistoryElement";
import { useHistory } from "@/features/history/hooks/useHistory";
import { useGetUserStats } from "../hooks/useGetUserStats";

export default function HistoryOverview() {
  const { payments, fetchHistory } = useHistory();

  const { userFullName } = useGetUserStats();

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const displayedPayments = payments.slice(0, 3);
  const greetingName = userFullName
    ? `${userFullName.name} ${userFullName.lastName}`
    : "usuario";

  return (
    <View className="p-2 shrink">
      <Text className="text-lg text-slate-900 font-bold">
        Historial reciente
      </Text>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-2"
      >
        <Card className="p-0 bg-slate-200 mx-1 rounded-lg overflow-hidden">
          {payments.length === 0 ? (
            <View className="items-center justify-center p-4">
              <Text className="text-sm text-slate-500 italic text-center">
                {`Hola ${greetingName},\n\nAún no tienes pagos registrados.`}
              </Text>
            </View>
          ) : (
            <View>
              {displayedPayments.map((payment, index) => (
                <View key={payment.id}>
                  <HistoryElement payment={payment} />
                  {index < displayedPayments.length - 1 && (
                    <View className="border-b border-slate-300" />
                  )}
                </View>
              ))}
            </View>
          )}

          {payments.length > 0 && (
            <Link
              href="/(tabs)/history"
              asChild
            >
              <Pressable className="bg-slate-200 rounded-b-lg h-[50] items-center justify-center active:opacity-80">
                <Text className="text-base font-medium text-slate-900">
                  Ver historial Completo
                </Text>
              </Pressable>
            </Link>
          )}
        </Card>
      </ScrollView>
    </View>
  );
}

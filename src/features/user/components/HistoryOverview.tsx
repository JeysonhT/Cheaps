import { Link } from "expo-router";
import { useEffect } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import Card from "@/components/Card";
import { Text, VStack } from "@/components/layout";
import HistoryElement from "@/features/history/components/HistoryElement";
import { useHistory } from "@/features/history/hooks/useHistory";
import { makeStyles } from "@/hooks/useTheme";
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
    <VStack className="p-2 shrink">
      <Text
        className="text-lg text-gray-900 font-bold"
        size="lg"
        weight="bold"
        color="text"
      >
        Historial reciente
      </Text>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-2"
      >
        <Card className="p-0 bg-slate-200 mx-1 rounded-lg overflow-hidden">
          {payments.length === 0 ? (
            <VStack align="center" justify="center" p="4">
              <Text className="text-sm text-gray-500 italic">
                {`Hola ${greetingName},\n\nAún no tienes pagos registrados.`}
              </Text>
            </VStack>
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
            <Link href="/(tabs)/history" asChild>
              <Pressable className="bg-slate-200 rounded-b-lg h-[50] items-center justify-center">
                <Text size="base" weight="medium" color="text">
                  Ver historial Completo
                </Text>
              </Pressable>
            </Link>
          )}
        </Card>
      </ScrollView>
    </VStack>
  );
}

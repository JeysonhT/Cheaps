import { Link } from "expo-router";
import { useEffect } from "react";
import { Pressable, ScrollView, StyleSheet, Text } from "react-native";
import { HStack, VStack } from "@/components/layout";
import { useDebts } from "@/features/debts/hooks/useDebts";
import { useCreditors } from "@/features/seller/hooks/useCreditors";
import type { Creditor, DebtWithCreditor } from "@/types";
import SellerCard from "./SellerCard";

export default function SellersOverview() {
  const { creditors, fetchCreditors } = useCreditors();
  const { debts, fetchDebts } = useDebts();

  useEffect(() => {
    fetchCreditors();
    fetchDebts();
  }, [fetchCreditors, fetchDebts]);

  // Limitar a un máximo de 3 acreedores
  const displayedCreditors = creditors.slice(0, 3);

  // Mapear cada acreedor con su deudor más grande
  const creditorsWithLargestDebt = displayedCreditors.map(
    (creditor: Creditor) => {
      const creditorDebts = debts.filter((d) => d.idCreditor === creditor.id);
      let largestDebt: DebtWithCreditor | null = null;
      if (creditorDebts.length > 0) {
        largestDebt = creditorDebts.reduce(
          (max, d) => (d.amount > max.amount ? d : max),
          creditorDebts[0],
        );
      }
      return {
        creditor,
        largestDebt,
      };
    },
  );

  return (
    <VStack className="p-2">
      <HStack className="justify-between items-center mb-2">
        <Text className="text-xl font-bold text-gray-900">Mis acreedores</Text>
        <Link href={"/(tabs)/debts/sellers"} asChild>
          <Pressable className="items-center px-2 py-1 rounded-lg bg-primary-400 flex-row gap-1">
            <Text className="text-sm text-white font-medium">Ver todos</Text>
          </Pressable>
        </Link>
      </HStack>

      {creditors.length === 0 ? (
        <VStack className="items-center justify-center p-4 bg-gray-100 rounded-lg border border-gray-300">
          <Text className="text-sm text-gray-700 italic">
            No tienes acreedores registrados
          </Text>
        </VStack>
      ) : (
        <ScrollView
          scrollEnabled
          horizontal
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          className="w-full"
          contentContainerClassName="items-center py-2 gap-3"
        >
          {creditorsWithLargestDebt.map(
            ({
              creditor,
              largestDebt,
            }: {
              creditor: Creditor;
              largestDebt: DebtWithCreditor | null;
            }) => (
              <SellerCard
                key={creditor.id}
                creditor={creditor}
                largestDebt={largestDebt}
              />
            ),
          )}
        </ScrollView>
      )}
    </VStack>
  );
}

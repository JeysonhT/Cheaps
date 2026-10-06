import { Link } from "expo-router";
import { ChevronRight } from "lucide-react-native";
import { useEffect } from "react";
import { Pressable, ScrollView, StyleSheet } from "react-native";
import { HStack, Text, VStack } from "@/components/layout";
import Colors from "@/constants/Colors";
import { useDebts } from "@/features/debts/hooks/useDebts";
import { useCreditors } from "@/features/seller/hooks/useCreditors";
import { makeStyles } from "@/hooks/useTheme";
import type { Creditor, DebtWithCreditor } from "@/types";
import SellerCard from "./SellerCard";

export default function SellersOverview() {
  const styles = useStyles();
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
    <VStack p="2">
      <HStack justify="space-between" align="center" style={styles.header}>
        <Text size="lg" weight="bold" color="text">
          Mis acreedores
        </Text>
        <Link href={"/(tabs)/debts/sellers"} asChild>
          <Pressable>
            <HStack align="center">
              <Text size="sm" color="textMuted">
                Ver todos
              </Text>
              <ChevronRight
                size={20}
                color={Colors.light.tabIconDefault}
              />
            </HStack>
          </Pressable>
        </Link>
      </HStack>

      {creditors.length === 0 ? (
        <VStack align="center" justify="center" style={styles.emptyContainer}>
          <Text size="sm" color="textMuted" style={{ fontStyle: "italic" }}>
            No tienes acreedores registrados
          </Text>
        </VStack>
      ) : (
        <ScrollView
          scrollEnabled
          horizontal
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          style={styles.slider}
          contentContainerStyle={styles.body}
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

const useStyles = makeStyles((t, sp, fs, fw) =>
  StyleSheet.create({
    header: {
      marginBottom: sp[2],
    },
    slider: {
      width: "100%",
    },
    body: {
      alignItems: "center",
      paddingTop: sp[1],
      paddingBottom: sp[1],
      gap: sp[3],
    },
    emptyContainer: {
      padding: sp[4],
      backgroundColor: t.bgSubtle,
      borderRadius: sp[2],
      marginHorizontal: sp[1],
      borderWidth: 1,
      borderColor: t.border,
    },
  }),
);

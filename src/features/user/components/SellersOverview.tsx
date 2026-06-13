import React, { useEffect } from "react";
import { Label, Title } from "@/components/StyledText";
import Colors from "@/constants/Colors";
import { makeStyles } from "@/hooks/useTheme";
import MaterialIcons from "@react-native-vector-icons/material-icons";
import { Link } from "expo-router";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import SellerCard from "./SellerCard";
import { useCreditors } from "@/features/seller/hooks/useCreditors";
import { useDebts } from "@/features/debts/hooks/useDebts";
import { Creditor, DebtWithCreditor } from "@/types";

export default function SellersOverview() {
  const styles = useStyles();
  const { creditors, fetchCreditors } = useCreditors();
  const { debts, fetchDebts } = useDebts();

  useEffect(() => {
    fetchCreditors();
    fetchDebts();
  }, []);

  // Limitar a un máximo de 3 acreedores
  const displayedCreditors = creditors.slice(0, 3);

  // Mapear cada acreedor con su deudor más grande
  const creditorsWithLargestDebt = displayedCreditors.map((creditor: Creditor) => {
    const creditorDebts = debts.filter((d) => d.idCreditor === creditor.id);
    let largestDebt: DebtWithCreditor | null = null;
    if (creditorDebts.length > 0) {
      largestDebt = creditorDebts.reduce((max, d) => (d.amount > max.amount ? d : max), creditorDebts[0]);
    }
    return {
      creditor,
      largestDebt,
    };
  });

  return (
    <View style={styles.sliderView}>
      <View style={styles.header}>
        <Title>Mis acreedores</Title>
        <Link href={"/(tabs)/dashboard/sellers"} asChild>
          <Pressable style={styles.headerButtom}>
            <Label style={styles.buttomText}>Ver todos</Label>
            <MaterialIcons
              name="keyboard-arrow-right"
              size={20}
              color={Colors.light.tabIconDefault}
            />
          </Pressable>
        </Link>
      </View>
      
      {creditors.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Label style={styles.emptyText}>No tienes acreedores registrados</Label>
        </View>
      ) : (
        <ScrollView
          scrollEnabled
          horizontal
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          style={styles.slider}
          contentContainerStyle={styles.body}
        >
          {creditorsWithLargestDebt.map(({ creditor, largestDebt }: { creditor: Creditor, largestDebt: DebtWithCreditor | null }) => (
            <SellerCard
              key={creditor.id}
              creditor={creditor}
              largestDebt={largestDebt}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const useStyles = makeStyles((t, sp, fs, fw) =>
  StyleSheet.create({
    sliderView: {
      flexDirection: "column",
      padding: sp[2],
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: sp[2],
    },
    headerButtom: { flexDirection: "row", alignItems: "center" },
    buttomText: { color: Colors.light.tabIconDefault },
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
      alignItems: "center",
      justifyContent: "center",
      marginHorizontal: sp[1],
      borderWidth: 1,
      borderColor: t.border,
    },
    emptyText: {
      fontStyle: "italic",
      color: t.textMuted,
    },
  }),
);

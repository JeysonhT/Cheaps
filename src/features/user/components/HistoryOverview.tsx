import React, { useEffect } from "react";
import Card from "@/components/Card";
import { SubTitle, Title } from "@/components/StyledText";
import { makeStyles } from "@/hooks/useTheme";
import { Link } from "expo-router";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import HistoryElement from "@/features/history/components/HistoryElement";
import { useHistory } from "@/features/history/hooks/useHistory";

export default function HistoryOverview() {
  const styles = useStyles();
  const { payments, fetchHistory } = useHistory();

  useEffect(() => {
    fetchHistory();
  }, []);

  const displayedPayments = payments.slice(0, 3);
  const showMore = payments.length > 3;

  return (
    <View style={styles.mainView}>
      <Title>Historial reciente</Title>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.slider}
      >
        <Card style={styles.card}>
          {payments.length === 0 ? (
            <View style={styles.emptyView}>
              <SubTitle style={styles.emptyText}>No hay abonos registrados recientemente</SubTitle>
            </View>
          ) : (
            <View>
              {displayedPayments.map((payment, index) => (
                <View key={payment.id}>
                  <HistoryElement payment={payment} />
                  {index < displayedPayments.length - 1 && (
                    <View style={styles.separator} />
                  )}
                </View>
              ))}
            </View>
          )}

          {payments.length > 0 && (
            <Link href="/(tabs)/history" asChild>
              <Pressable style={styles.presableView}>
                <SubTitle>Ver historial Completo</SubTitle>
              </Pressable>
            </Link>
          )}
        </Card>
      </ScrollView>
    </View>
  );
}

const useStyles = makeStyles((t, sp, fs, fw, r) =>
  StyleSheet.create({
    mainView: { padding: sp[2], flexShrink: 1 },
    card: {
      padding: sp[0],
      backgroundColor: t.bgSubtle,
      marginHorizontal: sp[1],
      borderRadius: r.md,
      overflow: "hidden",
    },
    separator: { borderBottomWidth: 1, borderBottomColor: t.bgMuted },
    presableView: {
      backgroundColor: t.bgMuted,
      borderBottomStartRadius: r.md,
      borderBottomEndRadius: r.md,
      height: 50,
      alignItems: "center",
      justifyContent: "center",
    },
    slider: { paddingBottom: sp[2] },
    emptyView: {
      padding: sp[4],
      alignItems: "center",
      justifyContent: "center",
    },
    emptyText: {
      fontStyle: "italic",
      textAlign: "center",
    },
  }),
);

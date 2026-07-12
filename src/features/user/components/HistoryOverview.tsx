import { Link } from "expo-router";
import { useEffect } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import Card from "@/components/Card";
import { Text, VStack } from "@/components/layout";
import HistoryElement from "@/features/history/components/HistoryElement";
import { useHistory } from "@/features/history/hooks/useHistory";
import { makeStyles } from "@/hooks/useTheme";

export default function HistoryOverview() {
  const styles = useStyles();
  const { payments, fetchHistory } = useHistory();

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const displayedPayments = payments.slice(0, 3);

  return (
    <VStack p="2" style={styles.mainView}>
      <Text size="lg" weight="bold" color="text">
        Historial reciente
      </Text>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.slider}
      >
        <Card style={styles.card}>
          {payments.length === 0 ? (
            <VStack align="center" justify="center" p="4">
              <Text
                size="sm"
                color="textMuted"
                align="center"
                style={{ fontStyle: "italic" }}
              >
                No hay abonos registrados recientemente
              </Text>
            </VStack>
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

const useStyles = makeStyles((t, sp, fs, fw, r) =>
  StyleSheet.create({
    mainView: { flexShrink: 1 },
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
  }),
);

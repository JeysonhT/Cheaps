import { StyleSheet, View, ViewProps } from "react-native";
import { makeStyles } from "../hooks/useTheme";

const cardStyles = makeStyles((t, sp, fs, fw, r) =>
  StyleSheet.create({
    card: {
      marginTop: sp[2],
      padding: sp[4],
      elevation: 1,
      borderRadius: r.md,
    },
  }),
);

export default function Card({ style, ...props }: ViewProps) {
  const styles = cardStyles();

  return <View style={[styles.card, style]} {...props} />;
}

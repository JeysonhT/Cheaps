import { StyleSheet } from "react-native";
import { makeStyles } from "@/hooks/useTheme";

export const styles = makeStyles((t, sp, fs, fw, r) =>
  StyleSheet.create({
    container: {
      backgroundColor: t.bgElevated,
      borderRadius: r.md,
      paddingVertical: sp[4],
      paddingHorizontal: sp[6],
      marginHorizontal: sp[4],
      shadowColor: t.bgMuted,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 6,
      minHeight: 60,
    },
    iconWrapper: {
      width: 36,
      height: 36,
      borderRadius: r.full,
      justifyContent: "center",
      alignItems: "center",
      marginRight: sp[4],
    },
    textContainer: {
      flex: 1,
    },
    title: {
      color: t.text,
    },
    message: {
      color: t.text,
      marginTop: 2,
    },
  }),
);

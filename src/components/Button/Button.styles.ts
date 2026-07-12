import { StyleSheet } from "react-native";
import { makeStyles } from "@/hooks/useTheme";

const useStyles = makeStyles((t, sp, fs, fw, r) =>
  StyleSheet.create({
    base: {
      padding: sp[2],
      borderRadius: r.md,
      elevation: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    text: {
      fontSize: fs.base,
      fontWeight: fw.medium,
    },
    primary: {
      backgroundColor: t.primary,
      color: t.textInverse,
    },
    secondary: {
      backgroundColor: t.buttonSecondary,
      color: t.textInverse,
    },
    inverted: {
      backgroundColor: t.buttonInverted,
      color: t.text,
    },
    outlined: {
      backgroundColor: t.buttonOutlined,
      borderColor: t.text,
      color: t.text,
    },
    danger: {
      backgroundColor: t.error,
      color: t.textInverse,
    },
  }),
);

export default useStyles;

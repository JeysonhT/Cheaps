import { StyleSheet, Text, TextProps } from "react-native";
import { makeStyles } from "../hooks/useTheme";

const useStyles = makeStyles((t, sp, fs, fw) =>
  StyleSheet.create({
    headerTitle: {
      fontSize: fs["4xl"],
      fontWeight: fw.bold,
      color: t.text,
    },
    cardTitle: {
      fontSize: fs.lg,
      fontWeight: fw.bold,
      color: t.text,
    },
    title: {
      fontSize: fs.xl,
      fontWeight: fw.bold,
      color: t.text,
    },
    subTitle: {
      fontSize: fs.sm,
      fontWeight: fw.semibold,
      color: t.textMuted,
    },
    label: {
      fontSize: fs.base,
      fontWeight: fw.regular,
      color: t.text,
    },
    error: {
      fontSize: fs.md,
      fontWeight: fw.semibold,
      color: t.error,
    },
  }),
);

export function DashboardInfo({ style, ...props }: TextProps) {
  const styles = useStyles();

  return <Text style={[styles.headerTitle, style]} {...props} />;
}

export function Title({ style, ...props }: TextProps) {
  const styles = useStyles();
  return <Text style={[styles.title, style]} {...props} />;
}

export function CardTitle({ style, ...props }: TextProps) {
  const styles = useStyles();
  return <Text style={[styles.cardTitle, style]} {...props} />;
}

export function SubTitle({ style, ...props }: TextProps) {
  const styles = useStyles();
  return <Text style={[styles.subTitle, style]} {...props} />;
}

export function Label({ style, ...props }: TextProps) {
  const styles = useStyles();
  return <Text style={[styles.label, style]} {...props} />;
}

export function ErrorText({ style, ...props }: TextProps) {
  const styles = useStyles();
  return <Text style={[styles.error, style]} {...props} />;
}

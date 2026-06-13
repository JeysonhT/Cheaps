import { View as DefaultView, StyleSheet, ViewProps } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { makeStyles } from "../hooks/useTheme";

const useStyle = makeStyles((t) =>
  StyleSheet.create({
    viewStyle: {
      flex: 1,
      backgroundColor: t.bg,
    },
  }),
);

export default function Main({ style, ...props }: ViewProps) {
  const styles = useStyle();
  const insets = useSafeAreaInsets();

  return (
    <DefaultView
      style={[styles.viewStyle, style, { paddingTop: insets.top }]}
      {...props}
    />
  );
}

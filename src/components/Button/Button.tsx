import MaterialIcons, {
  type MaterialIconsIconName,
} from "@react-native-vector-icons/material-icons";
import { ActivityIndicator, Pressable, Text } from "react-native";
import { HStack } from "../layout";
import useStyles from "./Button.styles";

type ButtonProps = {
  label: string;
  variant?: "primary" | "secondary" | "inverted" | "outlined" | "danger";
  icon?: MaterialIconsIconName | null;
  loading?: boolean;
  isInactive?: boolean;
  onPress: () => void;
};

export default function Button({
  label,
  variant = "primary",
  icon = null,
  loading,
  isInactive,
  onPress,
}: ButtonProps) {
  const styles = useStyles();

  const isIconized = icon !== null && icon !== undefined;

  return (
    <Pressable
      onPress={onPress}
      disabled={loading || isInactive}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        isInactive && { opacity: 0.5 },
        pressed && { opacity: 0.8 },
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === "outlined" ? "#000" : "#fff"} />
      ) : (
        <HStack gap="1" align="center">
          {isIconized ? (
            <MaterialIcons
              name={icon}
              size={24}
              color={variant === "outlined" ? "#000" : "#fff"}
            />
          ) : null}

          <Text style={[styles.text, { color: styles[variant].color }]}>
            {label}
          </Text>
        </HStack>
      )}
    </Pressable>
  );
}

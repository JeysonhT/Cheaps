import type { LucideIcon } from "lucide-react-native";
import {
  ActivityIndicator,
  Pressable,
  type PressableProps,
  Text,
  View,
} from "react-native";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "inverted"
  | "outlined"
  | "danger";

export type ButtonProps = {
  label: string;
  variant?: ButtonVariant;
  icon?: LucideIcon | null;
  loading?: boolean;
  isInactive?: boolean;
  onPress: () => void;
  className?: string;
  labelClassName?: string;
} & Omit<PressableProps, "onPress" | "disabled" | "children">;

const VARIANT_CONFIG: Record<
  ButtonVariant,
  { container: string; text: string; iconColor: string }
> = {
  primary: {
    container: "bg-primary",
    text: "text-white",
    iconColor: "#ffffff",
  },
  secondary: {
    container: "bg-blue-300",
    text: "text-white",
    iconColor: "#ffffff",
  },
  inverted: {
    container: "bg-slate-700",
    text: "text-slate-900",
    iconColor: "#0f172a",
  },
  outlined: {
    container: "bg-slate-200 border border-slate-900",
    text: "text-slate-900",
    iconColor: "#0f172a",
  },
  danger: {
    container: "bg-red-500",
    text: "text-white",
    iconColor: "#ffffff",
  },
};

export default function Button({
  label,
  variant = "primary",
  icon: Icon = null,
  loading,
  isInactive,
  onPress,
  className,
  labelClassName,
  ...rest
}: ButtonProps) {
  const config = VARIANT_CONFIG[variant];
  const isDisabled = Boolean(loading || isInactive);

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      className={`p-2 rounded-lg justify-center items-center active:opacity-80 disabled:opacity-50 shadow-sm ${config.container} ${className ?? ""}`}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={config.iconColor} />
      ) : (
        <View className="flex-row items-center justify-center gap-1">
          {Icon ? (
            <Icon
              size={20}
              color={config.iconColor}
            />
          ) : null}
          <Text
            className={`text-[15px] font-medium ${config.text} ${labelClassName ?? ""}`}
          >
            {label}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

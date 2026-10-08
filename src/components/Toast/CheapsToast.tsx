import {
  AlertTriangle,
  CheckCircle2,
  Info,
  type LucideIcon,
  XCircle,
} from "lucide-react-native";
import { Text, View } from "react-native";
import ToastMessage, { type ToastConfig } from "react-native-toast-message";

export type ToastType = "success" | "error" | "info" | "warning";

interface ToastStyleConfig {
  Icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  borderLeft: string;
}

export const toastStyles: Record<ToastType, ToastStyleConfig> = {
  success: {
    Icon: CheckCircle2,
    iconColor: "#059669",
    iconBg: "bg-emerald-50",
    borderLeft: "border-l-emerald-500",
  },
  error: {
    Icon: XCircle,
    iconColor: "#ef4444",
    iconBg: "bg-red-50",
    borderLeft: "border-l-red-500",
  },
  info: {
    Icon: Info,
    iconColor: "#2563eb",
    iconBg: "bg-blue-50",
    borderLeft: "border-l-blue-500",
  },
  warning: {
    Icon: AlertTriangle,
    iconColor: "#f59e0b",
    iconBg: "bg-amber-50",
    borderLeft: "border-l-amber-500",
  },
};

export const typeStyles = toastStyles;

export interface CheapsToastProps {
  type: ToastType;
  text1?: string;
  text2?: string;
}

export function CheapsToast({
  type,
  text1: title,
  text2: message,
}: CheapsToastProps) {
  const { Icon, iconColor, iconBg, borderLeft } = toastStyles[type];

  return (
    <View
      className={`w-[92%] max-w-[400px] flex-row items-center bg-white rounded-xl p-3.5 border border-slate-200 border-l-4 ${borderLeft} shadow-lg shadow-black/10 android:elevation-md min-h-[60px]`}
    >
      <View
        className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${iconBg}`}
      >
        <Icon
          size={20}
          color={iconColor}
        />
      </View>

      <View className="flex-1 justify-center">
        {title && (
          <Text
            className="text-sm font-bold text-slate-900"
            numberOfLines={1}
          >
            {title}
          </Text>
        )}
        {message && (
          <Text
            className="text-xs text-slate-500 mt-0.5 leading-4"
            numberOfLines={2}
          >
            {message}
          </Text>
        )}
      </View>
    </View>
  );
}

export const toastConfig: ToastConfig = {
  success: ({ text1, text2 }) => (
    <CheapsToast
      type="success"
      text1={text1}
      text2={text2}
    />
  ),
  error: ({ text1, text2 }) => (
    <CheapsToast
      type="error"
      text1={text1}
      text2={text2}
    />
  ),
  info: ({ text1, text2 }) => (
    <CheapsToast
      type="info"
      text1={text1}
      text2={text2}
    />
  ),
  warning: ({ text1, text2 }) => (
    <CheapsToast
      type="warning"
      text1={text1}
      text2={text2}
    />
  ),
};

export { ToastMessage };

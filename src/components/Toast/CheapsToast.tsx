import ToastMessage, { type ToastConfig } from "react-native-toast-message";
import { styles } from "@/components/Toast/CheapToast.styles";
import { HStack, Text, VStack } from "../layout";

export type ToastType = "success" | "error" | "info" | "warning";

export const typeStyles: Record<ToastType, { icon: string; border: string }> = {
  success: {
    icon: "\u2713",
    border: "#9CE022",
  },
  error: {
    icon: "\u2717",
    border: "#E04848",
  },
  info: {
    icon: "\u2139",
    border: "#1CC8CC",
  },
  warning: {
    icon: "\u26A0",
    border: "#E08500",
  },
};

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
  const style = styles();
  const { icon, border } = typeStyles[type];

  return (
    <HStack align="center">
      <VStack>
        <Text style={[style.iconWrapper, { color: border }]}>{icon}</Text>
      </VStack>

      <VStack style={style.textContainer}>
        {title && <Text style={style.title}>{title}</Text>}
        {message && <Text style={style.message}>{message}</Text>}
      </VStack>
    </HStack>
  );
}

export const toastConfig: ToastConfig = {
  success: ({ text1, text2 }) => (
    <CheapsToast type="success" text1={text1} text2={text2} />
  ),
  error: ({ text1, text2 }) => (
    <CheapsToast type="error" text1={text1} text2={text2} />
  ),
  info: ({ text1, text2 }) => (
    <CheapsToast type="info" text1={text1} text2={text2} />
  ),
  warning: ({ text1, text2 }) => (
    <CheapsToast type="warning" text1={text1} text2={text2} />
  ),
};

export { ToastMessage };

import { View as DefaultView, type ViewProps } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface MainProps extends ViewProps {
  className?: string;
}

export default function Main({ className, style, ...props }: MainProps) {
  const insets = useSafeAreaInsets();

  return (
    <DefaultView
      className={`flex-1 bg-white ${className ?? ""}`}
      style={[{ paddingTop: insets.top }, style]}
      {...props}
    />
  );
}

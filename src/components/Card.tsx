import { View, type ViewProps } from "react-native";

interface CardProps extends ViewProps {
  className?: string;
}

export default function Card({ style, className, ...props }: CardProps) {
  return (
    <View
      className={`p-4 shadow-sm rounded-md ${className ?? ""}`}
      style={style}
      {...props}
    />
  );
}

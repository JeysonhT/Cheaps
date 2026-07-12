import { View, type ViewProps } from "react-native";
import { type SpacingKey, spacing as tokens } from "@/constants/tokens";

interface StackProps extends ViewProps {
  gap?: SpacingKey;
  p?: SpacingKey;
  flex?: number;
  align?: "center" | "flex-start" | "flex-end" | "stretch";
  justify?: "center" | "space-between" | "flex-start" | "flex-end";
}

export const VStack = ({
  gap,
  p,
  flex,
  align,
  justify,
  style,
  ...props
}: StackProps) => {
  return (
    <View
      style={[
        {
          flexDirection: "column",
          gap: gap ? tokens[gap] : undefined,
          padding: p ? tokens[p] : undefined,
          flex,
          alignItems: align,
          justifyContent: justify,
        },
        style,
      ]}
      {...props}
    />
  );
};

export const HStack = ({
  gap,
  p,
  flex,
  align,
  justify,
  style,
  ...props
}: StackProps) => {
  return (
    <View
      style={[
        {
          flexDirection: "row",
          gap: gap ? tokens[gap] : undefined,
          padding: p ? tokens[p] : undefined,
          flex,
          alignItems: align,
          justifyContent: justify,
        },
        style,
      ]}
      {...props}
    />
  );
};

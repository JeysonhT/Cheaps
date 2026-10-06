import { View, type ViewProps, type ViewStyle } from "react-native";
import { type SpacingKey, spacing as tokens } from "@/constants/tokens";

interface StackProps extends ViewProps {
  gap?: SpacingKey;
  p?: SpacingKey;
  flex?: number;
  align?: "center" | "flex-start" | "flex-end" | "stretch";
  justify?: "center" | "space-between" | "flex-start" | "flex-end";
  className?: string;
}

export const VStack = ({
  gap,
  p,
  flex,
  align,
  justify,
  style,
  className,
  ...props
}: StackProps) => {
  const dynamicStyle: ViewStyle = {
    flexDirection: "column",
  };
  if (gap !== undefined) dynamicStyle.gap = tokens[gap];
  if (p !== undefined) dynamicStyle.padding = tokens[p];
  if (flex !== undefined) dynamicStyle.flex = flex;
  if (align !== undefined) dynamicStyle.alignItems = align;
  if (justify !== undefined) dynamicStyle.justifyContent = justify;

  return (
    <View
      className={className}
      style={[dynamicStyle, style]}
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
  className,
  ...props
}: StackProps) => {
  const dynamicStyle: ViewStyle = {
    flexDirection: "row",
  };
  if (gap !== undefined) dynamicStyle.gap = tokens[gap];
  if (p !== undefined) dynamicStyle.padding = tokens[p];
  if (flex !== undefined) dynamicStyle.flex = flex;
  if (align !== undefined) dynamicStyle.alignItems = align;
  if (justify !== undefined) dynamicStyle.justifyContent = justify;

  return (
    <View
      className={className}
      style={[dynamicStyle, style]}
      {...props}
    />
  );
};

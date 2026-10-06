import {
  Text as RNText,
  type TextProps as RNTextProps,
  type TextStyle,
} from "react-native";
import {
  type FontSizeKey,
  type FontWeightKey,
  type LineHeightKey,
  lineHeight as lineHeightTokens,
  type SpacingKey,
  spacing as spacingTokens,
  type ThemeColorKey,
} from "@/constants/tokens";
import { useTheme } from "@/hooks/useTheme";

export const Variants = {
  normal: "Inter",
  highlight: "Outfit",
} as const;

export type TextVariants = keyof typeof Variants;

export interface TextProps extends RNTextProps {
  /** Size token from fontSize scale (xs, sm, base, md, lg, xl, 2xl, 3xl, 4xl) */
  size?: FontSizeKey;
  /** Weight token from fontWeight scale (regular, medium, semibold, bold) */
  weight?: FontWeightKey;
  /** Line height token multiplier (tight, normal, loose) */
  lineHeight?: LineHeightKey;
  /** Color key from the active theme */
  color?: ThemeColorKey;
  /** Text alignment */
  align?: TextStyle["textAlign"];

  variant?: TextVariants;

  // Padding tokens
  p?: SpacingKey;
  pt?: SpacingKey;
  pb?: SpacingKey;
  pl?: SpacingKey;
  pr?: SpacingKey;
  px?: SpacingKey;
  py?: SpacingKey;

  // Margin tokens
  m?: SpacingKey;
  mt?: SpacingKey;
  mb?: SpacingKey;
  ml?: SpacingKey;
  mr?: SpacingKey;
  mx?: SpacingKey;
  my?: SpacingKey;

  // Layout props
  flex?: number;
}

export const Text = ({
  size = "base",
  weight = "regular",
  lineHeight: lh,
  color = "text",
  align,
  variant = "normal",

  p,
  pt,
  pb,
  pl,
  pr,
  px,
  py,

  m,
  mt,
  mb,
  ml,
  mr,
  mx,
  my,

  flex,
  style,
  className,
  ...props
}: TextProps & { className?: string }) => {
  const { t, fs, fw } = useTheme();

  // Resolve fontSize from tokens
  const fsValue = fs[size];

  // Resolve lineHeight (computed dynamically based on fontSize * multiplier)
  const lhValue = lh ? Math.round(fsValue * lineHeightTokens[lh]) : undefined;

  const dynamicStyle: TextStyle = {
    fontFamily: Variants[variant],
    fontSize: fsValue,
    fontWeight: fw[weight],
    color: t[color],
  };

  if (lhValue !== undefined) dynamicStyle.lineHeight = lhValue;
  if (align !== undefined) dynamicStyle.textAlign = align;
  if (flex !== undefined) dynamicStyle.flex = flex;

  if (p !== undefined) dynamicStyle.padding = spacingTokens[p];
  if (pt !== undefined) dynamicStyle.paddingTop = spacingTokens[pt];
  if (pb !== undefined) dynamicStyle.paddingBottom = spacingTokens[pb];
  if (pl !== undefined) dynamicStyle.paddingLeft = spacingTokens[pl];
  if (pr !== undefined) dynamicStyle.paddingRight = spacingTokens[pr];
  if (px !== undefined) dynamicStyle.paddingHorizontal = spacingTokens[px];
  if (py !== undefined) dynamicStyle.paddingVertical = spacingTokens[py];

  if (m !== undefined) dynamicStyle.margin = spacingTokens[m];
  if (mt !== undefined) dynamicStyle.marginTop = spacingTokens[mt];
  if (mb !== undefined) dynamicStyle.marginBottom = spacingTokens[mb];
  if (ml !== undefined) dynamicStyle.marginLeft = spacingTokens[ml];
  if (mr !== undefined) dynamicStyle.marginRight = spacingTokens[mr];
  if (mx !== undefined) dynamicStyle.marginHorizontal = spacingTokens[mx];
  if (my !== undefined) dynamicStyle.marginVertical = spacingTokens[my];

  return (
    <RNText
      className={className}
      style={[dynamicStyle, style]}
      {...props}
    />
  );
};

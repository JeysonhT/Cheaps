import {
  FontSizeKey,
  FontWeightKey,
  LineHeightKey,
  lineHeight as lineHeightTokens,
  SpacingKey,
  spacing as spacingTokens,
  ThemeColorKey,
} from "@/constants/tokens";
import { useTheme } from "@/hooks/useTheme";
import {
  Text as RNText,
  TextProps as RNTextProps,
  TextStyle,
} from "react-native";

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
  ...props
}: TextProps) => {
  const { t, fs, fw } = useTheme();

  // Resolve fontSize from tokens
  const fsValue = fs[size];

  // Resolve lineHeight (computed dynamically based on fontSize * multiplier)
  const lhValue = lh ? Math.round(fsValue * lineHeightTokens[lh]) : undefined;

  return (
    <RNText
      style={[
        {
          fontFamily: Variants[variant],
          fontSize: fsValue,
          fontWeight: fw[weight],
          color: t[color],
          lineHeight: lhValue,
          textAlign: align,
          flex,

          // Paddings
          padding: p ? spacingTokens[p] : undefined,
          paddingTop: pt ? spacingTokens[pt] : undefined,
          paddingBottom: pb ? spacingTokens[pb] : undefined,
          paddingLeft: pl ? spacingTokens[pl] : undefined,
          paddingRight: pr ? spacingTokens[pr] : undefined,
          paddingHorizontal: px ? spacingTokens[px] : undefined,
          paddingVertical: py ? spacingTokens[py] : undefined,

          // Margins
          margin: m ? spacingTokens[m] : undefined,
          marginTop: mt ? spacingTokens[mt] : undefined,
          marginBottom: mb ? spacingTokens[mb] : undefined,
          marginLeft: ml ? spacingTokens[ml] : undefined,
          marginRight: mr ? spacingTokens[mr] : undefined,
          marginHorizontal: mx ? spacingTokens[mx] : undefined,
          marginVertical: my ? spacingTokens[my] : undefined,
        },
        style,
      ]}
      {...props}
    />
  );
};

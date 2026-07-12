/**
 * Design Tokens — fuente única de verdad para todos los estilos.
 * Cambia aquí y se propaga a toda la app automáticamente.
 */

// ─── Paleta base (no usar directo en componentes) ────────────────────────────
const palette = {
  // Primario — Verde oscuro
  primary50: "#ecfdf5",
  primary100: "#d1fae5",
  primary200: "#a7f3d0",
  primary300: "#6ee7b7",
  primary400: "#34d399",
  primary500: "#064E3B", // ← base primario
  primary600: "#053d2e",
  primary700: "#042d22",

  // Secundario — Azul
  secondary50: "#eff6ff",
  secondary100: "#dbeafe",
  secondary300: "#93c5fd",
  secondary400: "#60a5fa",
  secondary500: "#2563EB", // ← base secundario
  secondary600: "#1d4ed8",
  secondary700: "#1e40af",

  // Terciario — Esmeralda
  tertiary50: "#ecfdf5",
  tertiary100: "#d1fae5",
  tertiary300: "#6ee7b7",
  tertiary400: "#34d399",
  tertiary500: "#059669", // ← base terciario
  tertiary600: "#047857",
  tertiary700: "#065f46",

  // Neutral — Slate
  neutral50: "#f8fafc",
  neutral100: "#f1f5f9",
  neutral200: "#e2e8f0",
  neutral300: "#cbd5e1",
  neutral400: "#94a3b8",
  neutral500: "#64748B", // ← base neutral
  neutral600: "#475569",
  neutral700: "#334155",
  neutral800: "#1e293b",
  neutral900: "#0f172a",
  neutral950: "#020617",

  // Semánticos
  white: "#ffffff",
  black: "#000000",
  error: "#ef4444",
  success: "#22c55e",
  warning: "#f59e0b",
} as const;

// ─── Temas (light / dark) ─────────────────────────────────────────────────────
export const themes = {
  light: {
    // Fondos
    bg: palette.white,
    bgSubtle: palette.neutral50,
    bgMuted: palette.neutral200,
    bgElevated: palette.white,

    // Texto
    text: palette.neutral900,
    textMuted: palette.neutral400,
    textInverse: palette.white,

    // Bordes
    border: palette.neutral200,
    borderStrong: palette.neutral300,

    // Primario
    primary: palette.primary500,
    primaryHover: palette.primary600,
    primaryText: palette.white,

    // Secundario
    secondary: palette.secondary500,
    secondaryHover: palette.secondary600,
    secondaryText: palette.white,

    // Terciario
    tertiary: palette.tertiary500,
    tertiaryHover: palette.tertiary600,
    tertiaryText: palette.white,

    // Feedback
    error: palette.error,
    success: palette.success,
    warning: palette.warning,

    // botones
    buttonPrimary: palette.primary700,
    buttonSecondary: palette.secondary300,
    buttonInverted: palette.neutral700,
    buttonOutlined: palette.neutral200,

    // Tabs
    tabIconDefault: palette.neutral400,
    tabIconSelected: palette.primary500,
  },
  dark: {
    // Fondos
    bg: palette.neutral950,
    bgSubtle: palette.neutral900,
    bgMuted: palette.neutral800,
    bgElevated: palette.neutral800,

    // Texto
    text: palette.neutral50,
    textMuted: palette.neutral400,
    textInverse: palette.neutral900,

    // Bordes
    border: palette.neutral700,
    borderStrong: palette.neutral600,

    // Primario
    primary: palette.primary300,
    primaryHover: palette.primary400,
    primaryText: palette.neutral900,

    // Secundario
    secondary: palette.secondary400,
    secondaryHover: palette.secondary300,
    secondaryText: palette.neutral900,

    // Terciario
    tertiary: palette.tertiary400,
    tertiaryHover: palette.tertiary300,
    tertiaryText: palette.neutral900,

    // Feedback
    error: palette.error,
    success: palette.success,
    warning: palette.warning,

    // Tabs
    tabIconDefault: palette.neutral600,
    tabIconSelected: palette.primary300,
  },
} as const;

export type Theme = typeof themes.light;
export type ThemeColorKey = keyof Theme;

// ─── Espaciado (escala de 4pt) ────────────────────────────────────────────────
export const spacing = {
  "0": 0,
  "1": 4,
  "2": 8,
  "3": 12,
  "4": 16,
  "5": 20,
  "6": 24,
  "8": 32,
  "10": 40,
  "12": 48,
  "16": 64,
} as const;

export type SpacingKey = keyof typeof spacing;

// ─── Tipografía ───────────────────────────────────────────────────────────────
export const fontSize = {
  xs: 11,
  sm: 13,
  base: 15,
  md: 17,
  lg: 20,
  xl: 24,
  "2xl": 28,
  "3xl": 34,
  "4xl": 40,
} as const;

export type FontSizeKey = keyof typeof fontSize;

export const fontWeight = {
  regular: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
} as const;

export type FontWeightKey = keyof typeof fontWeight;

export const lineHeight = {
  tight: 1.2,
  normal: 1.5,
  loose: 1.8,
} as const;

export type LineHeightKey = keyof typeof lineHeight;

// ─── Bordes ───────────────────────────────────────────────────────────────────
export const radius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  "2xl": 24,
  full: 9999,
} as const;

// ─── Sombras ──────────────────────────────────────────────────────────────────
export const shadows = {
  sm: {
    shadowColor: palette.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: palette.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: palette.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
} as const;

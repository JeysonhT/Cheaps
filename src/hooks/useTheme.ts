import {
  fontSize,
  fontWeight,
  radius,
  shadows,
  spacing,
  type Theme,
  themes,
} from "@/constants/tokens";

// hook para obtener el tema y medidas necesarias
export function useTheme() {
  // no hay tema oscuro por el momento
  // const scheme = useColorScheme() ?? "light";

  const scheme = "light";
  const t: Theme = themes[scheme];

  return {
    /** Tokens de color del tema actual (light/dark automático) */
    t,
    /** Espaciado en puntos. sp[4] = 16pt */
    sp: spacing,
    /** Tamaños de fuente. fs.lg = 20 */
    fs: fontSize,
    /** Pesos de fuente */
    fw: fontWeight,
    /** Radios de borde. r.md = 8 */
    r: radius,
    /** Sombras listas para usar */
    sh: shadows,
    /** El esquema activo: 'light' | 'dark' */
    scheme,
  };
}

export function makeStyles<T extends Record<string, object>>(
  factory: (
    t: Theme,
    sp: typeof spacing,
    fs: typeof fontSize,
    fw: typeof fontWeight,
    r: typeof radius,
  ) => T,
) {
  return function useStyles() {
    const { t, sp, fs, fw, r } = useTheme();
    return factory(t, sp, fs, fw, r);
  };
}

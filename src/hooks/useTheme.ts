import {
  fontSize,
  fontWeight,
  radius,
  shadows,
  spacing,
  themes,
  type Theme,
} from "@/constants/tokens";

/**
 * Hook principal de theming.
 *
 * Uso:
 *   const { t, sp, fs, r } = useTheme();
 *   <View style={{ backgroundColor: t.bg, padding: sp[4] }} />
 */
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

// ─── Helper: StyleSheet con tokens ───────────────────────────────────────────
/**
 * Crea un StyleSheet tipado a partir de los tokens actuales.
 * Úsalo cuando quieras estilos estáticos fuera de un componente.
 *
 * Ejemplo:
 *   const useStyles = makeStyles((t, sp) => ({
 *     card: { backgroundColor: t.bgElevated, padding: sp[4] }
 *   }));
 *
 *   function MyComponent() {
 *     const styles = useStyles();
 *   }
 */
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

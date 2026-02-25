// Design tokens live here; components/styles must import from this module.
// Updated to match warm orange/cream/plum design system

export const colors = {
  background: "#fcfcfc", // very light warm grey (page background)
  backgroundAlt: "#FFF6F1", // alternate soft peach background (alias for cardSoft)
  surface: "#FFFFFF", // white cards & header
  cardSoft: "#FFF6F1", // soft peach card background
  primary: "#FF7A2D", // warm orange (icons, CTA)
  accent: "#FF9C62", // lighter orange accent
  accentAlt: "#FFD4B3", // lighter orange tint
  lilac: "#E6D5FF", // soft lilac for variety
  plum: "#3B1F2E", // deep plum for headings & important text
  muted: "#A8A4A4", // muted grey text
  textPrimary: "#3B1F2E", // same as plum for consistency
  textSecondary: "#A8A4A4", // same as muted
  white: "#FFFFFF",
  black: "#000000",
  success: "#2E9B67", // green card
  danger: "#E85B3A", // red-ish
  shadow: "rgba(45, 30, 30, 0.06)", // subtle shadow
};

export const spacing = {
  xs: 6,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const radii = {
  sm: 8,
  md: 14,
  lg: 18,
  pill: 9999,
};

export const sizes = {
  avatar: 48,
  headerHeight: 100,
};

export const typography = {
  fontFamilyPrimary: "PoppinsRegular",
  fontFamilyDisplay: "PoppinsSemiBold",
  sizes: {
    h1: 28,
    h2: 22,
    h3: 18,
    body: 16,
    small: 12,
  },
  weights: {
    regular: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
  },
};

export const elevation = {
  low: {
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  mid: {
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 6,
  },
};

export const touch = {
  minSize: 44,
};

export const theme = {
  colors,
  spacing,
  radii,
  sizes,
  typography,
  elevation,
  touch,
};

export type Theme = typeof theme;

export default theme;

// Design tokens live here; components/styles must import from this module.

export const colors = {
  background: "#F5F0E8", // warm cream page background
  backgroundAlt: "#EDE8DF", // slightly darker cream for alt areas
  surface: "#FFFFFF", // white cards
  cardSoft: "#EFF9F7", // soft mint tint for highlighted cards
  primary: "#4ECDC4", // teal/mint main CTA color
  accent: "#81E6D9", // lighter teal accent
  accentAlt: "#B2F0EB", // very light teal tint
  lilac: "#E6D5FF", // keep as-is
  plum: "#1A3C34", // deep green-plum for headings
  muted: "#8A9E9B", // muted teal-grey text
  textPrimary: "#1A3C34", // same as plum
  textSecondary: "#8A9E9B", // same as muted
  white: "#FFFFFF",
  black: "#000000",
  success: "#4ECDC4", // use teal for success
  danger: "#FF6B6B", // soft red
  shadow: "rgba(26, 60, 52, 0.08)",
  quoteCard: "#EFF9F7", // soft mint for quote card
  checkinCard: "#4ECDC4", // teal for the quick check-in card
  moodHappy: "#FFF3E0",
  moodGood: "#E8F5E9",
  moodOkay: "#FFF9C4",
  moodSad: "#FCE4EC",
  emergencySoft: "#FFF5F5",
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

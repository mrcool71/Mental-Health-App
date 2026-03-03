export const NAV_STACK_INITIAL_ROUTE = "Tabs" as const;

export const NAV_STACK_SCREEN_OPTIONS = {
  headerShown: false,
  animation: "slide_from_right",
} as const;

export const TAB_ICONS: Record<string, string> = {
  Home: "home",
  Wellbeing: "favorite",
  History: "history",
  Resources: "menu-book",
  Profile: "person",
};

export const BOTTOM_TAB_BAR_APPROX_HEIGHT = 72;

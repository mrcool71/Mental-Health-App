export type TabBarItemProps = {
  routeName: string;
  label: string;
  focused: boolean;
  iconName: string;
  showBadge: boolean;
  accessibilityLabel?: string;
  testID?: string;
  onPress: () => void;
  onLongPress: () => void;
};

/**
 * Returns a time-of-day greeting keyword based on the current hour.
 */
export const getGreetingByHour = (): string => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour <= 11) return "morning";
  if (hour >= 12 && hour <= 17) return "afternoon";
  return "evening";
};

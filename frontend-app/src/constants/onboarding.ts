import type { OnboardingSlide } from "../types/screens";

export const ONBOARDING_SLIDES: OnboardingSlide[] = [
  {
    id: "welcome",
    icon: "\uD83D\uDE3A",
    title: "Welcome",
    body: "Meet your mental wellbeing companion. Track daily patterns and stay supported.",
  },
  {
    id: "checkins",
    icon: "\uD83D\uDCDD",
    title: "PHQ-9 Check-Ins",
    body: "Take a short PHQ-9 check-in to monitor recent mood patterns over time.",
  },
  {
    id: "privacy",
    icon: "\uD83D\uDD12",
    title: "Your Privacy Matters",
    body: "Your data is stored securely and privately. You can delete your data anytime from settings.",
  },
];

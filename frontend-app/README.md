# Mental App (Expo + TypeScript)

Cat-themed wellbeing starter built with Expo. Tokens and styles live centrally; screens and components stay thin and accessible.

## Run it

1. Install deps: `npm install`
2. Start Expo: `npm run start`
3. Open on device/emulator; fonts load from local assets in App.tsx.

## Where things live

- Tokens: [src/theme/theme.ts](src/theme/theme.ts)
- Shared styles: [src/styles](src/styles) (no inline styles; always pull tokens)
- Types: [src/types](src/types) (`ui.ts`, `navigation.ts`, `models.ts`)
- Components: [src/components](src/components) (ThemedButton, MoodBadge, ProgressRing, etc.)
- Screens: [src/screens](src/screens) (Home, QuickCheck, History, Wellbeing, Profile)
- Store: [src/store/index.tsx](src/store/index.tsx) (context + reducer for mood history)
- Navigation: [src/navigation/index.tsx](src/navigation/index.tsx) (stack via React Navigation)

## Notes

- Fonts must finish loading before rendering; see App.tsx.
- All styles reference tokens from `src/theme/theme.ts` via files in `src/styles/`.
- Quick demo flow: Home → Quick Check → mood saved → History/Wellbeing updated in-memory.

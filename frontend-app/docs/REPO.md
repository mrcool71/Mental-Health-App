# Repository Guide: mental-app-sop / frontend-app

This document provides a detailed overview of the Expo + React Native TypeScript app in this repo. It covers architecture, data flow, key modules, and how to extend the project safely.

## Overview

- Product: Cat-themed wellbeing demo app.
- Platform: Expo (React Native) with TypeScript.
- Architecture: Simple stack navigation + local context store.
- Design system: Centralized tokens and styles; no inline styles in components/screens.

## How to Run

1. Install dependencies: npm install
2. Start the app: npm run start
3. Optional targets: npm run android, npm run ios, npm run web

Fonts are loaded at app start from local assets; the app waits until fonts are ready before rendering the main UI.

## Top-Level Entry

- App.tsx: Initializes fonts, wraps the app in the store provider, mounts navigation, and sets the status bar.
- index.ts: Expo root registration.

## App Structure

frontend-app/
App.tsx
index.ts
src/
components/
constants/
navigation/
screens/
store/
styles/
theme/
types/

## Navigation

- Navigation is powered by React Navigation native stack.
- Routes: Home, QuickCheck, History, Wellbeing, Profile.
- Stack options and initial route are centralized in constants/navigation.

## State Management

- Store is a simple React context + reducer.
- State shape:
  - history: array of mood entries
  - score: computed aggregate score
- Actions:
  - ADD_ENTRY: adds a mood entry, recalculates score
  - RESET: resets to initial state
- Scoring:
  - Score is the rounded average of mood scores from constants/store.

## Types

- types/models.ts:
  - Mood: union of allowed mood values
  - MoodEntry: id + timestamp + mood
  - AppState and AppAction for store reducer
- types/navigation.ts:
  - RootStackParamList for typed navigation
- types/ui.ts:
  - Props for all shared UI components

## Theme and Styling

- theme/theme.ts exports design tokens: colors, spacing, radii, typography, touch.
- styles/\* consumes tokens and provides reusable style sheets.
- Components and screens import styles and tokens rather than inline values.

## Constants

The constants folder centralizes repeated values and lists:

- constants/store.ts: initial store state and mood score map.
- constants/moods.ts: mood options and emojis used by the UI.
- constants/metrics.ts: wellbeing max score.
- constants/navigation.ts: navigation options and initial route.
- constants/button.ts: shared map between variants and styles.
- constants/quickCheck.ts: timeout used after mood selection.
- constants/screens.ts: screen title strings.

## Components

- AvatarWithMascot: renders the cat avatar and profile summary.
- MoodBadge: shows mood label and emoji; mood -> emoji mapping is centralized.
- NotificationBanner: success/info/error banner.
- ProgressRing: SVG ring with percent/label, uses theme colors.
- ThemedButton: button with variants and loading state.
- ThemedTextInput/ThemedTextField: styled input and labeled field wrapper.

All components are accessible-friendly with labels and roles where appropriate.

## Screens

- Home: summary view with quick actions, current mood, and wellbeing score.
- QuickCheck: mood selection grid, saves to store, navigates to history.
- History: sectioned list by date; shows empty state copy when no entries.
- Wellbeing: detailed score and recent mood summary.
- Profile: basic profile stub with input and placeholder actions.

## Data Flow

1. User selects a mood in QuickCheck.
2. Screen constructs a MoodEntry and dispatches ADD_ENTRY.
3. Store updates history and recomputes score.
4. Home, History, and Wellbeing read from store to update UI.

## Dependencies

Key runtime dependencies:

- expo
- react, react-native
- @react-navigation/native, @react-navigation/native-stack
- react-native-svg
- expo-font (loads local Poppins files from assets)

Development:

- typescript
- @types/react

## Extending the App

- Add new screens: define in navigation types and register in navigation stack.
- Add new mood types: update types/models.ts and constants/moods.ts, and adjust score mapping in constants/store.ts.
- Update theme: change tokens in theme/theme.ts and adjust styles in styles/.
- Add persistent storage: wrap store reducer with async storage synchronization.

## Conventions

- Keep styles in styles/ and avoid inline values.
- Store all repeated lists or literals in constants/.
- Keep screens thin; move reusable UI to components/.
- Use typed navigation props via types/navigation.ts.

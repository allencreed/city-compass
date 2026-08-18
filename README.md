# City Compass

**Software By Sheldon A Rollins 2026**

City Compass is an Expo (React Native) app that turns exploring a city into a game — check in at businesses, collect stamps in your city passport, climb the leaderboard, and get proximity alerts as you walk past participating venues.

## Features

- **Explore map** — live map with venue pins powered by `react-native-maps` and `expo-location`
- **QR check-ins** — scan a venue's QR code with the camera (`expo-camera`) or show your own code for staff to verify (`react-native-qrcode-svg`)
- **City passport** — collect stamps and progress rings as you visit each business
- **Business hub** — venue detail screens, join flow for business owners, and city-level hub
- **Leaderboard** — compete with other explorers
- **Proximity alerts** — push-style banners when you're near a participating venue
- **Onboarding** — guided first-run experience (`CityOnboardingScreen`)
- **Design system** — Plus Jakarta Sans / Work Sans fonts, custom theme, Lottie animations, and a React Three Fiber welcome scene

## Screens & structure

```
src/
  components/    MapPin, ProgressRing, ProximityBanner, ThemedInput, ScannerModal, ...
  context/       CheckInsContext, LocationContext, SessionContext
  data/          locations seed data
  hooks/         useLocations, useProximityAlerts, useUserLocation, ...
  navigation/    RootNavigator + types
  screens/       CityOnboarding, CityHub, BusinessDetail, BusinessJoin, Leaderboard, ...
  theme/         colors, typography
```

UI design mockups live in `stitch_city_explorer_passport/`, and standalone QR demo pages (`scan-qr.html`, `venue-qr.html`) show the QR flows in a browser.

## Running locally

Requires Node and the Expo CLI:

```bash
npm install
npx expo start
```

Then scan the QR code with the Expo Go app, or press `a` for Android / `i` for iOS simulator.

## Tech stack

Expo SDK 54 · React Native 0.81 · React 19 · React Navigation 7 · react-native-maps · expo-camera · expo-location · Lottie · React Three Fiber

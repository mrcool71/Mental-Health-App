<div align="center">
  <img src="frontend-app/assets/icon.png" width="120" height="120" alt="Mental Wellbeing Logo">

  # Mental Wellbeing Tracker
  *A privacy-first, sensor-aware smartphone application for clinical mental health & mood tracking.*

  [![React Native](https://img.shields.io/badge/React_Native-20232A?style=flat&logo=react&logoColor=61DAFB)](#)
  [![Expo](https://img.shields.io/badge/Expo-000020?style=flat&logo=expo&logoColor=white)](#)
  [![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=flat&logo=firebase&logoColor=white)](#)
</div>

---

## 🌟 Overview
**Mental Wellbeing Tracker** bridges the gap between passive telemetry monitoring and active psychological journaling. It relies on comprehensive hardware sensor tracking (Accelerometer, Microphones, GPS) executing securely in the background, to correlate environmental context directly against your daily mood reports and deep clinical assessments like the **PHQ-9**. 

Our primary focus is **Privacy and Cloud Resiliency**. The app strictly guards background memory telemetry ensuring no sync operations overwrite pending local caches, while Firebase powers instantaneous, real-time snapshot back-ups across devices. 

---

## ✨ Key Features
- 📊 **Clinical Check-ins:** Full support for standard PHQ-9 (Patient Health Questionnaire) scoring alongside arbitrary active journaling capabilities.
- 🔋 **Robust Background Tracking:** Uses `expo-task-manager` and `expo-location` to safely record user environmental telemetry (motion magnitude, dB noise levels, coordinates) even while the app is entirely killed.
- ⚡ **Asynchronous Cloud Bridging:** Our custom Firestore architecture pools and aggregates high-frequency reading snapshots (like 250ms accelerometer polls) offline into dynamically synchronized 5-minute data buckets. 
- 📤 **Data Portability:** End-users own their data. Built-in single-click exports compile all arrays, sensors, and mood states straight into dense CSVs.
- 💧 **Stunning Fluid Interface:** Built beautifully using modern, responsive styling handling strict React Navigation tab routes and safe-area overlap heuristics.

---

## 🚀 For End-Users: Installing the App

Don't want to mess with the code? Just want the app locally?
1. Go to the **[Releases Top Tab](../../releases/)** on GitHub.
2. Find the newest `v1.x.x` release and expand the *Assets* section at the very bottom.
3. Download the `Mental-Wellbeing.apk` directly onto your Android device!
4. Install, bypass "Unknown Sources" if prompted, create an account, and start tracking your wellbeing!

> [NOTE]
> This is an early release. There may be bugs or unexpected behaviour. If you encounter any issues, please report them via the Issues tab.

---

## 💻 For Developers: Running Locally 

When cloning this architecture, notice that the repository strictly ignores `.env` files and `google-services.json` inside its `.gitignore` to prevent any centralized backend leaks. You will mock your own infrastructure to play with this code.

### 1. Requirements
- Node.js (`v18+` recommended)
- `npm` or `yarn`
- Android Studio / ADB (for Android emulators)
- An active, free **Firebase Project**

### 2. Configure Your Firebase Backend
Because our cloud sync utilizes deep Firebase integration, you need to spin up a sandbox.
1. Go to your [Firebase Console](https://console.firebase.google.com/) and create a brilliant new free-tier project.
2. Ensure you enable **Firestore Database** and **Authentication** (Email/Password access) on your Firebase dashboard.
3. Add a new **Android App** within the Firebase UI. Set the package name to `com.ankyv.frontendapp` (or change it to match yours if cloning entirely).
4. Download the `google-services.json` file.
5. Drop your `google-services.json` cleanly into this repository at `/frontend-app/google-services.json`.

### 3. Build & Run
From the root of this repo:
```bash
# Navigate to the frontend UI hub
cd frontend-app/

# Install the heavy lifting
npm install

# Build to your emulator
npx expo prebuild --platform android --clean
npm run android
```

---

## 🛡️ Architecture & Security

We built complex mechanisms to ensure zero resource contention happens amongst our React logic pool and isolated headless threading models:
1. **The Telemetry Bridge:** Foreground services utilize standard React hooks. Background headless polling is ferried out to persistent `AsyncStorage` cache mechanisms ensuring no threading lock-outs.
2. **Synchronous Unspooling:** `cloudSync.ts` handles active data decoupling securely avoiding memory leaks associated with concurrent active network timeouts.

---
<div align="center">
  <sub>Made with ❤️ by <a href="https://github.com/frozenexplorer">frozenexplorer</a>, <a href="https://github.com/aniketsona23">aniketsona23</a>, and <a href="https://github.com/mrcool71">mrcool71</a></sub>
</div>

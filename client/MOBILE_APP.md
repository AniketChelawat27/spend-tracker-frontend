# Build Spend Tracker as Android APK

This project uses **Capacitor** to wrap the web app in a native Android WebView. Follow these steps to get an `.apk` file.

## 1. Prerequisites

- **Node.js** (already have it)
- **Java JDK 17** (required for Android build)
  - Install: `brew install openjdk@17` (Mac) or download from [Adoptium](https://adoptium.net/)
  - Or install **Android Studio** – it includes the JDK
- **Android SDK** (required for Gradle)
  - Easiest: install [Android Studio](https://developer.android.com/studio). It installs the SDK.
  - Then set (add to `~/.zshrc` or `~/.bash_profile`):
    ```bash
    export ANDROID_HOME=$HOME/Library/Android/sdk
    export PATH=$PATH:$ANDROID_HOME/platform-tools
    ```

## 2. Backend URL for the app

The mobile app cannot use the Vite dev proxy. It must call your **deployed backend** or a reachable URL.

Before building, create or edit `.env` in the **client** folder and set:

```bash
# Your backend API base URL (no trailing slash)
# Examples:
#   Deployed: https://your-backend.railway.app
#   Same machine (emulator): http://10.0.2.2:3001
#   Same machine (device on WiFi): http://YOUR_LOCAL_IP:3001
VITE_API_URL=https://your-backend-url.com
```

Then **rebuild** the web app so the URL is baked in:

```bash
cd client
npm run build
npx cap sync android
```

## 3. Build the APK

### Option A: Command line (after Java + Android SDK are installed)

From the **spend-tracker** root:

```bash
cd client
npm run build
npx cap sync android
cd android
./gradlew assembleDebug
```

The APK will be at:

**`client/android/app/build/outputs/apk/debug/app-debug.apk`**

Copy this file to your phone (e.g. AirDrop, email, USB) and install it. You may need to allow “Install from unknown sources” in Android settings.

### Option B: Using Android Studio (recommended if Gradle fails)

1. Open Android Studio.
2. **File → Open** → select the **`client/android`** folder.
3. Wait for Gradle sync to finish.
4. **Build → Build Bundle(s) / APK(s) → Build APK(s)**.
5. When done, click **Locate** in the notification to open the folder containing `app-debug.apk`.

You can also use **Run** (green play button) to run the app on an emulator or connected device.

## 4. One-line script (after prerequisites)

From the **spend-tracker** root:

```bash
cd client && npm run apk
```

This runs `build` → `cap sync android` → `./gradlew assembleDebug`. The APK path is the same as above.

## 5. Branch

The mobile app setup is on the **`mobile-app`** branch. The Android project is in **`client/android/`**. Add `client/android/` to `.gitignore` if you prefer not to commit it (Capacitor can regenerate it with `npx cap add android`).

## Summary

| Step | Command / action |
|------|------------------|
| Set backend URL | Add `VITE_API_URL=...` to `client/.env` |
| Build web app | `cd client && npm run build` |
| Sync to Android | `cd client && npx cap sync android` |
| Build APK | `cd client/android && ./gradlew assembleDebug` |
| Get APK | `client/android/app/build/outputs/apk/debug/app-debug.apk` |

Install **Java 17** and **Android SDK** (or Android Studio) if the Gradle build fails.

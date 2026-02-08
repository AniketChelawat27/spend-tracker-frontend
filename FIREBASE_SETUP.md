# Firebase setup for Spend Tracker

This app uses **Firebase Authentication** (email/password) and **Cloud Firestore** for data. Follow these steps to set up your own project.

## 1. Create a Firebase project

1. Go to [Firebase Console](https://console.firebase.google.com/) and create a new project (or use an existing one).
2. Enable **Authentication** and **Firestore Database** in the left menu.

## 2. Enable Email/Password sign-in

1. In Firebase Console, go to **Build → Authentication → Sign-in method**.
2. Click **Email/Password**, enable it, and save.

## 3. Create Firestore database

1. Go to **Build → Firestore Database**.
2. Click **Create database**, choose **Start in test mode** (we’ll use security rules next), pick a region, and create.
3. Go to the **Rules** tab and replace the rules with the contents of this repo’s **`firestore.rules`** file (or paste the rules from below).
4. Go to the **Indexes** tab. The app needs composite indexes on `userId`, `year`, and `month` for the collections `salaries`, `expenses`, `investments`, and `activities`. Either:
   - Deploy indexes: run `firebase deploy --only firestore:indexes` from the project root (after `firebase init`), or
   - Let Firestore suggest them: when you first load data, the Firebase console will show a link to create the missing index; click it to add it.

## 4. Get Web app config (frontend)

1. In Project overview (gear icon) → **Project settings**.
2. Under **Your apps**, add a **Web** app if you haven’t already.
3. Copy the `firebaseConfig` object (apiKey, authDomain, projectId, etc.).

## 5. Get Service Account key (backend)

1. In Project settings, open the **Service accounts** tab.
2. Click **Generate new private key** and download the JSON file.
3. Save it somewhere safe (e.g. project root as `serviceAccountKey.json`) and **do not commit it to git** (it’s in `.gitignore`).

## 6. Configure the app

**Backend (server)**  
Create a `.env` in the project root (see `.env.example`):

- Either set `GOOGLE_APPLICATION_CREDENTIALS` to the path of your service account JSON, e.g.  
  `GOOGLE_APPLICATION_CREDENTIALS=./serviceAccountKey.json`
- Or set `FIREBASE_SERVICE_ACCOUNT` to the **entire JSON string** (one line, no newlines).

**Frontend (client)**  
Create `client/.env` (see `client/.env.example`) and set:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

Use the values from the Web app config in step 4.

## 7. Deploy Firestore rules and indexes (optional)

If you use Firebase CLI:

```bash
npm install -g firebase-tools
firebase login
firebase init firestore  # choose your project, use firestore.rules and firestore.indexes.json)
firebase deploy --only firestore
```

## 8. Run the app

1. Install dependencies: `npm install` (root) and `cd client && npm install`.
2. Start: `./start.sh` or `npm run dev`.
3. Open the app, click **Sign up**, create an account with email and password, then use **Sign in** next time. All data is stored in Firestore per user.

## Firestore security rules (reference)

Use the contents of **`firestore.rules`** in the repo. They ensure each user can only read/write documents where `userId` equals their Firebase Auth UID.

## Data model (Firestore)

- **salaries** – fields: `userId`, `person`, `amount`, `date`, `month`, `year`
- **expenses** – fields: `userId`, `title`, `amount`, `category`, `paidBy`, `date`, `month`, `year`, `notes`
- **investments** – fields: `userId`, `type`, `amount`, `owner`, `date`, `month`, `year`, `returnPercent`, `notes`
- **activities** – fields: `userId`, `title`, `amount`, `type`, `person`, `date`, `month`, `year`, `notes`

All documents are scoped by `userId` (set by the backend from the verified Firebase ID token).

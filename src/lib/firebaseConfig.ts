// IMPORTANT: Replace ALL placeholder values below with your actual Firebase project configuration.
// You can find these details in your Firebase project settings.
// Go to Project Overview (gear icon) > Project settings > General tab > Your apps > SDK setup and configuration.
//
// CRITICAL: Ensure 'projectId' is correct, otherwise Firestore and other services will not work.

export const firebaseConfig = {
  apiKey: "AIzaSyAlLxjmilTGGq2Ni9Z_LvnaKuzToJqnlPk", // This was set based on your previous request
  authDomain: "FILL_IN_YOUR_AUTH_DOMAIN", // e.g., your-project-id.firebaseapp.com
  projectId: "FILL_IN_YOUR_PROJECT_ID", // e.g., your-project-id
  storageBucket: "FILL_IN_YOUR_STORAGE_BUCKET", // e.g., your-project-id.appspot.com
  messagingSenderId: "FILL_IN_YOUR_MESSAGING_SENDER_ID",
  appId: "FILL_IN_YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID" // Optional, e.g., G-XXXXXXXXXX
};

// After configuring this file:
// 1. Ensure you have enabled Email/Password sign-in in Firebase Authentication.
// 2. Set up Firestore Database in your Firebase project (select a region).
// 3. IMPORTANT: Configure your Firestore Security Rules in the Firebase console to allow read/write access for your app's users.
//    A common starting point for development (NOT for production) might be:
//    rules_version = '2';
//    service cloud.firestore {
//      match /databases/{database}/documents {
//        match /users/{userId}/{document=**} { // Allows access to user-specific data
//          allow read, write: if request.auth != null && request.auth.uid == userId;
//        }
//      }
//    }
// 4. For Google Maps, ensure you have NEXT_PUBLIC_GOOGLE_MAPS_API_KEY environment variable set.
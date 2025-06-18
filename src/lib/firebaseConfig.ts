// IMPORTANT: Replace ALL placeholder values below with your actual Firebase project configuration.
// You can find these details in your Firebase project settings.
// Go to Project Overview (gear icon) > Project settings > General tab > Your apps > SDK setup and configuration.
//
// CRITICAL: Ensure 'projectId' is correct, otherwise Firebase services will not work.
// CRITICAL: FILL IN ALL REMAINING PLACEHOLDERS BELOW.
// CRITICAL: The apiKey and projectId below were recently provided by you. Ensure all other values are correct for your Firebase project.

export const firebaseConfig = {
  apiKey: "AIzaSyAlLxjmilTGGq2Ni9Z_LvnaKuzToJqnlPk", // Updated
  authDomain: "FILL_IN_YOUR_AUTH_DOMAIN", // e.g., your-project-id.firebaseapp.com
  projectId: "my-storage-d2075", // From your input
  storageBucket: "FILL_IN_YOUR_STORAGE_BUCKET", // e.g., your-project-id.appspot.com
  messagingSenderId: "FILL_IN_YOUR_MESSAGING_SENDER_ID",
  appId: "FILL_IN_YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID" // Optional, e.g., G-XXXXXXXXXX
};

// After configuring this file with ALL YOUR ACTUAL Firebase project details:
// 1. Ensure you have enabled Email/Password sign-in in Firebase Authentication.
//    To do this, you might need to enable the "Identity Toolkit API" in your Google Cloud Console.
//    If you see an error like "auth/identity-toolkit-api-has-not-been-used-in-project-...",
//    visit https://console.developers.google.com/apis/api/identitytoolkit.googleapis.com/overview (select your project) and enable it.
//    For project number 547292653843 (associated with Firebase project 'my-storage-d2075'), YOU MUST ENABLE THE IDENTITY TOOLKIT API at:
//    https://console.developers.google.com/apis/api/identitytoolkit.googleapis.com/overview?project=547292653843
//    If you're unsure of your project number, it's often part of the error message or can be found in the Google Cloud Console.
// 2. Set up Firestore Database in your Firebase project (select a region if prompted).
// 3. IMPORTANT: Configure your Firestore Security Rules in the Firebase console.
//    The rules determine who can read/write data. If they are too restrictive,
//    you will get errors like "client is offline" or permission denied.
//    For development, a common starting point (NOT for production) might be:
//    rules_version = '2';
//    service cloud.firestore {
//      match /databases/{database}/documents {
//        // Allow authenticated users to read and write their own documents in the 'users' collection
//        match /users/{userId} {
//          allow read, write: if request.auth != null && request.auth.uid == userId;
//        }
//        // Allow authenticated users to read and write documents in their own 'chatSessions' subcollection
//        match /users/{userId}/chatSessions/{sessionId} {
//          allow read, write: if request.auth != null && request.auth.uid == userId;
//        }
//        // Add other rules as needed for your application
//      }
//    }
//    Publish these rules in the Firebase console (Firestore Database > Rules).
// 4. For Genkit AI features (like the AI Chatbot and Report Generation):
//    a. Ensure the GOOGLE_API_KEY in your .env file is correct and belongs to the Google Cloud project associated with your Firebase project.
//    b. CRITICAL: Enable the "Generative Language API" in your Google Cloud Console.
//       If you see an error like "Generative Language API has not been used in project ... or it is disabled",
//       visit the URL provided in the error message (usually like https://console.developers.google.com/apis/api/generativelanguage.googleapis.com/overview?project=YOUR_PROJECT_NUMBER)
//       and enable the API. This is required for Genkit to use Google's Gemini models.
//       FOR PROJECT NUMBER 97272005284 (associated with Firebase project 'my-storage-d2075'), YOU MUST ENABLE THIS API at:
//       https://console.developers.google.com/apis/api/generativelanguage.googleapis.com/overview?project=97272005284
// 5. For Google Maps, ensure you have NEXT_PUBLIC_GOOGLE_MAPS_API_KEY environment variable set if you re-introduce map components.

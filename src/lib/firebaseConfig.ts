
// IMPORTANT: Replace ALL placeholder values below with your actual Firebase project configuration.
// You can find these details in your Firebase project settings.
// Go to Project Overview (gear icon) > Project settings > General tab > Your apps > SDK setup and configuration.
//
// CRITICAL: Ensure 'projectId' is correct, otherwise Firebase services will not work.
// CRITICAL: FILL IN ALL REMAINING PLACEHOLDERS BELOW.
// CRITICAL: The apiKey and projectId below were recently provided by you. Ensure all other values are correct for your Firebase project.

export const firebaseConfig = {
  apiKey: "AIzaSyAlLxjmilTGGq2Ni9Z_LvnaKuzToJqnlPk", // From your input
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
//    FOR PROJECT NUMBER 547292653843 (associated with Firebase project 'my-storage-d2075'), YOU MUST ENABLE THE IDENTITY TOOLKIT API at:
//    https://console.developers.google.com/apis/api/identitytoolkit.googleapis.com/overview?project=547292653843
//    (Ensure you are logged in with the correct Google account and select your project).
//
// 2. Set up Firestore Database in your Firebase project (select a region if prompted).
//
// 3. IMPORTANT: Configure your Firestore Security Rules in the Firebase console.
//    The rules determine who can read/write data. Replace the default (often overly permissive) rules
//    with the contents of the `firestore.rules` file provided in the root of this project.
//    These rules ensure that users can only access their own data.
//    To deploy: Go to Firebase Console > Firestore Database > Rules tab > Paste content > Publish.
//
// 4. For Genkit AI features (like the AI Chatbot and Report Generation):
//    a. Ensure the GOOGLE_API_KEY in your .env file is correct and belongs to the Google Cloud project associated with your Firebase project.
//    b. CRITICAL: Enable the "Generative Language API" in your Google Cloud Console.
//       If you see an error like "Generative Language API has not been used in project ... or it is disabled",
//       FOR PROJECT NUMBER 97272005284 (associated with Firebase project 'my-storage-d2075'), YOU MUST ENABLE THIS API at:
//       https://console.developers.google.com/apis/api/generativelanguage.googleapis.com/overview?project=97272005284
//    c. If you see "API_KEY_SERVICE_BLOCKED" or "Requests to this API generativelanguage.googleapis.com method ... are blocked":
//       This means your API key is restricted. In Google Cloud Console (for project 97272005284):
//       - Go to "APIs & Services" > "Credentials".
//       - Click on your API key (e.g., `AIzaSyAlLxjmilTGGq2Ni9Z_LvnaKuzToJqnlPk`).
//       - Under "API restrictions", ensure "Generative Language API" is allowed, or select "Don't restrict key".
//       - Under "Application restrictions", ensure they are not blocking your server/development environment.
//       - Also, ensure your project has a valid billing account linked.
//
// 5. For Google Maps (if re-introduced), ensure you have a NEXT_PUBLIC_GOOGLE_MAPS_API_KEY environment variable set.

---

# TheraBot: Your AI Companion for Mental Wellness

---

TheraBot is a Next.js web application designed to be an AI-powered companion for mental wellness. It provides users with a safe space to chat with an AI therapist, review their conversation history, generate wellness reports, and manage their profile.

---

## Features

*   **AI Chatbot:** Engage in empathetic and supportive conversations with TheraBot, an AI designed to act like a psychotherapist.
*   **Chat History:** Review past conversations with TheraBot.
*   **Wellness Report Generation:** Get AI-generated summaries and insights from your chat history, including potential discussion points and motivational advice.
*   **User Authentication:** Secure sign-up and login functionality using Firebase Authentication.
*   **Profile Management:** Users can update their display name and age.
*   **Find Therapists:** Provides a quick link to search for psychotherapists on Google Maps.
*   **Mindful Growth Resources:** A curated list of articles and media for personal development.
*   **Responsive Design:** User interface designed to work across various screen sizes.
*   **Startup Animation:** An engaging animation when the app loads.

---

## Technology Stack

*   **Frontend:**
    *   [Next.js](https://nextjs.org/) (with App Router)
    *   [React](https://reactjs.org/)
    *   [TypeScript](https://www.typescriptlang.org/)
    *   [Tailwind CSS](https://tailwindcss.com/) for styling
    *   [ShadCN UI](https://ui.shadcn.com/) for pre-built UI components
    *   [Lucide React](https://lucide.dev/) for icons
*   **Backend & AI:**
    *   [Firebase](https://firebase.google.com/)
        *   Firebase Authentication (Email/Password)
        *   Cloud Firestore (Database)
    *   [Genkit (by Google)](https://firebase.google.com/docs/genkit): For integrating Generative AI models (e.g., Gemini for chat and report generation).
*   **Key Libraries:**
    *   `react-hook-form` for form handling
    *   `zod` for schema validation
    *   `date-fns` for date formatting

---

## Local Setup Instructions

Follow these steps to set up and run TheraBot locally after cloning the project from GitHub.

### 1. Prerequisites

*   [Node.js](https://nodejs.org/) (version 18.x or later recommended)
*   [npm](https://www.npmjs.com/) (usually comes with Node.js) or [yarn](https://yarnpkg.com/)
*   A Firebase project.
*   A Google Cloud project linked to your Firebase project (for Genkit/Gemini API).

### 2. Clone the Repository

```bash
git clone <repository-url>
cd <project-directory-name>
```

### 3. Install Dependencies

```bash
npm install
# or
# yarn install
```

### 4. Firebase Setup

   **a. Create a Firebase Project:**
      If you don't have one, create a new project at the [Firebase Console](https://console.firebase.google.com/).

   **b. Add a Web App to Your Firebase Project:**
      In your Firebase project, add a new Web App. You'll be provided with a `firebaseConfig` object.

   **c. Configure Firebase in the App:**
      1.  Navigate to `src/lib/`.
      2.  Rename `firebaseConfig.example.ts` to `firebaseConfig.ts`.
      3.  Open `src/lib/firebaseConfig.ts` and replace the placeholder values in the `firebaseConfig` object with your actual Firebase project configuration details.
          ```typescript
          // src/lib/firebaseConfig.ts
          export const firebaseConfig = {
            apiKey: "YOUR_API_KEY",
            authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
            projectId: "YOUR_PROJECT_ID",
            storageBucket: "YOUR_PROJECT_ID.appspot.com",
            messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
            appId: "YOUR_APP_ID",
            measurementId: "YOUR_MEASUREMENT_ID" // Optional
          };
          ```
          **CRITICAL:** Ensure `projectId` is correct. Fill in ALL placeholders.

   **d. Enable Firebase Services:**
      1.  **Authentication:** In the Firebase Console, go to "Authentication" (under Build) > "Sign-in method" tab. Enable "Email/Password" as a sign-in provider.
          *   You might need to enable the "Identity Toolkit API" in your Google Cloud Console for the project. If you encounter errors, the `firebaseConfig.ts` file has comments guiding you to the correct Google Cloud API page.
      2.  **Firestore Database:** In the Firebase Console, go to "Firestore Database" (under Build) > "Create database". Start in **production mode** (though test mode is fine for initial development if you understand the implications). Choose a region.

   **e. Set Up Firestore Security Rules:**
      1.  In the Firebase Console, go to "Firestore Database" > "Rules" tab.
      2.  Replace the default rules with the content from the `firestore.rules` file located in the root of this project. This ensures users can only access their own data.
      3.  Click "Publish".

### 5. Genkit (Google AI) Setup

   **a. Obtain a Google API Key:**
      1.  Go to the [Google Cloud Console](https://console.cloud.google.com/).
      2.  Ensure you have selected the Google Cloud project associated with your Firebase project.
      3.  Navigate to "APIs & Services" > "Credentials".
      4.  Create or use an existing API key. **Important:** Restrict this API key for security. It should only be allowed to access the "Generative Language API".

   **b. Create an Environment File:**
      Create a `.env` file in the root of your project and add your Google API Key:
      ```env
      # .env
      GOOGLE_API_KEY=your_google_api_key_here
      ```

   **c. Enable Generative Language API:**
      1.  In the Google Cloud Console, ensure the "Generative Language API" (sometimes referred to as Gemini API) is enabled for your project.
      2.  If you encounter "API_KEY_SERVICE_BLOCKED" or similar errors, check your API key restrictions in the Google Cloud Console and ensure your project has a valid billing account linked. The `firebaseConfig.ts` file contains more detailed troubleshooting steps for this.

### 6. Run the Development Servers

   TheraBot requires two development servers to run concurrently:
   *   The Next.js frontend server.
   *   The Genkit development server for AI flows.

   Open two terminal windows/tabs in your project directory.

   **Terminal 1: Start the Next.js App**
   ```bash
   npm run dev
   ```
   This will typically start the Next.js app on `http://localhost:9002`.

   **Terminal 2: Start the Genkit Development Server**
   ```bash
   npm run genkit:dev
   ```
   This starts the Genkit server, usually on `http://localhost:3400` for the Genkit Developer UI, and makes the AI flows available to the Next.js app. For watching changes in AI flows, you can use:
   ```bash
   npm run genkit:watch
   ```

### 7. Access the Application

Once both servers are running, open your browser and navigate to `http://localhost:9002` (or the port Next.js indicates).

---

## Available Scripts

*   `npm run dev`: Starts the Next.js development server (and Turbopack) on port 9002.
*   `npm run genkit:dev`: Starts the Genkit development server.
*   `npm run genkit:watch`: Starts the Genkit development server with file watching for AI flows.
*   `npm run build`: Builds the Next.js application for production.
*   `npm run start`: Starts the production Next.js server (after running `build`).
*   `npm run lint`: Lints the codebase using Next.js's built-in ESLint configuration.
*   `npm run typecheck`: Runs TypeScript to check for type errors.

---

## Project Structure Highlights

*   `src/app/`: Contains the Next.js App Router pages and layouts.
    *   `(app)/`: Routes protected by authentication.
    *   `(auth)/`: Authentication-related routes (login, signup).
*   `src/components/`: Reusable React components.
    *   `ui/`: ShadCN UI components.
    *   `auth/`, `chat/`, `layout/`, etc.: Feature-specific components.
*   `src/ai/`: Genkit AI related code.
    *   `flows/`: Genkit flow definitions (e.g., `ai-chatbot.ts`, `generate-report.ts`).
    *   `genkit.ts`: Genkit global instance initialization.
    *   `dev.ts`: Entry point for Genkit development server.
*   `src/contexts/`: React Context providers (e.g., `AuthContext.tsx`).
*   `src/hooks/`: Custom React hooks (e.g., `useAuth.ts`).
*   `src/lib/`: Utility functions and Firebase configuration.
*   `src/config/`: Navigation configuration.
*   `public/`: Static assets.
*   `firestore.rules`: Security rules for Cloud Firestore.

---

## UI/UX

![Screenshot 2025-06-23 133309](https://github.com/user-attachments/assets/a56f51bc-9942-40ce-ba0e-d791671a6ada)

![Screenshot 2025-06-23 133440](https://github.com/user-attachments/assets/7463875f-b77a-4fd6-bc42-65a14b19d7b4)

![Screenshot 2025-06-23 133416](https://github.com/user-attachments/assets/b67e0851-a487-429c-9420-40c5a728907d)

![Screenshot 2025-06-23 133640](https://github.com/user-attachments/assets/873d6a0b-0b4c-4808-9af3-34930ec70e66)

![Screenshot 2025-06-23 134551](https://github.com/user-attachments/assets/b09904ab-0a24-4e42-8ffc-2a628ecd9326)

![Screenshot 2025-06-23 134608](https://github.com/user-attachments/assets/a9380f23-788f-4ff6-8a92-54f30f62458d)

![Screenshot 2025-06-23 134625](https://github.com/user-attachments/assets/0cd07b36-231d-43f7-b3b0-e2fc10af3d60)

![Screenshot 2025-06-23 134707](https://github.com/user-attachments/assets/1de9b76c-f583-4e9f-bfa5-c8032c7771f2)

![Screenshot 2025-06-23 134732](https://github.com/user-attachments/assets/4a723556-80f8-42df-a453-98c607d41e72)


---

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

---

## License

This project is licensed under the MIT License.

---

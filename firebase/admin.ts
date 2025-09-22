import { initializeApp, getApps, cert, applicationDefault } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

// Initialize Firebase Admin SDK
function initFirebaseAdmin() {
  const apps = getApps();

  if (!apps.length) {
    // Check if we have all required environment variables
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;

    if (!projectId || !clientEmail || !privateKey) {
      console.warn("Firebase Admin not properly configured - missing environment variables");
      // Initialize with minimal config for development
      try {
        initializeApp({
          projectId: projectId || "demo-project",
        });
      } catch (error) {
        console.error("Failed to initialize Firebase Admin:", error);
        return null;
      }
    } else {
      try {
        initializeApp({
          credential: cert({
            projectId,
            clientEmail,
            // Replace newlines in the private key
            privateKey: privateKey.replace(/\\n/g, "\n"),
          }),
        });
      } catch (error) {
        console.error("Failed to initialize Firebase Admin with credentials:", error);
        // Fallback to basic initialization
        initializeApp({
          projectId: projectId || "demo-project",
        });
      }
    }
  }

  try {
    return {
      auth: getAuth(),
      db: getFirestore(),
    };
  } catch (error) {
    console.error("Failed to get Firebase services:", error);
    return null;
  }
}

const firebaseAdmin = initFirebaseAdmin();

export const auth = firebaseAdmin?.auth || null;
export const db = firebaseAdmin?.db || null;

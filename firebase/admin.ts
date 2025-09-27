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
        // Properly format the private key
        let formattedPrivateKey = privateKey;
        
        // Remove any surrounding quotes
        formattedPrivateKey = formattedPrivateKey.replace(/^["']|["']$/g, "");
        
        // Replace escaped newlines with actual newlines
        formattedPrivateKey = formattedPrivateKey.replace(/\\n/g, "\n");
        
        // Ensure proper PEM format
        if (!formattedPrivateKey.includes("-----BEGIN PRIVATE KEY-----")) {
          console.error("Private key missing PEM headers. Please check your FIREBASE_PRIVATE_KEY format.");
          throw new Error("Invalid private key format");
        }
        
        initializeApp({
          credential: cert({
            projectId,
            clientEmail,
            privateKey: formattedPrivateKey,
          }),
        });
        
        console.log("Firebase Admin initialized successfully with credentials");
      } catch (error) {
        console.error("Failed to initialize Firebase Admin with credentials:", error);
        console.log("Falling back to basic initialization without authentication");
        // Fallback to basic initialization
        try {
          initializeApp({
            projectId: projectId || "demo-project",
          });
        } catch (fallbackError) {
          console.error("Fallback initialization also failed:", fallbackError);
          return null;
        }
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

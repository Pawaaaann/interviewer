"use server";

import { auth, db } from "@/firebase/admin";
import { cookies } from "next/headers";

// Session duration (1 week)
const SESSION_DURATION = 60 * 60 * 24 * 7;

// Set session cookie
export async function setSessionCookie(idToken: string) {
  const cookieStore = await cookies();

  if (!auth) {
    throw new Error("Authentication not configured");
  }

  // Create session cookie
  const sessionCookie = await auth.createSessionCookie(idToken, {
    expiresIn: SESSION_DURATION * 1000, // milliseconds
  });

  // Set cookie in the browser
  cookieStore.set("session", sessionCookie, {
    maxAge: SESSION_DURATION,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
  });
}

export async function signUp(params: SignUpParams) {
  const { uid, name, email } = params;

  try {
    if (!db) {
      return {
        success: false,
        message: "Database not configured. Please set up Firebase.",
      };
    }

    // check if user exists in db
    const userRecord = await db.collection("users").doc(uid).get();
    if (userRecord.exists)
      return {
        success: false,
        message: "User already exists. Please sign in.",
      };

    // save user to db
    await db.collection("users").doc(uid).set({
      name,
      email,
      // profileURL,
      // resumeURL,
    });

    return {
      success: true,
      message: "Account created successfully. Please sign in.",
    };
  } catch (error: any) {
    console.error("Error creating user:", error);

    // Handle Firebase specific errors
    if (error.code === "auth/email-already-exists") {
      return {
        success: false,
        message: "This email is already in use",
      };
    }

    return {
      success: false,
      message: "Failed to create account. Please try again.",
    };
  }
}

export async function signIn(params: SignInParams) {
  const { email, idToken } = params;

  try {
    if (!auth) {
      return {
        success: false,
        message: "Authentication not configured. Please set up Firebase.",
      };
    }

    const userRecord = await auth.getUserByEmail(email);
    if (!userRecord)
      return {
        success: false,
        message: "User does not exist. Create an account.",
      };

    await setSessionCookie(idToken);
  } catch (error: any) {
    console.log("");

    return {
      success: false,
      message: "Failed to log into account. Please try again.",
    };
  }
}

// Sign out user by clearing the session cookie
export async function signOut() {
  const cookieStore = await cookies();

  cookieStore.delete("session");
}

// Get current user from session cookie
export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();

  const sessionCookie = cookieStore.get("session")?.value;
  if (!sessionCookie) return null;

  try {
    if (!auth) {
      console.log("Auth not configured");
      return null;
    }

    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);

    // Try to get user info from Firestore database
    if (db) {
      try {
        const userRecord = await db
          .collection("users")
          .doc(decodedClaims.uid)
          .get();
        
        if (userRecord.exists) {
          return {
            ...userRecord.data(),
            id: userRecord.id,
          } as User;
        }
      } catch (dbError: any) {
        console.warn("Firestore not available:", dbError.message);
        // Continue to fallback below
      }
    }

    // Fallback: Return basic user info from session token when Firestore is unavailable
    console.log("Using fallback authentication (Firestore unavailable)");
    return {
      id: decodedClaims.uid,
      name: decodedClaims.name || decodedClaims.email?.split('@')[0] || "User",
      email: decodedClaims.email || "",
    } as User;

  } catch (error: any) {
    console.log("Session verification failed:", error.message);
    // Invalid or expired session
    return null;
  }
}

// Check if user is authenticated
export async function isAuthenticated() {
  const user = await getCurrentUser();
  return !!user;
}

import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged as firebaseOnAuthStateChanged,
} from "@react-native-firebase/auth";
import type { FirebaseAuthTypes } from "@react-native-firebase/auth";

export type AuthUser = FirebaseAuthTypes.User;

/**
 * Sign in with email and password.
 */
export async function signIn(
  email: string,
  password: string,
): Promise<AuthUser> {
  const credential = await signInWithEmailAndPassword(
    getAuth(),
    email,
    password,
  );
  return credential.user;
}

/**
 * Create a new account with email and password.
 */
export async function signUp(
  email: string,
  password: string,
): Promise<AuthUser> {
  const credential = await createUserWithEmailAndPassword(
    getAuth(),
    email,
    password,
  );
  return credential.user;
}

/**
 * Sign out the current user.
 */
export async function signOut(): Promise<void> {
  await firebaseSignOut(getAuth());
}

/**
 * Subscribe to auth state changes.
 * Returns an unsubscribe function.
 */
export function onAuthStateChanged(
  callback: (user: AuthUser | null) => void,
): () => void {
  return firebaseOnAuthStateChanged(getAuth(), callback);
}

/**
 * Returns the currently signed-in user, or null.
 */
export function getCurrentUser(): AuthUser | null {
  return getAuth().currentUser;
}

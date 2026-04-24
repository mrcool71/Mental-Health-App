import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  sendPasswordResetEmail,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "@react-native-firebase/auth";
import type { FirebaseAuthTypes } from "@react-native-firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import notifee from "@notifee/react-native";
import { deleteUserAccountData } from "./cloudSync";

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

export async function sendPasswordReset(email: string): Promise<void> {
  await sendPasswordResetEmail(getAuth(), email);
}

export async function deleteAccount(password: string): Promise<void> {
  const user = getCurrentUser();
  if (!user) {
    throw new Error("No signed-in user.");
  }

  if (!user.email) {
    throw new Error("This account does not have an email address.");
  }

  const credential = EmailAuthProvider.credential(user.email, password);
  await reauthenticateWithCredential(user, credential);
  await deleteUserAccountData(user.uid);

  const keys = await AsyncStorage.getAllKeys();
  if (keys.length > 0) {
    await AsyncStorage.multiRemove(keys);
  }

  await notifee.cancelAllNotifications();
  await user.delete();
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

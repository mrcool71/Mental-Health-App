import admin from "firebase-admin";
import type { Request, Response, NextFunction } from "express";

type AuthedRequest = Request & {
  user?: {
    uid: string;
  };
};

function initFirebaseAdmin() {
  if (admin.apps.length > 0) return;

  admin.initializeApp({
    projectId: process.env.FIREBASE_PROJECT_ID,
  });
}

initFirebaseAdmin();

export async function requireAuth(
  req: AuthedRequest,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing bearer token" });
  }

  const token = authHeader.replace("Bearer ", "").trim();
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = { uid: decoded.uid };
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}

export function assertUserMatch(req: AuthedRequest, userId: string): boolean {
  return req.user?.uid === userId;
}

export type { AuthedRequest };

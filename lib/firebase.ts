type FirebaseResult = {
  app: unknown;
  auth: unknown;
  db: unknown;
  googleProvider: unknown;
  firebaseAuth: unknown;
  firestore: unknown;
};

type FirebaseModule = {
  isFirebaseConfigured: () => boolean;
  initFirebase: () => Promise<FirebaseResult>;
};

let mod: FirebaseModule | null = null;
try { mod = require('../_private/auth/firebase') as FirebaseModule; } catch { /* private module not available */ }

export const isFirebaseConfigured: () => boolean = mod?.isFirebaseConfigured ?? (() => false);
export const initFirebase: () => Promise<FirebaseResult> = mod?.initFirebase ?? (async () => ({
  app: null, auth: null, db: null, googleProvider: null, firebaseAuth: null, firestore: null,
}));

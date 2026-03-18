// @ts-nocheck
let mod: any = null;
try { mod = require('../_private/auth/firebase'); } catch {}

export const isFirebaseConfigured: () => boolean = mod?.isFirebaseConfigured ?? (() => false);
export const initFirebase = mod?.initFirebase ?? (async () => ({
  app: null, auth: null, db: null, googleProvider: null, firebaseAuth: null, firestore: null,
}));

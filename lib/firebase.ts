/**
 * firebase.ts — Firebase 초기화 (조건부 동적 로드)
 *
 * 설정 방법:
 * 1. npm install firebase
 * 2. Firebase Console에서 프로젝트를 만들고 .env.local에 키 입력:
 *   NEXT_PUBLIC_FIREBASE_API_KEY=...
 *   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
 *   NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
 *   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
 *   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
 *   NEXT_PUBLIC_FIREBASE_APP_ID=...
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

let _app: any = null;
let _auth: any = null;
let _db: any = null;
let _googleProvider: any = null;
let _initialized = false;
let _initPromise: Promise<any> | null = null;
let _firebaseAuth: any = null;
let _firestore: any = null;

export function isFirebaseConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
  );
}

export async function initFirebase() {
  if (_initialized) return { app: _app, auth: _auth, db: _db, googleProvider: _googleProvider, firebaseAuth: _firebaseAuth, firestore: _firestore };
  if (!isFirebaseConfigured()) return { app: null, auth: null, db: null, googleProvider: null, firebaseAuth: null, firestore: null };

  if (_initPromise) return _initPromise;

  _initPromise = (async () => {
    try {
      const firebaseApp = await (Function('return import("firebase/app")')() as Promise<any>);
      _firebaseAuth = await (Function('return import("firebase/auth")')() as Promise<any>);
      _firestore = await (Function('return import("firebase/firestore")')() as Promise<any>);

      const config = {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? '',
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? '',
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? '',
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? '',
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? '',
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? '',
      };

      _app = firebaseApp.getApps().length > 0
        ? firebaseApp.getApp()
        : firebaseApp.initializeApp(config);

      _auth = _firebaseAuth.getAuth(_app);
      _db = _firestore.getFirestore(_app);
      _googleProvider = new _firebaseAuth.GoogleAuthProvider();
      _initialized = true;
    } catch {
      // firebase 패키지 미설치 시 조용히 무시
    }
    return { app: _app, auth: _auth, db: _db, googleProvider: _googleProvider, firebaseAuth: _firebaseAuth, firestore: _firestore };
  })();

  return _initPromise;
}

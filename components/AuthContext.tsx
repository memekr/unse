'use client';

import { createContext, useContext, useEffect, useState, useCallback, useRef, type ReactNode } from 'react';
import { initFirebase, isFirebaseConfigured as checkFirebase } from '@/lib/firebase';

/* eslint-disable @typescript-eslint/no-explicit-any */

type AuthUser = {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
};

type SavedResult = {
  id: string;
  name: string;
  birthDate: string;
  gender: string;
  birthTime: number;
  createdAt: string;
  resultData: string;
};

type AuthContextType = {
  user: AuthUser | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
  saveResult: (data: Omit<SavedResult, 'id' | 'createdAt'>) => Promise<void>;
  loadResults: () => Promise<SavedResult[]>;
  isConfigured: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signInWithGoogle: async () => {},
  signOutUser: async () => {},
  saveResult: async () => {},
  loadResults: async () => [],
  isConfigured: false,
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const fbRef = useRef<any>(null);

  const isConfigured = checkFirebase();

  useEffect(() => {
    if (!isConfigured) {
      setLoading(false);
      return;
    }

    let unsubscribe: (() => void) | undefined;

    (async () => {
      try {
        const fb = await initFirebase();
        fbRef.current = fb;

        if (!fb.auth || !fb.firebaseAuth) {
          setLoading(false);
          return;
        }

        unsubscribe = fb.firebaseAuth.onAuthStateChanged(fb.auth, (firebaseUser: any) => {
          if (firebaseUser) {
            setUser({
              uid: firebaseUser.uid,
              displayName: firebaseUser.displayName,
              email: firebaseUser.email,
              photoURL: firebaseUser.photoURL,
            });
          } else {
            setUser(null);
          }
          setLoading(false);
        });
      } catch {
        setLoading(false);
      }
    })();

    return () => { if (unsubscribe) unsubscribe(); };
  }, [isConfigured]);

  const signInWithGoogle = useCallback(async () => {
    if (!isConfigured) return;
    try {
      const fb = fbRef.current ?? await initFirebase();
      if (!fb.auth || !fb.googleProvider || !fb.firebaseAuth) return;
      await fb.firebaseAuth.signInWithPopup(fb.auth, fb.googleProvider);
    } catch (error) {
      console.error('Google 로그인 실패:', error);
    }
  }, [isConfigured]);

  const signOutUser = useCallback(async () => {
    if (!isConfigured) return;
    try {
      const fb = fbRef.current ?? await initFirebase();
      if (!fb.auth || !fb.firebaseAuth) return;
      await fb.firebaseAuth.signOut(fb.auth);
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
  }, [isConfigured]);

  const saveResult = useCallback(async (data: Omit<SavedResult, 'id' | 'createdAt'>) => {
    if (!isConfigured || !user) return;
    try {
      const fb = fbRef.current ?? await initFirebase();
      if (!fb.db || !fb.firestore) return;
      const id = `${data.name}_${data.birthDate}_${Date.now()}`;
      const resultDoc = fb.firestore.doc(fb.db, 'users', user.uid, 'results', id);
      await fb.firestore.setDoc(resultDoc, {
        ...data,
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('결과 저장 실패:', error);
    }
  }, [isConfigured, user]);

  const loadResults = useCallback(async (): Promise<SavedResult[]> => {
    if (!isConfigured || !user) return [];
    try {
      const fb = fbRef.current ?? await initFirebase();
      if (!fb.db || !fb.firestore) return [];
      const resultsRef = fb.firestore.collection(fb.db, 'users', user.uid, 'results');
      const q = fb.firestore.query(resultsRef, fb.firestore.orderBy('createdAt', 'desc'), fb.firestore.limit(20));
      const snapshot = await fb.firestore.getDocs(q);
      return snapshot.docs.map((d: any) => ({ id: d.id, ...d.data() } as SavedResult));
    } catch (error) {
      console.error('결과 불러오기 실패:', error);
      return [];
    }
  }, [isConfigured, user]);

  return (
    <AuthContext.Provider value={{
      user, loading, signInWithGoogle, signOutUser,
      saveResult, loadResults, isConfigured,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

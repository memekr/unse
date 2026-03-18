// @ts-nocheck
'use client';

let PrivateModule: any = null;
try { PrivateModule = require('../_private/auth/AuthContext'); } catch {}

import { createContext, useContext, type ReactNode } from 'react';

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
  loading: false,
  signInWithGoogle: async () => {},
  signOutUser: async () => {},
  saveResult: async () => {},
  loadResults: async () => [],
  isConfigured: false,
});

export const useAuth = PrivateModule?.useAuth ?? (() => useContext(AuthContext));

export const AuthProvider = PrivateModule?.AuthProvider ?? (({ children }: { children: ReactNode }) => (
  <AuthContext.Provider value={{
    user: null,
    loading: false,
    signInWithGoogle: async () => {},
    signOutUser: async () => {},
    saveResult: async () => {},
    loadResults: async () => [],
    isConfigured: false,
  }}>
    {children}
  </AuthContext.Provider>
));

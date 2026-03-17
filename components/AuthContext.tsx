'use client';

/**
 * 인증 컨텍스트 (스텁)
 *
 * Google 로그인을 사용하려면 _private/auth/ 모듈을 설정하세요.
 */

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

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
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
  );
}

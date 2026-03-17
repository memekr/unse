'use client';

import { useAuth } from './AuthContext';

export default function AuthButton() {
  const { user, loading, signInWithGoogle, signOutUser, isConfigured } = useAuth();

  // Firebase 미설정 시 숨김
  if (!isConfigured) return null;
  if (loading) return null;

  if (user) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {user.photoURL && (
          <img
            src={user.photoURL}
            alt=""
            style={{
              width: '1.5rem', height: '1.5rem', borderRadius: '50%',
              border: '1px solid var(--color-glass-border)',
            }}
          />
        )}
        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', maxWidth: '6rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {user.displayName ?? user.email}
        </span>
        <button
          onClick={signOutUser}
          style={{
            padding: '0.25rem 0.5rem', borderRadius: '0.375rem',
            border: '1px solid var(--color-glass-border)',
            background: 'transparent', color: 'var(--color-text-dim)',
            fontSize: '0.6875rem', cursor: 'pointer',
          }}
        >
          {'로그아웃'}
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={signInWithGoogle}
      style={{
        display: 'flex', alignItems: 'center', gap: '0.375rem',
        padding: '0.375rem 0.75rem', borderRadius: '9999px',
        border: '1px solid var(--color-glass-border)',
        background: 'var(--color-glass)', color: 'var(--color-text)',
        fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer',
        transition: 'border-color 0.2s',
      }}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
      </svg>
      {'로그인'}
    </button>
  );
}

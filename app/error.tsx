'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[unse.me] Page error:', error);
  }, [error]);

  return (
    <div style={{
      minHeight: '60vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem',
      textAlign: 'center',
    }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--color-text)' }}>
          문제가 발생했습니다
        </h1>
        <p style={{ fontSize: '1rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
          요청을 처리하던 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.
        </p>
      </div>
      <button
        onClick={() => reset()}
        style={{
          padding: '0.75rem 1.5rem',
          borderRadius: '0.5rem',
          background: 'var(--color-cta)',
          color: '#fff',
          border: 'none',
          fontSize: '0.9375rem',
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'opacity 0.2s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
      >
        다시 시도하기
      </button>
    </div>
  );
}

import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{
      minHeight: '70vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem',
      textAlign: 'center',
    }}>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem', opacity: 0.8 }}>404</div>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--color-text)' }}>
          페이지를 찾을 수 없습니다
        </h1>
        <p style={{ fontSize: '1rem', color: 'var(--color-text-muted)', marginBottom: '2rem', maxWidth: '32rem' }}>
          요청하신 페이지는 존재하지 않습니다. 홈페이지로 이동하여 오늘의 운세를 확인해보세요.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link
          href="/"
          style={{
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            background: 'var(--color-cta)',
            color: '#fff',
            textDecoration: 'none',
            fontSize: '0.9375rem',
            fontWeight: 600,
            transition: 'opacity 0.2s',
          }}
        >
          홈으로 돌아가기
        </Link>
        <Link
          href="/horoscope"
          style={{
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            border: '1px solid var(--color-border)',
            background: 'var(--color-surface)',
            color: 'var(--color-text)',
            textDecoration: 'none',
            fontSize: '0.9375rem',
            fontWeight: 600,
            transition: 'all 0.2s',
          }}
        >
          운세 보기
        </Link>
      </div>
    </div>
  );
}

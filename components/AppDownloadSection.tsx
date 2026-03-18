'use client';

const PLAY_STORE_URL = process.env.NEXT_PUBLIC_PLAY_STORE_URL;

export default function AppDownloadSection() {
  if (!PLAY_STORE_URL) return null;

  const features = [
    { icon: '\u2728', title: '매일 맞춤 운세', desc: '띠별, 별자리별 오늘의 운세를 매일 받아보세요' },
    { icon: '\uD83C\uDFB4', title: '타로 & 사주', desc: '앱에서 간편하게 타로카드, 사주풀이 확인' },
    { icon: '\uD83D\uDD14', title: '운세 알림', desc: '매일 아침 오늘의 운세 푸시 알림' },
  ];

  return (
    <section style={{
      padding: '3rem 1rem',
      maxWidth: 'var(--max-width, 72rem)',
      margin: '0 auto',
    }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <span style={{
          display: 'inline-block',
          fontSize: '0.75rem',
          fontWeight: 700,
          color: 'var(--color-accent, #c084fc)',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          marginBottom: '0.5rem',
        }}>
          모바일 앱
        </span>
        <h2 style={{
          fontSize: '1.75rem',
          fontWeight: 800,
          color: 'var(--color-text, #ede9f6)',
          margin: '0 0 0.5rem',
        }}>
          운세미 앱으로 더 빠르게
        </h2>
        <p style={{
          color: 'var(--color-text-muted, #b4a4d6)',
          fontSize: '0.9375rem',
          maxWidth: 500,
          margin: '0 auto',
        }}>
          매일의 운세, 사주, 타로를 모바일 앱에서 간편하게 확인하세요.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '2rem',
        maxWidth: 800,
        margin: '0 auto',
        alignItems: 'center',
      }}>
        {/* App screenshot placeholder */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 300,
        }}>
          <div style={{
            width: 150,
            height: 260,
            borderRadius: 24,
            background: 'var(--gradient-primary, linear-gradient(135deg, #7c3aed, #4f46e5, #6366f1))',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            color: '#fff',
            boxShadow: '0 8px 40px var(--color-cta-glow, rgba(139, 92, 246, 0.4))',
          }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="10" r="4" fill="#fff" opacity="0.9" />
              <path d="M6 20c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="#fff" strokeWidth="2" strokeLinecap="round" fill="none" />
            </svg>
            <span style={{ fontWeight: 700, fontSize: '1rem' }}>운세미</span>
            <span style={{ opacity: 0.7, fontSize: '0.625rem' }}>앱 스크린샷</span>
          </div>
        </div>

        {/* Features + CTA */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {features.map((f) => (
              <li key={f.title} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <span style={{
                  fontSize: '1.25rem',
                  flexShrink: 0,
                  width: 40,
                  height: 40,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 'var(--radius-sm, 0.625rem)',
                  background: 'var(--color-badge-bg, rgba(139, 92, 246, 0.15))',
                }}>
                  {f.icon}
                </span>
                <div>
                  <strong style={{
                    color: 'var(--color-text, #ede9f6)',
                    fontSize: '0.9375rem',
                    display: 'block',
                    marginBottom: 2,
                  }}>
                    {f.title}
                  </strong>
                  <span style={{
                    color: 'var(--color-text-muted, #b4a4d6)',
                    fontSize: '0.8125rem',
                  }}>
                    {f.desc}
                  </span>
                </div>
              </li>
            ))}
          </ul>

          <a
            href={PLAY_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              alignSelf: 'flex-start',
              marginTop: '0.5rem',
              padding: '0.75rem 1.5rem',
              background: 'var(--gradient-primary, linear-gradient(135deg, #7c3aed, #4f46e5))',
              color: '#fff',
              fontWeight: 700,
              fontSize: '0.9375rem',
              borderRadius: 'var(--radius-full, 9999px)',
              textDecoration: 'none',
              boxShadow: '0 4px 16px var(--color-cta-glow, rgba(139, 92, 246, 0.4))',
              transition: 'opacity 0.2s',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3.61 1.814L13.793 12 3.61 22.186a.996.996 0 01-.61-.92V2.734c0-.382.218-.726.61-.92zm.86-.41L15.47 6.96l-2.76 2.76L5.06 2.07l-.59-.666zM15.47 17.04l-10.997 5.556.59-.666 7.65-7.65 2.757 2.76zM21.41 10.89l-3.88-1.97-3.07 3.07 3.07 3.07 3.88-1.97c.71-.36.71-1.84 0-2.2z"/>
            </svg>
            Google Play에서 다운로드
          </a>
        </div>
      </div>
    </section>
  );
}

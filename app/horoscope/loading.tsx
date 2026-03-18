export default function HoroscopeLoading() {
  return (
    <div role="status" aria-label="운세 로딩 중">
      <div className="page-header">
        <div style={{ width: 40, height: 40, background: 'var(--color-glass)', borderRadius: '50%', margin: '0 auto 12px', animation: 'pulse 1.5s ease-in-out infinite' }} />
        <div style={{ width: 200, height: 28, background: 'var(--color-glass)', borderRadius: 8, margin: '0 auto 8px', animation: 'pulse 1.5s ease-in-out infinite' }} />
        <div style={{ width: 300, height: 16, background: 'var(--color-glass)', borderRadius: 8, margin: '0 auto', animation: 'pulse 1.5s ease-in-out infinite' }} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12, padding: '0 1rem' }}>
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            style={{
              height: 100,
              background: 'var(--color-bg-card)',
              borderRadius: 'var(--radius)',
              animation: 'pulse 1.5s ease-in-out infinite',
              animationDelay: `${i * 0.05}s`,
            }}
          />
        ))}
      </div>
      <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }`}</style>
    </div>
  );
}

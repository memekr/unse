export default function TarotLoading() {
  return (
    <div role="status" aria-label="타로 페이지 로딩 중" style={{ padding: '2rem 1rem', maxWidth: 600, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{ width: 50, height: 50, background: 'var(--color-glass)', borderRadius: '50%', margin: '0 auto 12px', animation: 'pulse 1.5s ease-in-out infinite' }} />
        <div style={{ width: 180, height: 28, background: 'var(--color-glass)', borderRadius: 8, margin: '0 auto 8px', animation: 'pulse 1.5s ease-in-out infinite' }} />
      </div>
      <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
        {[1, 2, 3].map((i) => (
          <div key={i} style={{ width: 100, height: 150, background: 'var(--color-bg-card)', borderRadius: 'var(--radius)', animation: 'pulse 1.5s ease-in-out infinite', animationDelay: `${i * 0.1}s` }} />
        ))}
      </div>
      <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }`}</style>
    </div>
  );
}

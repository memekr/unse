export default function SajuLoading() {
  return (
    <div role="status" aria-label="사주 페이지 로딩 중" style={{ padding: '2rem 1rem', maxWidth: 600, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{ width: 50, height: 50, background: 'var(--color-glass)', borderRadius: '50%', margin: '0 auto 12px', animation: 'pulse 1.5s ease-in-out infinite' }} />
        <div style={{ width: 200, height: 28, background: 'var(--color-glass)', borderRadius: 8, margin: '0 auto 8px', animation: 'pulse 1.5s ease-in-out infinite' }} />
      </div>
      <div style={{ height: 250, background: 'var(--color-bg-card)', borderRadius: 'var(--radius)', animation: 'pulse 1.5s ease-in-out infinite' }} />
      <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }`}</style>
    </div>
  );
}

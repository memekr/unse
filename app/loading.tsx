export default function Loading() {
  return (
    <div
      role="status"
      aria-label="페이지 로딩 중"
      style={{
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            width: 40,
            height: 40,
            border: '3px solid rgba(139, 92, 246, 0.2)',
            borderTopColor: 'var(--color-cta)',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 16px',
          }}
        />
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>로딩 중...</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

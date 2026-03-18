const PLAY_STORE_URL = process.env.NEXT_PUBLIC_PLAY_STORE_URL;

export default function PlayStoreBadge({ className }: { className?: string }) {
  if (!PLAY_STORE_URL) return null;

  return (
    <a
      href={PLAY_STORE_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      aria-label="Google Play에서 운세미 다운로드"
      style={{ display: 'inline-block' }}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="160" height="48" viewBox="0 0 160 48" fill="none">
        <rect width="160" height="48" rx="8" fill="#000"/>
        <rect x="0.5" y="0.5" width="159" height="47" rx="7.5" stroke="#A6A6A6"/>
        <text x="54" y="18" fill="#fff" fontSize="8" fontFamily="sans-serif">GET IT ON</text>
        <text x="54" y="33" fill="#fff" fontSize="14" fontWeight="bold" fontFamily="sans-serif">Google Play</text>
        <g transform="translate(14,10)">
          <path d="M0 2.5C0 1.5 0.6 0.7 1.4 0.3L15.4 14L1.4 27.7C0.6 27.3 0 26.5 0 25.5V2.5Z" fill="#4285F4"/>
          <path d="M1.4 0.3L15.4 14L19.8 9.6L3.2 0C2.6 -0.3 1.9 -0.2 1.4 0.3Z" fill="#34A853"/>
          <path d="M1.4 27.7L3.2 28C3.8 28.3 4.5 28.2 5 27.8L19.8 18.4L15.4 14L1.4 27.7Z" fill="#EA4335"/>
          <path d="M19.8 9.6L15.4 14L19.8 18.4L24.4 15.6C25.4 15 25.4 13 24.4 12.4L19.8 9.6Z" fill="#FBBC04"/>
        </g>
      </svg>
    </a>
  );
}

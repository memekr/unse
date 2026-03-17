import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #7c3aed 0%, #312e81 50%, #1e1b4b 100%)',
          color: '#ffffff',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: 72,
            marginBottom: 8,
          }}
        >
          🌙 ⭐
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: 64,
            fontWeight: 800,
            letterSpacing: '-0.02em',
            marginBottom: 12,
          }}
        >
          운세미
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: 28,
            fontWeight: 600,
            color: 'rgba(255,255,255,0.85)',
            marginBottom: 8,
          }}
        >
          UNSE.ME
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: 32,
            fontWeight: 500,
            color: 'rgba(255,255,255,0.9)',
            marginTop: 16,
            padding: '8px 32px',
            borderRadius: 16,
            background: 'rgba(255,255,255,0.15)',
          }}
        >
          오늘의 운세
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}

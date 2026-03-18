import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '개인정보처리방침',
  description: '운세미의 개인정보 수집, 이용, 보관 정책을 안내합니다.',
  alternates: { canonical: 'https://unse.me/privacy' },
};

export default function PrivacyPage() {
  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '3rem 1rem' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem', color: '#e5e5e5' }}>
        개인정보처리방침
      </h1>
      <p style={{ color: '#737373', fontSize: '0.85rem', marginBottom: '2rem' }}>
        최종 수정: 2026년 3월 18일
      </p>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', color: '#d4d4d4' }}>1. 수집하는 개인정보</h2>
        <p style={{ color: '#a3a3a3', lineHeight: 1.8, fontSize: '0.9rem' }}>
          운세미는 서비스 이용 과정에서 다음 정보가 자동 또는 이용자 입력으로 수집될 수 있습니다.
        </p>
        <ul style={{ color: '#a3a3a3', lineHeight: 1.8, fontSize: '0.9rem', paddingLeft: '1.2rem' }}>
          <li>자동 수집: 접속 IP, 브라우저 종류, 기기 정보, 방문 패턴</li>
          <li>이용자 입력: 생년월일, 성별, 이름 (사주/궁합 서비스 이용 시)</li>
        </ul>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', color: '#d4d4d4' }}>2. 개인정보의 이용 목적</h2>
        <ul style={{ color: '#a3a3a3', lineHeight: 1.8, fontSize: '0.9rem', paddingLeft: '1.2rem' }}>
          <li>운세, 사주, 타로, 궁합 서비스 제공</li>
          <li>서비스 개선을 위한 익명 통계 분석</li>
          <li>부정 이용 방지 및 보안</li>
        </ul>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', color: '#d4d4d4' }}>3. 개인정보의 보유 및 파기</h2>
        <p style={{ color: '#a3a3a3', lineHeight: 1.8, fontSize: '0.9rem' }}>
          이용자가 입력한 생년월일 등의 정보는 서버에 저장되지 않으며, 결과 생성 후 즉시 삭제됩니다.
          자동 수집된 로그 정보는 1년간 보관 후 파기합니다.
        </p>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', color: '#d4d4d4' }}>4. 제3자 제공</h2>
        <p style={{ color: '#a3a3a3', lineHeight: 1.8, fontSize: '0.9rem' }}>
          운세미는 이용자의 동의 없이 개인정보를 제3자에게 제공하지 않습니다.
        </p>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', color: '#d4d4d4' }}>5. 쿠키 및 분석 도구</h2>
        <p style={{ color: '#a3a3a3', lineHeight: 1.8, fontSize: '0.9rem' }}>
          운세미는 Google Analytics 및 Vercel Analytics를 통해 익명화된 방문 통계를 수집합니다.
        </p>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', color: '#d4d4d4' }}>6. 이용자의 권리</h2>
        <p style={{ color: '#a3a3a3', lineHeight: 1.8, fontSize: '0.9rem' }}>
          이용자는 언제든지 개인정보 열람, 정정, 삭제를 요청할 수 있습니다.
          문의: contact@unse.me
        </p>
      </section>

      <section>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', color: '#d4d4d4' }}>7. 정책 변경</h2>
        <p style={{ color: '#a3a3a3', lineHeight: 1.8, fontSize: '0.9rem' }}>
          본 개인정보처리방침은 법령 변경 또는 서비스 운영상의 필요에 따라 변경될 수 있습니다.
        </p>
      </section>
    </div>
  );
}

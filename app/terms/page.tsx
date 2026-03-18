import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '이용약관',
  description: '운세미 서비스 이용약관을 안내합니다.',
  alternates: { canonical: 'https://unse.me/terms' },
};

export default function TermsPage() {
  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '3rem 1rem' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem', color: '#e5e5e5' }}>
        이용약관
      </h1>
      <p style={{ color: '#737373', fontSize: '0.85rem', marginBottom: '2rem' }}>
        최종 수정: 2026년 3월 18일
      </p>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', color: '#d4d4d4' }}>제1조 (목적)</h2>
        <p style={{ color: '#a3a3a3', lineHeight: 1.8, fontSize: '0.9rem' }}>
          이 약관은 운세미(이하 &quot;서비스&quot;)의 이용에 관한 기본적인 사항을 규정함을 목적으로 합니다.
        </p>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', color: '#d4d4d4' }}>제2조 (서비스의 내용)</h2>
        <p style={{ color: '#a3a3a3', lineHeight: 1.8, fontSize: '0.9rem' }}>
          서비스는 오늘의 운세, 사주풀이, 타로, 꿈해몽, 별자리 운세, 궁합 등을 제공하는 무료 운세 서비스입니다.
          모든 콘텐츠는 회원가입 없이 이용할 수 있습니다.
        </p>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', color: '#d4d4d4' }}>제3조 (면책)</h2>
        <p style={{ color: '#a3a3a3', lineHeight: 1.8, fontSize: '0.9rem' }}>
          서비스에서 제공하는 운세 정보는 오락 및 참고 목적으로만 제공됩니다.
          서비스는 운세 결과의 정확성을 보증하지 않으며, 운세 결과에 기반한
          의사결정으로 인한 결과에 대해 책임을 지지 않습니다.
        </p>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', color: '#d4d4d4' }}>제4조 (이용자의 의무)</h2>
        <ul style={{ color: '#a3a3a3', lineHeight: 1.8, fontSize: '0.9rem', paddingLeft: '1.2rem' }}>
          <li>서비스의 콘텐츠를 무단으로 복제, 배포, 상업적 이용하지 않습니다.</li>
          <li>서비스 운영을 방해하는 행위를 하지 않습니다.</li>
          <li>타인의 권리를 침해하지 않습니다.</li>
        </ul>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', color: '#d4d4d4' }}>제5조 (제휴 링크)</h2>
        <p style={{ color: '#a3a3a3', lineHeight: 1.8, fontSize: '0.9rem' }}>
          서비스 내 일부 링크는 제휴 마케팅 링크로, 이를 통한 구매 시 서비스 운영에 도움이 되는 소정의 수수료를 받을 수 있습니다.
        </p>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', color: '#d4d4d4' }}>제6조 (서비스 변경 및 중단)</h2>
        <p style={{ color: '#a3a3a3', lineHeight: 1.8, fontSize: '0.9rem' }}>
          서비스는 운영상의 필요에 따라 사전 고지 후 변경하거나 중단할 수 있습니다.
        </p>
      </section>

      <section>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', color: '#d4d4d4' }}>제7조 (약관 변경)</h2>
        <p style={{ color: '#a3a3a3', lineHeight: 1.8, fontSize: '0.9rem' }}>
          본 약관은 필요에 따라 변경될 수 있으며, 변경 시 사이트 내 공지를 통해 안내합니다.
        </p>
      </section>
    </div>
  );
}

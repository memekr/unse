'use client';

import React, { useMemo } from 'react';

interface SiteLink {
  domain: string;
  name: string;
  category: string;
  description: string;
  linkTo: string[];
}

interface FooterProps {
  currentDomain: string;
  year?: number;
  companyName?: string;
  showCategories?: boolean;
  maxLinks?: number;
  layout?: 'grid' | 'horizontal';
}

// Complete site network configuration
const SITE_NETWORK: SiteLink[] = [
  {
    domain: 'warwar.me',
    name: '워워',
    category: '국제 분쟁 뉴스',
    description: '실시간 국제 분쟁 뉴스 및 군사 분석',
    linkTo: ['jusik.me', 'yuchul.com', 'valuepick.me'],
  },
  {
    domain: 'jusik.me',
    name: '주식미',
    category: '주식 정보',
    description: '주식 정보 포털 및 시장 분석',
    linkTo: ['warwar.me', 'yuchul.com', 'valuepick.me'],
  },
  {
    domain: 'alimaster.shop',
    name: '알리마스터',
    category: '해외 직구',
    description: '해외 직구 할인 및 쿠폰 정보',
    linkTo: ['plusmoa.shop', 'valuepick.me', 'agent.me.kr'],
  },
  {
    domain: 'plusmoa.shop',
    name: '플러스모아',
    category: '캐시백 혜택',
    description: '캐시백 쿠폰 혜택 및 할인 정보',
    linkTo: ['alimaster.shop', 'valuepick.me', 'unse.me'],
  },
  {
    domain: 'unse.me',
    name: '운세',
    category: '사주 타로',
    description: '사주 타로 운세 및 궁합 분석',
    linkTo: ['plusmoa.shop', 'agent.me.kr', 'warwar.me'],
  },
  {
    domain: 'valuepick.me',
    name: '밸류픽',
    category: '상품 비교',
    description: '상품 추천 및 가격 비교 서비스',
    linkTo: ['alimaster.shop', 'jusik.me', 'plusmoa.shop'],
  },
  {
    domain: 'yuchul.com',
    name: '유철',
    category: '기술 분석',
    description: '기술 분석 및 시장 리포트',
    linkTo: ['warwar.me', 'jusik.me', 'agent.me.kr'],
  },
  {
    domain: 'agent.me.kr',
    name: '에이전트',
    category: '전문가 매칭',
    description: '전문가 매칭 및 컨설팅 서비스',
    linkTo: ['unse.me', 'yuchul.com', 'valuepick.me'],
  },
];

export function CrossSiteFooter({
  currentDomain,
  year = new Date().getFullYear(),
  companyName = '웹 서비스 네트워크',
  showCategories = true,
  maxLinks = 7,
  layout = 'grid',
}: FooterProps) {
  // Get sister sites for the current domain
  const sisterSites = useMemo(() => {
    const current = SITE_NETWORK.find((site) => site.domain === currentDomain);
    if (!current) return [];

    // Get all sister sites except current
    return SITE_NETWORK.filter((site) => site.domain !== currentDomain).slice(0, maxLinks);
  }, [currentDomain, maxLinks]);

  if (sisterSites.length === 0) {
    return null;
  }

  return (
    <footer className="cross-site-footer">
      <div className="footer-container">
        {/* Sister Sites Section */}
        <div className="footer-section">
          <h3 className="footer-section-title">관련 서비스</h3>
          <div className={`footer-links-${layout}`}>
            {sisterSites.map((site) => (
              <a
                key={site.domain}
                href={`https://${site.domain}`}
                title={site.description}
                className="footer-site-link"
                rel="friend"
              >
                <span className="site-name">{site.name}</span>
                {showCategories && (
                  <span className="site-category">{site.category}</span>
                )}
              </a>
            ))}
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <p className="footer-copyright">
            &copy; {year} {companyName}. 모든 권리 보유.
          </p>
          <ul className="footer-legal">
            <li>
              <a href="/terms">이용약관</a>
            </li>
            <li>
              <a href="/privacy">개인정보처리방침</a>
            </li>
            <li>
              <a href="/about">소개</a>
            </li>
          </ul>
        </div>
      </div>

      <style jsx>{`
        .cross-site-footer {
          background-color: #1a1a1a;
          color: #e0e0e0;
          padding: 3rem 1rem 1.5rem;
          margin-top: auto;
          border-top: 1px solid #333;
        }

        .footer-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .footer-section {
          margin-bottom: 2rem;
        }

        .footer-section-title {
          font-size: 0.95rem;
          font-weight: 700;
          margin: 0 0 1.5rem 0;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #ffffff;
        }

        .footer-links-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 1rem;
        }

        .footer-links-horizontal {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .footer-site-link {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          padding: 0.85rem 1.1rem;
          background-color: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(100, 181, 246, 0.3);
          border-radius: 6px;
          color: #64b5f6;
          text-decoration: none;
          transition: all 0.25s ease;
          font-size: 0.95rem;
          font-weight: 500;
        }

        .footer-site-link:hover {
          background-color: rgba(100, 181, 246, 0.1);
          border-color: #64b5f6;
          color: #90caf9;
          text-decoration: none;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(100, 181, 246, 0.2);
        }

        .site-name {
          font-weight: 600;
          color: #ffffff;
        }

        .site-category {
          font-size: 0.8rem;
          color: #90caf9;
          opacity: 0.9;
        }

        .footer-bottom {
          border-top: 1px solid #333;
          padding-top: 1.5rem;
          margin-top: 2rem;
        }

        .footer-copyright {
          margin: 0 0 1rem 0;
          font-size: 0.9rem;
          color: #999;
        }

        .footer-legal {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          gap: 2rem;
          flex-wrap: wrap;
        }

        .footer-legal li {
          margin: 0;
        }

        .footer-legal a {
          color: #64b5f6;
          text-decoration: none;
          font-size: 0.85rem;
          transition: color 0.2s ease;
        }

        .footer-legal a:hover {
          color: #90caf9;
          text-decoration: underline;
        }

        @media (max-width: 768px) {
          .cross-site-footer {
            padding: 2rem 1rem 1rem;
          }

          .footer-section-title {
            font-size: 0.9rem;
            margin-bottom: 1rem;
          }

          .footer-links-grid {
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
            gap: 0.75rem;
          }

          .footer-site-link {
            padding: 0.7rem 0.9rem;
            font-size: 0.9rem;
          }

          .footer-legal {
            gap: 1rem;
            flex-direction: column;
          }
        }

        @media (max-width: 480px) {
          .footer-links-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .footer-links-horizontal {
            flex-direction: column;
          }

          .footer-site-link {
            padding: 0.6rem 0.8rem;
            font-size: 0.85rem;
          }

          .footer-copyright {
            font-size: 0.8rem;
            margin-bottom: 0.75rem;
          }

          .footer-legal a {
            font-size: 0.8rem;
          }
        }
      `}</style>
    </footer>
  );
}

export default CrossSiteFooter;

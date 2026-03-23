'use client';

import { useState, useCallback } from 'react';
import { MAJOR_ARCANA } from '@/lib/fortune-data';
import ProductAdBanner from '@/components/ads/ProductAdBanner';

type DrawnCard = {
  id: number;
  name: string;
  nameKo: string;
  emoji: string;
  isReversed: boolean;
  keywords: string;
  meaning: string;
  loveMeaning: string;
  moneyMeaning: string;
  careerMeaning: string;
};

const POSITIONS = ['과거', '현재', '미래'] as const;

const CATEGORIES = [
  { label: '\uD83C\uDF1F 전체', value: 'all' },
  { label: '\u2764\uFE0F 연애', value: 'love' },
  { label: '\uD83D\uDCB0 금전', value: 'money' },
  { label: '\uD83D\uDCBC 직업', value: 'career' },
] as const;

export default function TarotClient() {
  const [selectedCards, setSelectedCards] = useState<DrawnCard[]>([]);
  const [revealedIndices, setRevealedIndices] = useState<Set<number>>(new Set());
  const [shuffledDeck, setShuffledDeck] = useState<typeof MAJOR_ARCANA>([]);
  const [isStarted, setIsStarted] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [category, setCategory] = useState('all');
  const [flippingIndex, setFlippingIndex] = useState<number | null>(null);

  const shuffleDeck = useCallback(() => {
    const shuffled = [...MAJOR_ARCANA];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setShuffledDeck(shuffled);
    setSelectedCards([]);
    setRevealedIndices(new Set());
    setIsStarted(true);
    setShowResult(false);
    setFlippingIndex(null);
  }, []);

  function selectCard(index: number) {
    if (selectedCards.length >= 3) return;
    if (revealedIndices.has(index)) return;

    const card = shuffledDeck[index];
    const isReversed = Math.random() > 0.5;

    setFlippingIndex(index);

    // 카드 뒤집기 애니메이션 후 결과 표시
    setTimeout(() => {
      const drawnCard: DrawnCard = {
        id: card.id,
        name: card.name,
        nameKo: card.nameKo,
        emoji: card.emoji,
        isReversed,
        keywords: isReversed ? card.reversedKeywords : card.uprightKeywords,
        meaning: isReversed ? card.reversedMeaning : card.uprightMeaning,
        loveMeaning: isReversed ? card.loveReversed : card.loveUpright,
        moneyMeaning: isReversed ? card.moneyReversed : card.moneyUpright,
        careerMeaning: isReversed ? card.careerReversed : card.careerUpright,
      };

      const newSelected = [...selectedCards, drawnCard];
      const newRevealed = new Set(revealedIndices);
      newRevealed.add(index);

      setSelectedCards(newSelected);
      setRevealedIndices(newRevealed);
      setFlippingIndex(null);

      if (newSelected.length === 3) {
        setTimeout(() => setShowResult(true), 600);
      }
    }, 600);
  }

  // 카테고리별 해석 가져오기
  function getCategoryMeaning(card: DrawnCard): string {
    if (category === 'love') return card.loveMeaning;
    if (category === 'money') return card.moneyMeaning;
    if (category === 'career') return card.careerMeaning;
    return card.meaning;
  }

  // 종합 해석 생성
  function generateSynthesis(): string {
    if (selectedCards.length < 3) return '';

    const past = selectedCards[0];
    const present = selectedCards[1];
    const future = selectedCards[2];

    const pastDir = past.isReversed ? '역방향' : '정방향';
    const presentDir = present.isReversed ? '역방향' : '정방향';
    const futureDir = future.isReversed ? '역방향' : '정방향';

    return `과거에 ${pastDir} '${past.nameKo}' 카드가 나타났습니다. ${past.keywords}의 에너지가 당신의 과거에 영향을 미쳤음을 보여줍니다. ` +
      `현재는 ${presentDir} '${present.nameKo}' 카드로, ${present.keywords}의 흐름 속에 있습니다. 이 에너지를 잘 활용하세요. ` +
      `미래에는 ${futureDir} '${future.nameKo}' 카드가 기다리고 있습니다. ${future.keywords}이(가) 당신의 앞길에 펼쳐질 것입니다. ` +
      `전체적으로 과거의 경험을 바탕으로 현재에 충실하면 밝은 미래를 만들 수 있습니다.`;
  }

  return (
    <div>
      <div className="page-header">
        <div className="page-icon">{'\uD83C\uDCCF'}</div>
        <h1>{'타로카드 운세 - AI 타로 리딩'}</h1>
        <p>{'마음을 가다듬고 카드 3장을 선택하세요'}</p>
      </div>

      <div className="tarot-spread">
        {!isStarted ? (
          <>
            <p className="tarot-instruction">
              {'질문 카테고리를 선택하고, 마음을 고요히 한 후 카드를 셔플해주세요.'}
            </p>

            {/* 카테고리 선택 */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  className={`dream-tag ${category === cat.value ? 'active' : ''}`}
                  onClick={() => setCategory(cat.value)}
                  aria-pressed={category === cat.value}
                  style={
                    category === cat.value
                      ? { borderColor: 'var(--color-cta)', background: 'rgba(139, 92, 246, 0.12)', color: 'var(--color-text)' }
                      : undefined
                  }
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <button className="submit-btn" onClick={shuffleDeck}>
              {'\uD83C\uDCCF 카드 셔플하기'}
            </button>
          </>
        ) : (
          <>
            <p className="tarot-instruction">
              {selectedCards.length < 3
                ? `직감으로 카드를 선택해주세요 (${selectedCards.length}/3)`
                : '모든 카드가 선택되었습니다'}
            </p>

            {/* 카드 덱 */}
            <div className="tarot-deck">
              {shuffledDeck.map((card, i) => (
                <button
                  key={card.id}
                  type="button"
                  className={`tarot-card-slot ${revealedIndices.has(i) ? 'revealed' : ''} ${flippingIndex === i ? 'flipping' : ''}`}
                  onClick={() => selectCard(i)}
                  aria-label={revealedIndices.has(i) ? `${card.nameKo} 카드` : `타로 카드 ${i + 1}번 선택`}
                  disabled={revealedIndices.has(i) || selectedCards.length >= 3}
                >
                  {revealedIndices.has(i) ? (
                    <div className="card-face">
                      <span className="card-emoji" style={
                        selectedCards.find(c => c.id === card.id)?.isReversed
                          ? { transform: 'rotate(180deg)' }
                          : undefined
                      }>{card.emoji}</span>
                      <span className="card-name">{card.nameKo}</span>
                      {selectedCards.find(c => c.id === card.id)?.isReversed && (
                        <span style={{ fontSize: '0.5rem', color: '#f87171' }}>{'역방향'}</span>
                      )}
                    </div>
                  ) : (
                    <span className="card-back">{'\u2728'}</span>
                  )}
                </button>
              ))}
            </div>

            {/* 선택된 카드 3장 표시 */}
            {showResult && selectedCards.length === 3 && (
              <div className="tarot-selected">
                {selectedCards.map((card, i) => (
                  <div key={card.id} className="tarot-result-card">
                    <div className="card-position">{POSITIONS[i]}</div>
                    <div className="card-image" style={card.isReversed ? { transform: 'rotate(180deg)' } : undefined}>
                      {card.emoji}
                    </div>
                    <h3>{card.nameKo}</h3>
                    <div style={{
                      display: 'inline-block',
                      padding: '0.1875rem 0.5rem',
                      borderRadius: '9999px',
                      fontSize: '0.6875rem',
                      fontWeight: 600,
                      marginBottom: '0.5rem',
                      background: card.isReversed
                        ? 'rgba(248, 113, 113, 0.15)'
                        : 'rgba(52, 211, 153, 0.15)',
                      color: card.isReversed ? '#f87171' : '#34d399',
                    }}>
                      {card.isReversed ? '\u21BB 역방향' : '\u2191 정방향'}
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-accent)', marginBottom: '0.375rem' }}>
                      {card.keywords}
                    </p>
                    <p className="card-meaning">{getCategoryMeaning(card)}</p>
                  </div>
                ))}
              </div>
            )}

            {/* 종합 해석 */}
            {showResult && (
              <div className="result-panel" style={{ maxWidth: '36rem', width: '100%' }} aria-live="polite">
                <h2>{'타로 종합 해석'}</h2>
                <div className="result-content">
                  <p>{generateSynthesis()}</p>
                </div>
              </div>
            )}

            {showResult && (
              <>
                {/* 행운 아이템 상품 추천 */}
                <ProductAdBanner
                  context={{ type: 'tarot', tarotCardName: selectedCards[0]?.nameKo }}
                  icon="🃏"
                  title="타로 카드가 추천하는 행운 아이템"
                  desc="오늘의 타로 에너지를 일상에서도 느껴보세요"
                />

                <button className="submit-btn" onClick={shuffleDeck} style={{ marginTop: '1rem' }}>
                  {'\uD83D\uDD04 다시 뽑기'}
                </button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

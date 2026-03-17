import { NextResponse } from 'next/server';
import { MAJOR_ARCANA } from '@/lib/fortune-data';

/**
 * GET /api/tarot?count=3&category=all
 * 타로 카드 뽑기 API - 정방향/역방향 포함
 */

function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const countParam = searchParams.get('count');
  const category = searchParams.get('category') || 'all';
  const count = Math.min(Math.max(parseInt(countParam || '3', 10), 1), 10);

  const shuffled = shuffle(MAJOR_ARCANA);
  const selected = shuffled.slice(0, count).map((card) => {
    const isReversed = Math.random() > 0.5;

    // 카테고리별 해석 선택
    let meaning: string;
    let keywords: string;
    if (category === 'love') {
      meaning = isReversed ? card.loveReversed : card.loveUpright;
      keywords = isReversed ? card.reversedKeywords : card.uprightKeywords;
    } else if (category === 'money') {
      meaning = isReversed ? card.moneyReversed : card.moneyUpright;
      keywords = isReversed ? card.reversedKeywords : card.uprightKeywords;
    } else if (category === 'career') {
      meaning = isReversed ? card.careerReversed : card.careerUpright;
      keywords = isReversed ? card.reversedKeywords : card.uprightKeywords;
    } else {
      meaning = isReversed ? card.reversedMeaning : card.uprightMeaning;
      keywords = isReversed ? card.reversedKeywords : card.uprightKeywords;
    }

    return {
      id: card.id,
      name: card.name,
      nameKo: card.nameKo,
      emoji: card.emoji,
      isReversed,
      direction: isReversed ? 'reversed' : 'upright',
      keywords,
      meaning,
    };
  });

  return NextResponse.json({
    category,
    cards: selected,
    drawnAt: new Date().toISOString(),
  });
}

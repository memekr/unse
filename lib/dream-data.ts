/**
 * dream-data.ts - 꿈해몽 데이터베이스 (50개+ 키워드)
 */

export type DreamEntry = {
  keyword: string;
  emoji: string;
  meaning: string;
  luckyNumber: number;
  category: '동물' | '자연' | '사람' | '사물' | '상황' | '숫자';
};

export const DREAM_DATABASE: DreamEntry[] = [
  // ── 동물 (15개) ──
  { keyword: '뱀', emoji: '\uD83D\uDC0D', meaning: '뱀 꿈은 재물운을 상징합니다. 특히 큰 뱀이 나타나면 큰 재물이 들어올 징조이며, 뱀에게 물리는 꿈은 예상치 못한 행운을 의미합니다. 뱀이 집에 들어오면 가정에 경사가 있을 수 있습니다.', luckyNumber: 7, category: '동물' },
  { keyword: '돼지', emoji: '\uD83D\uDC37', meaning: '돼지 꿈은 재물과 풍요를 상징합니다. 돼지를 안는 꿈은 큰 재물이 들어올 징조이며, 임신의 길몽일 수도 있습니다. 돼지가 많을수록 재물의 규모가 커집니다.', luckyNumber: 3, category: '동물' },
  { keyword: '개', emoji: '\uD83D\uDC36', meaning: '개 꿈은 충성과 우정을 상징합니다. 개가 따르면 충실한 조력자가 나타날 징조이며, 물리면 배신을 조심하라는 경고입니다. 강아지 꿈은 새로운 시작을 의미합니다.', luckyNumber: 10, category: '동물' },
  { keyword: '고양이', emoji: '\uD83D\uDC31', meaning: '고양이 꿈은 직관과 독립을 상징합니다. 고양이가 다가오면 비밀이 드러날 수 있고, 고양이를 안는 꿈은 예민한 감각이 필요한 시기임을 알립니다. 검은 고양이는 변화의 전조입니다.', luckyNumber: 13, category: '동물' },
  { keyword: '용', emoji: '\uD83D\uDC09', meaning: '용 꿈은 최고의 길몽 중 하나입니다. 큰 성공과 출세를 상징하며, 하늘로 오르는 용은 목표 달성을, 물속의 용은 잠재력이 곧 발현됨을 의미합니다.', luckyNumber: 1, category: '동물' },
  { keyword: '물고기', emoji: '\uD83D\uDC1F', meaning: '물고기 꿈은 재물과 기회를 상징합니다. 큰 물고기를 잡으면 큰 이득이, 물고기가 뛰어오르면 승진이나 합격을 의미합니다. 죽은 물고기는 기회를 놓칠 수 있음을 경고합니다.', luckyNumber: 6, category: '동물' },
  { keyword: '호랑이', emoji: '\uD83D\uDC2F', meaning: '호랑이 꿈은 권력과 용기를 상징합니다. 호랑이를 타면 큰 권력을 얻을 수 있고, 호랑이에게 쫓기면 강력한 경쟁자를 만날 수 있습니다. 호랑이가 순한 꿈은 협력자를 얻는 길몽입니다.', luckyNumber: 9, category: '동물' },
  { keyword: '새', emoji: '\uD83D\uDC26', meaning: '새 꿈은 자유와 소식을 상징합니다. 새가 날아오면 좋은 소식이, 새가 지저귀면 기쁜 일이 생길 징조입니다. 새가 집에 들어오면 경사가 있을 수 있습니다.', luckyNumber: 5, category: '동물' },
  { keyword: '거북이', emoji: '\uD83D\uDC22', meaning: '거북이 꿈은 장수와 안정을 상징합니다. 거북이를 보는 꿈은 건강운이 좋아지는 징조이며, 거북이를 안으면 재물이 들어옵니다. 느리지만 확실한 성공을 의미합니다.', luckyNumber: 8, category: '동물' },
  { keyword: '말', emoji: '\uD83D\uDC0E', meaning: '말 꿈은 활력과 전진을 상징합니다. 말을 타면 승진이나 출세를, 달리는 말은 일이 순조롭게 풀림을 의미합니다. 백마는 특별한 행운의 상징입니다.', luckyNumber: 2, category: '동물' },
  { keyword: '소', emoji: '\uD83D\uDC02', meaning: '소 꿈은 근면과 재물을 상징합니다. 소가 집에 들어오면 재물이 들어오는 길몽이며, 소가 풀을 뜯는 꿈은 안정적인 수입을 의미합니다.', luckyNumber: 4, category: '동물' },
  { keyword: '나비', emoji: '\uD83E\uDD8B', meaning: '나비 꿈은 변화와 아름다움을 상징합니다. 나비가 날아오면 좋은 변화가, 많은 나비는 기쁜 소식이 여러 개 올 것을 의미합니다. 연인 관련 좋은 꿈입니다.', luckyNumber: 11, category: '동물' },
  { keyword: '곰', emoji: '\uD83D\uDC3B', meaning: '곰 꿈은 힘과 보호를 상징합니다. 곰이 순하면 강력한 후원자를 만날 수 있고, 곰에게 쫓기면 큰 도전에 직면할 수 있습니다. 아기 곰은 새로운 프로젝트의 시작입니다.', luckyNumber: 15, category: '동물' },
  { keyword: '토끼', emoji: '\uD83D\uDC30', meaning: '토끼 꿈은 행운과 다산을 상징합니다. 토끼를 잡으면 뜻밖의 행운이, 토끼가 뛰어다니면 활기찬 시기가 올 것을 의미합니다.', luckyNumber: 12, category: '동물' },
  { keyword: '코끼리', emoji: '\uD83D\uDC18', meaning: '코끼리 꿈은 부와 지혜를 상징합니다. 코끼리를 타면 높은 지위에 오를 수 있고, 코끼리를 보는 것만으로도 길몽입니다. 큰 행운이 다가오는 징조입니다.', luckyNumber: 14, category: '동물' },

  // ── 자연 (12개) ──
  { keyword: '물', emoji: '\uD83C\uDF0A', meaning: '물이 맑으면 좋은 징조이고, 흐린 물은 감정적 혼란을 나타냅니다. 물이 차오르는 꿈은 재물운이 상승하는 의미이며, 깨끗한 물을 마시는 꿈은 건강운이 좋아짐을 뜻합니다.', luckyNumber: 6, category: '자연' },
  { keyword: '불', emoji: '\uD83D\uDD25', meaning: '불꿈은 열정과 변화를 상징합니다. 타오르는 불은 성공의 전조이며, 불이 꺼지는 꿈은 끝과 새로운 시작을 의미합니다. 모닥불은 따뜻한 인간관계를 상징합니다.', luckyNumber: 9, category: '자연' },
  { keyword: '산', emoji: '\u26F0\uFE0F', meaning: '산을 오르는 꿈은 목표 달성을 의미합니다. 산 정상에 도달하면 큰 성취를, 산에서 내려오면 난관 후 해결을 나타냅니다. 높은 산일수록 큰 목표를 상징합니다.', luckyNumber: 1, category: '자연' },
  { keyword: '꽃', emoji: '\uD83C\uDF38', meaning: '꽃 꿈은 사랑과 기쁨을 상징합니다. 꽃이 피는 꿈은 새로운 연인이나 좋은 소식을, 꽃이 지는 꿈은 이별을 의미할 수 있습니다. 꽃다발을 받는 꿈은 축하받을 일이 생깁니다.', luckyNumber: 2, category: '자연' },
  { keyword: '바다', emoji: '\uD83C\uDF0A', meaning: '바다 꿈은 감정의 상태를 반영합니다. 잔잔한 바다는 평화를, 거친 바다는 감정적 혼란을 나타냅니다. 바다에서 수영하면 자유를 갈망하는 마음의 표현입니다.', luckyNumber: 6, category: '자연' },
  { keyword: '비', emoji: '\uD83C\uDF27\uFE0F', meaning: '비 꿈은 정화와 새로운 시작을 의미합니다. 고민이나 근심이 해소될 조짐이며 재물운도 따릅니다. 폭우는 큰 변화가, 이슬비는 작은 행운이 올 것을 뜻합니다.', luckyNumber: 12, category: '자연' },
  { keyword: '별', emoji: '\u2B50', meaning: '별 꿈은 희망과 소원 성취를 상징합니다. 밝은 별은 좋은 길몽이며, 별똑별은 특별한 행운을 의미합니다. 별이 떨어지는 꿈은 소원이 이루어질 수 있는 징조입니다.', luckyNumber: 7, category: '자연' },
  { keyword: '달', emoji: '\uD83C\uDF15', meaning: '달 꿈은 여성성과 직관을 상징합니다. 보름달은 소원 성취를, 초승달은 새로운 시작을 의미합니다. 달빛이 비치는 꿈은 진실이 밝혀질 것을 암시합니다.', luckyNumber: 15, category: '자연' },
  { keyword: '나무', emoji: '\uD83C\uDF33', meaning: '나무 꿈은 성장과 안정을 상징합니다. 푸른 나무는 건강과 번영을, 쓰러지는 나무는 변화의 시기를 의미합니다. 꽃이 핀 나무는 경사가 있을 징조입니다.', luckyNumber: 3, category: '자연' },
  { keyword: '눈', emoji: '\u2744\uFE0F', meaning: '눈 꿈은 순수함과 새로운 시작을 상징합니다. 하얀 눈이 내리면 마음이 정화되고, 눈 위를 걸으면 새로운 길이 열립니다. 눈사람은 즐거운 추억을 의미합니다.', luckyNumber: 4, category: '자연' },
  { keyword: '태양', emoji: '\u2600\uFE0F', meaning: '태양 꿈은 성공과 명예를 상징합니다. 떠오르는 태양은 새로운 시작과 희망을, 밝게 빛나는 태양은 출세와 성공을 의미합니다. 태양을 삼키는 꿈은 큰 권력을 상징합니다.', luckyNumber: 1, category: '자연' },
  { keyword: '무지개', emoji: '\uD83C\uDF08', meaning: '무지개 꿈은 희망과 행운의 상징입니다. 무지개가 나타나면 어려운 시기가 끝나고 좋은 일이 시작됩니다. 쌍무지개는 이중의 행운을 뜻합니다.', luckyNumber: 7, category: '자연' },

  // ── 사람 (8개) ──
  { keyword: '아기', emoji: '\uD83D\uDC76', meaning: '아기 꿈은 새로운 시작과 가능성을 상징합니다. 사업의 새로운 시작이나 창의적인 아이디어를 의미합니다. 아기가 웃으면 기쁜 소식이, 아기가 울면 관심이 필요한 일이 있습니다.', luckyNumber: 4, category: '사람' },
  { keyword: '돌아가신 분', emoji: '\uD83D\uDE07', meaning: '돌아가신 분을 만나는 꿈은 그 분의 보호와 인도를 받고 있음을 의미합니다. 무언가를 주시면 재물운이, 대화를 나누면 중요한 메시지가 담겨있을 수 있습니다.', luckyNumber: 9, category: '사람' },
  { keyword: '연예인', emoji: '\uD83C\uDF1F', meaning: '연예인 꿈은 성공과 인정에 대한 욕구를 반영합니다. 연예인과 친하게 지내면 사회적 지위 상승을, 연예인이 되는 꿈은 숨겨진 재능의 발현을 의미합니다.', luckyNumber: 11, category: '사람' },
  { keyword: '어머니', emoji: '\uD83E\uDDD1', meaning: '어머니 꿈은 보호와 안정을 상징합니다. 어머니가 웃으시면 가정에 평화가, 어머니가 우시면 가족에게 관심이 필요합니다. 어머니의 요리를 먹는 꿈은 그리움과 치유를 의미합니다.', luckyNumber: 2, category: '사람' },
  { keyword: '아이', emoji: '\uD83D\uDC67', meaning: '아이와 노는 꿈은 순수한 기쁨과 창의력을 상징합니다. 아이가 밝게 웃으면 좋은 소식이, 아이를 돌보는 꿈은 새로운 책임이 생길 수 있습니다.', luckyNumber: 5, category: '사람' },
  { keyword: '임신', emoji: '\uD83E\uDD30', meaning: '임신 꿈은 새로운 프로젝트나 아이디어의 탄생을 상징합니다. 실제 임신이 아니더라도 창조적인 에너지가 넘치는 시기를 의미합니다. 큰 성과를 앞두고 있습니다.', luckyNumber: 8, category: '사람' },
  { keyword: '결혼', emoji: '\uD83D\uDC8D', meaning: '결혼 꿈은 새로운 파트너십이나 결합을 상징합니다. 실제 결혼 예정이 아니어도 중요한 계약이나 협력이 성사될 수 있습니다. 행복한 결혼식은 성공적인 합의를 의미합니다.', luckyNumber: 2, category: '사람' },
  { keyword: '친구', emoji: '\uD83E\uDD1D', meaning: '친구 꿈은 인간관계와 사회적 연결을 상징합니다. 오래된 친구를 만나면 과거의 인연이 도움이 될 수 있고, 새 친구를 사귀면 새로운 기회가 열립니다.', luckyNumber: 6, category: '사람' },

  // ── 사물 (10개) ──
  { keyword: '돈', emoji: '\uD83D\uDCB0', meaning: '돈을 줍는 꿈은 역설적으로 재물 손실을 의미할 수 있습니다. 반대로 돈을 잃는 꿈은 예상치 못한 수익을 의미합니다. 돈을 세는 꿈은 재정 관리에 신경 써야 합니다.', luckyNumber: 8, category: '사물' },
  { keyword: '차', emoji: '\uD83D\uDE97', meaning: '차 꿈은 인생의 방향과 진행을 상징합니다. 운전하는 꿈은 주도권을, 사고 꿈은 방향 전환의 필요성을 나타냅니다. 새 차는 새로운 시작을 의미합니다.', luckyNumber: 4, category: '사물' },
  { keyword: '집', emoji: '\uD83C\uDFE0', meaning: '집 꿈은 자아와 가정을 상징합니다. 새 집은 새로운 시작을, 허물어지는 집은 변화의 필요성을 나타냅니다. 넓은 집은 마음의 여유를, 좁은 집은 압박감을 의미합니다.', luckyNumber: 1, category: '사물' },
  { keyword: '비행기', emoji: '\u2708\uFE0F', meaning: '비행기 꿈은 새로운 기회와 모험을 상징합니다. 비행기를 타는 꿈은 큰 변화가 올 징조입니다. 이륙은 새로운 시작을, 착륙은 목표 달성을 의미합니다.', luckyNumber: 11, category: '사물' },
  { keyword: '시계', emoji: '\u23F0', meaning: '시계 꿈은 시간과 기회를 상징합니다. 시계가 멈추면 현재에 집중하라는 메시지이며, 빨리 가는 시계는 기회를 놓치지 말라는 경고입니다. 선물 받는 시계는 좋은 인연을 뜻합니다.', luckyNumber: 12, category: '사물' },
  { keyword: '열쇠', emoji: '\uD83D\uDD11', meaning: '열쇠 꿈은 해결과 기회를 상징합니다. 열쇠를 찾으면 문제의 해답을 발견할 수 있고, 열쇠를 잃으면 기회를 놓칠 수 있습니다. 황금 열쇠는 큰 기회의 상징입니다.', luckyNumber: 7, category: '사물' },
  { keyword: '거울', emoji: '\uD83E\uDE9E', meaning: '거울 꿈은 자기 성찰을 상징합니다. 깨끗한 거울은 자기 인식이 명확함을, 깨진 거울은 자아상의 변화가 필요함을 의미합니다. 거울 속 다른 모습은 숨겨진 자아를 상징합니다.', luckyNumber: 3, category: '사물' },
  { keyword: '시험', emoji: '\uD83D\uDCDD', meaning: '시험 꿈은 삶의 평가를 받는 상황을 반영합니다. 시험에 떨어지는 꿈은 자기 향상의 욕구를 나타냅니다. 시험에 합격하면 곧 좋은 결과를 얻을 수 있습니다.', luckyNumber: 5, category: '사물' },
  { keyword: '월급', emoji: '\uD83D\uDCB0', meaning: '월급 꿈은 자기 가치에 대한 평가를 반영합니다. 월급이 오르는 꿈은 성장과 인정을 의미합니다. 월급을 못 받는 꿈은 노력에 대한 보상을 기대해도 좋습니다.', luckyNumber: 8, category: '사물' },
  { keyword: '반지', emoji: '\uD83D\uDC8D', meaning: '반지 꿈은 약속과 결속을 상징합니다. 반지를 받으면 중요한 약속이나 인연이 맺어질 수 있고, 반지를 잃으면 관계의 변화에 주의하세요. 다이아몬드 반지는 큰 행운입니다.', luckyNumber: 14, category: '사물' },

  // ── 상황 (8개) ──
  { keyword: '죽음', emoji: '\uD83E\uDEB6', meaning: '죽음 꿈은 역설적으로 재생과 변화를 의미합니다. 나쁜 꿈처럼 느껴지지만 새로운 시작의 전조입니다. 자신의 죽음은 큰 변화를, 타인의 죽음은 관계의 변화를 의미합니다.', luckyNumber: 13, category: '상황' },
  { keyword: '추락', emoji: '\uD83D\uDCA8', meaning: '떨어지는 꿈은 불안감이나 통제력 상실을 반영합니다. 하지만 추락 후 안전하게 착지하면 어려움을 극복할 수 있음을 의미합니다. 스카이다이빙은 용기 있는 도전의 상징입니다.', luckyNumber: 10, category: '상황' },
  { keyword: '날기', emoji: '\uD83E\uDD85', meaning: '하늘을 나는 꿈은 자유와 해방을 상징합니다. 높이 날수록 큰 성공을, 자유롭게 날면 현재의 제약에서 벗어날 수 있음을 의미합니다. 매우 긍정적인 꿈입니다.', luckyNumber: 1, category: '상황' },
  { keyword: '쫓김', emoji: '\uD83C\uDFC3', meaning: '쫓기는 꿈은 현실에서 피하고 싶은 것이 있음을 반영합니다. 두려움을 직면하면 해결의 실마리를 찾을 수 있습니다. 도망 후 숨는 꿈은 잠시 쉬어야 함을 의미합니다.', luckyNumber: 5, category: '상황' },
  { keyword: '이사', emoji: '\uD83D\uDCE6', meaning: '이사 꿈은 삶의 변화와 전환을 상징합니다. 좋은 집으로 이사하면 상황이 개선될 징조이며, 이사 과정이 순탄하면 변화가 순조로울 것입니다.', luckyNumber: 3, category: '상황' },
  { keyword: '싸움', emoji: '\uD83E\uDD4A', meaning: '싸우는 꿈은 내면의 갈등을 반영합니다. 싸움에서 이기면 문제를 극복할 수 있고, 지면 자기 성찰이 필요합니다. 화해하는 꿈은 갈등이 해소됨을 의미합니다.', luckyNumber: 9, category: '상황' },
  { keyword: '수영', emoji: '\uD83C\uDFCA', meaning: '수영 꿈은 감정의 흐름과 적응을 상징합니다. 자유롭게 수영하면 감정 조절이 잘 되고, 물에 빠지면 감정에 압도될 수 있습니다. 경영하는 꿈은 인생의 방향을 잘 잡고 있음을 의미합니다.', luckyNumber: 6, category: '상황' },
  { keyword: '시험합격', emoji: '\uD83C\uDF89', meaning: '합격 꿈은 노력의 결실을 의미합니다. 곧 좋은 소식이 올 수 있으며, 인정과 보상을 받을 징조입니다. 자신감을 가지고 도전하면 좋은 결과가 있을 것입니다.', luckyNumber: 1, category: '상황' },

  // ── 숫자 (5개) ──
  { keyword: '숫자 3', emoji: '\u0033\uFE0F\u20E3', meaning: '3이 나오는 꿈은 창의력과 소통을 상징합니다. 세 가지 선택지가 있을 수 있으며, 표현력이 필요한 시기입니다. 숫자 3은 삼위일체, 완성의 숫자입니다.', luckyNumber: 3, category: '숫자' },
  { keyword: '숫자 7', emoji: '\u0037\uFE0F\u20E3', meaning: '7이 나오는 꿈은 영적 성장과 행운을 상징합니다. 직관을 믿어야 할 때이며, 신비로운 경험을 할 수 있습니다. 행운의 숫자로 로또에 행운이 있을 수 있습니다.', luckyNumber: 7, category: '숫자' },
  { keyword: '숫자 8', emoji: '\u0038\uFE0F\u20E3', meaning: '8이 나오는 꿈은 풍요와 성공을 상징합니다. 재물운이 상승하고 사업에 좋은 기회가 올 수 있습니다. 무한대(∞)와 같은 모양으로 끝없는 가능성을 의미합니다.', luckyNumber: 8, category: '숫자' },
  { keyword: '숫자 9', emoji: '\u0039\uFE0F\u20E3', meaning: '9가 나오는 꿈은 완성과 마무리를 상징합니다. 한 단계가 끝나고 새로운 시작이 다가오고 있습니다. 지금까지의 노력이 결실을 맺을 때입니다.', luckyNumber: 9, category: '숫자' },
  { keyword: '숫자 1', emoji: '\u0031\uFE0F\u20E3', meaning: '1이 나오는 꿈은 새로운 시작과 독립을 상징합니다. 리더십을 발휘할 기회가 오고 있으며, 자신만의 길을 개척해야 할 시기입니다.', luckyNumber: 1, category: '숫자' },
];

// 로또 번호 추천 (꿈 키워드 기반)
export function generateLottoNumbers(keywords: string[], seed: number): number[] {
  let s = seed;
  const rng = () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s;
  };

  // 키워드의 행운의 숫자를 기반으로
  const baseNumbers = keywords
    .map(k => DREAM_DATABASE.find(d => d.keyword === k)?.luckyNumber)
    .filter((n): n is number => n !== undefined && n >= 1 && n <= 45);

  const numbers = new Set<number>(baseNumbers.slice(0, 3));

  // 나머지는 시드 기반 랜덤
  while (numbers.size < 6) {
    const num = (rng() % 45) + 1;
    numbers.add(num);
  }

  return Array.from(numbers).sort((a, b) => a - b);
}

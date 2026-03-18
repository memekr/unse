/**
 * dream-data.ts - 꿈해몽 데이터베이스 (200개+ 키워드)
 */

export type DreamEntry = {
  keyword: string;
  emoji: string;
  meaning: string;
  luckyNumber: number;
  category: '동물' | '자연' | '사람' | '사물' | '상황' | '숫자';
};

export const DREAM_DATABASE: DreamEntry[] = [
  // ══════════════════════════════════════════
  // 동물 (45개)
  // ══════════════════════════════════════════
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
  // 동물 추가 30개
  { keyword: '거미', emoji: '\uD83D\uDD77\uFE0F', meaning: '거미 꿈은 창조와 인내를 상징합니다. 거미줄을 치는 꿈은 치밀한 계획이 성공할 징조이며, 거미에게 물리는 꿈은 주변의 음모를 조심하라는 경고입니다. 전통적으로 거미는 재물을 모으는 길몽으로 해석됩니다.', luckyNumber: 17, category: '동물' },
  { keyword: '개미', emoji: '\uD83D\uDC1C', meaning: '개미 꿈은 근면과 협동을 상징합니다. 개미떼를 보는 꿈은 조직적인 노력이 보상받을 징조이며, 집 안의 개미는 작지만 꾸준한 재물이 모일 것을 의미합니다. 심리학적으로 팀워크의 중요성을 일깨웁니다.', luckyNumber: 22, category: '동물' },
  { keyword: '벌', emoji: '\uD83D\uDC1D', meaning: '벌 꿈은 부지런함과 달콤한 보상을 상징합니다. 꿀벌을 보는 꿈은 노력에 대한 좋은 대가가 돌아올 징조이며, 벌에 쏘이는 꿈은 경쟁자의 공격을 주의하라는 뜻입니다. 벌집은 풍요로운 가정을 의미합니다.', luckyNumber: 33, category: '동물' },
  { keyword: '사자', emoji: '\uD83E\uDD81', meaning: '사자 꿈은 위엄과 리더십을 상징합니다. 사자를 마주하면 강한 권위자를 만날 수 있으며, 사자를 길들이는 꿈은 어려운 상황을 극복할 힘이 있음을 의미합니다. 사자가 포효하면 중요한 소식이 옵니다.', luckyNumber: 19, category: '동물' },
  { keyword: '독수리', emoji: '\uD83E\uDD85', meaning: '독수리 꿈은 높은 시야와 성취를 상징합니다. 독수리가 하늘을 나는 꿈은 큰 목표를 달성할 수 있음을 뜻하며, 먹이를 채는 모습은 기회를 정확히 포착할 수 있음을 의미합니다.', luckyNumber: 35, category: '동물' },
  { keyword: '까마귀', emoji: '\uD83D\uDC26\u200D\u2B1B', meaning: '까마귀 꿈은 전통적으로 소식과 변화를 상징합니다. 까마귀가 우는 꿈은 예상치 못한 변화가 올 수 있으나, 한국 전통에서 까마귀는 효도의 새로 좋은 뜻도 담고 있습니다. 직관을 믿어야 할 때입니다.', luckyNumber: 27, category: '동물' },
  { keyword: '비둘기', emoji: '\uD83D\uDD4A\uFE0F', meaning: '비둘기 꿈은 평화와 화해를 상징합니다. 흰 비둘기가 날아오면 좋은 소식과 화목한 인간관계를 뜻하며, 비둘기 한 쌍은 연인 간의 행복한 미래를 의미합니다. 갈등이 해소될 징조입니다.', luckyNumber: 20, category: '동물' },
  { keyword: '쥐', emoji: '\uD83D\uDC2D', meaning: '쥐 꿈은 재물과 기민함을 상징합니다. 쥐가 곡식을 물고 가는 꿈은 재물이 늘어날 징조이며, 쥐떼를 보는 꿈은 사소한 걱정거리가 생길 수 있습니다. 흰 쥐는 특히 길몽으로, 재물운 상승을 뜻합니다.', luckyNumber: 16, category: '동물' },
  { keyword: '학', emoji: '\uD83E\uDDA2', meaning: '학 꿈은 장수와 고귀함을 상징합니다. 학이 날아오는 꿈은 귀한 인연을 만나거나 명예가 높아질 징조입니다. 전통적으로 학은 신선의 동물로, 큰 복을 의미합니다.', luckyNumber: 21, category: '동물' },
  { keyword: '매', emoji: '\uD83E\uDD85', meaning: '매 꿈은 날카로운 판단력과 기회 포착을 상징합니다. 매가 먹이를 잡는 꿈은 목표를 정확히 달성할 수 있음을 뜻하며, 매를 손에 올리는 꿈은 권력이나 지위를 얻을 수 있는 길몽입니다.', luckyNumber: 28, category: '동물' },
  { keyword: '올빼미', emoji: '\uD83E\uDD89', meaning: '올빼미 꿈은 지혜와 통찰을 상징합니다. 올빼미가 나타나면 숨겨진 진실을 발견할 수 있으며, 밤에 올빼미를 보는 꿈은 직관력이 높아지는 시기임을 뜻합니다. 학문이나 연구에 좋은 시기입니다.', luckyNumber: 31, category: '동물' },
  { keyword: '지네', emoji: '\uD83D\uDC1B', meaning: '지네 꿈은 재물과 변화를 상징합니다. 한국 전통에서 지네는 재물신의 사자로, 지네를 보는 꿈은 예상치 못한 금전적 이득을 의미합니다. 다만 지네에게 물리는 꿈은 시비에 주의하라는 경고입니다.', luckyNumber: 38, category: '동물' },
  { keyword: '개구리', emoji: '\uD83D\uDC38', meaning: '개구리 꿈은 변신과 풍요를 상징합니다. 개구리가 우는 꿈은 비가 올 것처럼 재물이 늘어날 징조이며, 개구리가 뛰어오르는 꿈은 도약과 성장을 의미합니다. 풍요로운 시기가 다가옵니다.', luckyNumber: 24, category: '동물' },
  { keyword: '게', emoji: '\uD83E\uDD80', meaning: '게 꿈은 방어와 자기 보호를 상징합니다. 게를 잡는 꿈은 작지만 확실한 이득을 얻을 징조이며, 게가 옆으로 걷는 모습은 우회적인 접근이 필요한 상황을 뜻합니다. 인내가 필요한 시기입니다.', luckyNumber: 29, category: '동물' },
  { keyword: '상어', emoji: '\uD83E\uDD88', meaning: '상어 꿈은 강한 경쟁자와 위험을 상징합니다. 상어에게 쫓기는 꿈은 직장이나 사업에서 강력한 경쟁자가 나타날 수 있음을 경고하지만, 상어를 물리치면 큰 성취를 이룰 수 있습니다.', luckyNumber: 36, category: '동물' },
  { keyword: '고래', emoji: '\uD83D\uDC33', meaning: '고래 꿈은 큰 행운과 풍요를 상징합니다. 고래를 보는 꿈은 대규모의 행운이 다가올 징조이며, 고래가 물을 뿜는 꿈은 재물이 넘쳐날 것을 의미합니다. 규모가 큰 일에서 성공할 수 있습니다.', luckyNumber: 44, category: '동물' },
  { keyword: '돌고래', emoji: '\uD83D\uDC2C', meaning: '돌고래 꿈은 즐거움과 지혜를 상징합니다. 돌고래와 함께 수영하는 꿈은 행복한 시기가 올 것을 뜻하며, 돌고래가 뛰어오르는 꿈은 활기찬 에너지와 좋은 인간관계를 의미합니다.', luckyNumber: 23, category: '동물' },
  { keyword: '원숭이', emoji: '\uD83D\uDC35', meaning: '원숭이 꿈은 영리함과 장난기를 상징합니다. 원숭이가 재주를 부리는 꿈은 지혜로운 해결책을 찾을 수 있음을 뜻하며, 원숭이를 안는 꿈은 자녀운이나 임신 관련 좋은 소식이 있을 수 있습니다.', luckyNumber: 25, category: '동물' },
  { keyword: '여우', emoji: '\uD83E\uDD8A', meaning: '여우 꿈은 영특함과 변화를 상징합니다. 여우를 보는 꿈은 교묘한 상황에 처할 수 있음을 경고하지만, 한국 전통에서 구미호는 강한 영적 존재로 큰 변화를 예고합니다. 사람을 볼 때 신중함이 필요합니다.', luckyNumber: 39, category: '동물' },

  // ══════════════════════════════════════════
  // 자연 (37개)
  // ══════════════════════════════════════════
  { keyword: '물', emoji: '\uD83C\uDF0A', meaning: '물이 맑으면 좋은 징조이고, 흐린 물은 감정적 혼란을 나타냅니다. 물이 차오르는 꿈은 재물운이 상승하는 의미이며, 깨끗한 물을 마시는 꿈은 건강운이 좋아짐을 뜻합니다.', luckyNumber: 6, category: '자연' },
  { keyword: '불', emoji: '\uD83D\uDD25', meaning: '불꿈은 열정과 변화를 상징합니다. 타오르는 불은 성공의 전조이며, 불이 꺼지는 꿈은 끝과 새로운 시작을 의미합니다. 모닥불은 따뜻한 인간관계를 상징합니다.', luckyNumber: 9, category: '자연' },
  { keyword: '산', emoji: '\u26F0\uFE0F', meaning: '산을 오르는 꿈은 목표 달성을 의미합니다. 산 정상에 도달하면 큰 성취를, 산에서 내려오면 난관 후 해결을 나타냅니다. 높은 산일수록 큰 목표를 상징합니다.', luckyNumber: 1, category: '자연' },
  { keyword: '꽃', emoji: '\uD83C\uDF38', meaning: '꽃 꿈은 사랑과 기쁨을 상징합니다. 꽃이 피는 꿈은 새로운 연인이나 좋은 소식을, 꽃이 지는 꿈은 이별을 의미할 수 있습니다. 꽃다발을 받는 꿈은 축하받을 일이 생깁니다.', luckyNumber: 2, category: '자연' },
  { keyword: '바다', emoji: '\uD83C\uDF0A', meaning: '바다 꿈은 감정의 상태를 반영합니다. 잔잔한 바다는 평화를, 거친 바다는 감정적 혼란을 나타냅니다. 바다에서 수영하면 자유를 갈망하는 마음의 표현입니다.', luckyNumber: 6, category: '자연' },
  { keyword: '비', emoji: '\uD83C\uDF27\uFE0F', meaning: '비 꿈은 정화와 새로운 시작을 의미합니다. 고민이나 근심이 해소될 조짐이며 재물운도 따릅니다. 폭우는 큰 변화가, 이슬비는 작은 행운이 올 것을 뜻합니다.', luckyNumber: 12, category: '자연' },
  { keyword: '별', emoji: '\u2B50', meaning: '별 꿈은 희망과 소원 성취를 상징합니다. 밝은 별은 좋은 길몽이며, 별똥별은 특별한 행운을 의미합니다. 별이 떨어지는 꿈은 소원이 이루어질 수 있는 징조입니다.', luckyNumber: 7, category: '자연' },
  { keyword: '달', emoji: '\uD83C\uDF15', meaning: '달 꿈은 여성성과 직관을 상징합니다. 보름달은 소원 성취를, 초승달은 새로운 시작을 의미합니다. 달빛이 비치는 꿈은 진실이 밝혀질 것을 암시합니다.', luckyNumber: 15, category: '자연' },
  { keyword: '나무', emoji: '\uD83C\uDF33', meaning: '나무 꿈은 성장과 안정을 상징합니다. 푸른 나무는 건강과 번영을, 쓰러지는 나무는 변화의 시기를 의미합니다. 꽃이 핀 나무는 경사가 있을 징조입니다.', luckyNumber: 3, category: '자연' },
  { keyword: '눈', emoji: '\u2744\uFE0F', meaning: '눈 꿈은 순수함과 새로운 시작을 상징합니다. 하얀 눈이 내리면 마음이 정화되고, 눈 위를 걸으면 새로운 길이 열립니다. 눈사람은 즐거운 추억을 의미합니다.', luckyNumber: 4, category: '자연' },
  { keyword: '태양', emoji: '\u2600\uFE0F', meaning: '태양 꿈은 성공과 명예를 상징합니다. 떠오르는 태양은 새로운 시작과 희망을, 밝게 빛나는 태양은 출세와 성공을 의미합니다. 태양을 삼키는 꿈은 큰 권력을 상징합니다.', luckyNumber: 1, category: '자연' },
  { keyword: '무지개', emoji: '\uD83C\uDF08', meaning: '무지개 꿈은 희망과 행운의 상징입니다. 무지개가 나타나면 어려운 시기가 끝나고 좋은 일이 시작됩니다. 쌍무지개는 이중의 행운을 뜻합니다.', luckyNumber: 7, category: '자연' },
  // 자연 추가 25개
  { keyword: '폭풍', emoji: '\uD83C\uDF2A\uFE0F', meaning: '폭풍 꿈은 격변과 정화를 상징합니다. 폭풍이 지나간 후 맑은 하늘이 보이면 고난 뒤에 성공이 올 것을 의미합니다. 심리학적으로 억눌린 감정의 폭발을 뜻하기도 하며, 이를 잘 다스리면 더 강해질 수 있습니다.', luckyNumber: 32, category: '자연' },
  { keyword: '번개', emoji: '\u26A1', meaning: '번개 꿈은 갑작스러운 깨달음과 영감을 상징합니다. 번개가 치는 꿈은 강렬한 아이디어나 기회가 갑자기 찾아올 것을 뜻합니다. 전통적으로 번개는 하늘의 메시지로, 중요한 결정의 시기를 알립니다.', luckyNumber: 37, category: '자연' },
  { keyword: '지진', emoji: '\uD83C\uDF0B', meaning: '지진 꿈은 삶의 근본적인 변화를 상징합니다. 기존의 안정이 흔들리지만, 그 후 더 단단한 기반 위에 설 수 있음을 뜻합니다. 심리학적으로 가치관이나 신념의 변화가 임박한 것을 의미합니다.', luckyNumber: 40, category: '자연' },
  { keyword: '태풍', emoji: '\uD83C\uDF00', meaning: '태풍 꿈은 강력한 변화의 에너지를 상징합니다. 태풍 속에서 살아남는 꿈은 어떤 시련도 극복할 수 있는 강한 의지를 뜻합니다. 태풍이 지나간 후 고요함은 문제 해결 후의 평화를 의미합니다.', luckyNumber: 41, category: '자연' },
  { keyword: '하늘', emoji: '\uD83C\uDF24\uFE0F', meaning: '하늘 꿈은 희망과 가능성을 상징합니다. 맑은 하늘은 앞길이 밝음을, 흐린 하늘은 일시적 근심을 뜻합니다. 하늘을 나는 꿈은 제약에서 벗어나 자유를 얻고자 하는 마음의 표현입니다.', luckyNumber: 18, category: '자연' },
  { keyword: '구름', emoji: '\u2601\uFE0F', meaning: '구름 꿈은 마음의 상태를 반영합니다. 흰 구름은 평온과 행운을, 먹구름은 걱정과 근심을 의미합니다. 구름 위를 걷는 꿈은 현실에서 벗어나 이상적인 상태를 갈망하는 것입니다.', luckyNumber: 26, category: '자연' },
  { keyword: '안개', emoji: '\uD83C\uDF2B\uFE0F', meaning: '안개 꿈은 불확실함과 혼란을 상징합니다. 안개가 걷히면 문제의 해답을 찾을 수 있으며, 짙은 안개 속을 걷는 꿈은 현재 방향을 잃은 상태를 반영합니다. 인내하면 곧 길이 보일 것입니다.', luckyNumber: 30, category: '자연' },
  { keyword: '강', emoji: '\uD83C\uDFDE\uFE0F', meaning: '강 꿈은 인생의 흐름과 시간을 상징합니다. 맑은 강물은 순탄한 인생 여정을, 급류는 도전적인 시기를 뜻합니다. 강을 건너는 꿈은 중요한 전환점을 의미합니다. 전통적으로 큰 강은 큰 복을 상징합니다.', luckyNumber: 34, category: '자연' },
  { keyword: '호수', emoji: '\uD83C\uDFDE\uFE0F', meaning: '호수 꿈은 내면의 평화와 성찰을 상징합니다. 맑은 호수는 마음의 여유를, 호수에 비친 모습은 자기 성찰의 시기를 뜻합니다. 호수에서 물고기를 잡는 꿈은 내면에서 보물을 발견할 것을 의미합니다.', luckyNumber: 18, category: '자연' },
  { keyword: '폭포', emoji: '\uD83C\uDF0A', meaning: '폭포 꿈은 감정의 해방과 정화를 상징합니다. 폭포 아래에서 물을 맞는 꿈은 잡념이 사라지고 새로운 에너지를 얻을 것을 뜻합니다. 전통적으로 폭포는 수행과 깨달음의 장소로, 영적 성장을 의미합니다.', luckyNumber: 43, category: '자연' },
  { keyword: '숲', emoji: '\uD83C\uDF32', meaning: '숲 꿈은 무의식과 탐험을 상징합니다. 숲 속을 거니는 꿈은 자기 내면을 탐구하는 시기이며, 숲에서 길을 찾는 꿈은 인생의 방향을 잡아가고 있음을 의미합니다. 밝은 숲은 희망적인 미래를 뜻합니다.', luckyNumber: 13, category: '자연' },
  { keyword: '동굴', emoji: '\uD83D\uDEE4\uFE0F', meaning: '동굴 꿈은 내면의 탐구와 보호를 상징합니다. 동굴에 들어가는 꿈은 자기 내면과 마주하는 시기이며, 동굴에서 보물을 발견하는 꿈은 숨겨진 재능이나 기회를 발견할 것을 의미합니다.', luckyNumber: 42, category: '자연' },
  { keyword: '사막', emoji: '\uD83C\uDFDC\uFE0F', meaning: '사막 꿈은 고독과 시련을 상징하지만, 사막에서 오아시스를 발견하는 꿈은 어려운 상황에서 구원을 찾을 것을 의미합니다. 끝없는 사막을 걷는 꿈은 인내가 필요한 시기입니다.', luckyNumber: 35, category: '자연' },
  { keyword: '섬', emoji: '\uD83C\uDFDD\uFE0F', meaning: '섬 꿈은 독립과 고립을 상징합니다. 아름다운 섬을 발견하는 꿈은 자신만의 안식처를 찾을 수 있음을 뜻하며, 섬에 갇히는 꿈은 현재 상황에서 벗어나고 싶은 마음을 반영합니다.', luckyNumber: 27, category: '자연' },
  { keyword: '절벽', emoji: '\uD83C\uDFD4\uFE0F', meaning: '절벽 꿈은 위기와 도전을 상징합니다. 절벽 끝에 서는 꿈은 중요한 결정 앞에 있음을 뜻하며, 절벽에서 뛰어내리는 꿈은 과감한 도전을 할 용기가 있음을 의미합니다. 전통적으로 위기 속 기회를 뜻합니다.', luckyNumber: 38, category: '자연' },
  { keyword: '화산', emoji: '\uD83C\uDF0B', meaning: '화산 꿈은 억눌린 감정의 폭발을 상징합니다. 화산이 폭발하는 꿈은 큰 변화가 일어날 징조이며, 분출 후 평온해지는 것은 문제 해결을 의미합니다. 전통적으로 화산은 대운이 트이는 전조로 해석됩니다.', luckyNumber: 45, category: '자연' },
  { keyword: '빙하', emoji: '\uD83E\uDDCA', meaning: '빙하 꿈은 잠재된 에너지와 인내를 상징합니다. 빙하가 녹는 꿈은 오래 동안 막혀있던 일이 풀릴 징조이며, 빙하 위를 걷는 꿈은 어려운 상황에서도 꿋꿋이 나아가고 있음을 의미합니다.', luckyNumber: 36, category: '자연' },
  { keyword: '오로라', emoji: '\uD83C\uDF0C', meaning: '오로라 꿈은 신비로운 행운과 영감을 상징합니다. 오로라를 보는 꿈은 특별한 행운이 찾아올 징조이며, 영적 성장의 시기임을 알립니다. 매우 드문 길몽으로, 인생의 전환점이 될 수 있습니다.', luckyNumber: 44, category: '자연' },
  { keyword: '일식', emoji: '\uD83C\uDF11', meaning: '일식 꿈은 일시적 어둠 후 밝음을 상징합니다. 일식은 잠시 어려운 시기가 오지만 곧 지나갈 것을 뜻합니다. 전통적으로 큰 변화의 전조로, 새로운 시대가 열리는 것을 의미합니다.', luckyNumber: 41, category: '자연' },

  // ══════════════════════════════════════════
  // 사람 (33개)
  // ══════════════════════════════════════════
  { keyword: '아기', emoji: '\uD83D\uDC76', meaning: '아기 꿈은 새로운 시작과 가능성을 상징합니다. 사업의 새로운 시작이나 창의적인 아이디어를 의미합니다. 아기가 웃으면 기쁜 소식이, 아기가 울면 관심이 필요한 일이 있습니다.', luckyNumber: 4, category: '사람' },
  { keyword: '돌아가신 분', emoji: '\uD83D\uDE07', meaning: '돌아가신 분을 만나는 꿈은 그 분의 보호와 인도를 받고 있음을 의미합니다. 무언가를 주시면 재물운이, 대화를 나누면 중요한 메시지가 담겨있을 수 있습니다.', luckyNumber: 9, category: '사람' },
  { keyword: '연예인', emoji: '\uD83C\uDF1F', meaning: '연예인 꿈은 성공과 인정에 대한 욕구를 반영합니다. 연예인과 친하게 지내면 사회적 지위 상승을, 연예인이 되는 꿈은 숨겨진 재능의 발현을 의미합니다.', luckyNumber: 11, category: '사람' },
  { keyword: '어머니', emoji: '\uD83E\uDDD1', meaning: '어머니 꿈은 보호와 안정을 상징합니다. 어머니가 웃으시면 가정에 평화가, 어머니가 우시면 가족에게 관심이 필요합니다. 어머니의 요리를 먹는 꿈은 그리움과 치유를 의미합니다.', luckyNumber: 2, category: '사람' },
  { keyword: '아이', emoji: '\uD83D\uDC67', meaning: '아이와 노는 꿈은 순수한 기쁨과 창의력을 상징합니다. 아이가 밝게 웃으면 좋은 소식이, 아이를 돌보는 꿈은 새로운 책임이 생길 수 있습니다.', luckyNumber: 5, category: '사람' },
  { keyword: '임신', emoji: '\uD83E\uDD30', meaning: '임신 꿈은 새로운 프로젝트나 아이디어의 탄생을 상징합니다. 실제 임신이 아니더라도 창조적인 에너지가 넘치는 시기를 의미합니다. 큰 성과를 앞두고 있습니다.', luckyNumber: 8, category: '사람' },
  { keyword: '결혼', emoji: '\uD83D\uDC8D', meaning: '결혼 꿈은 새로운 파트너십이나 결합을 상징합니다. 실제 결혼 예정이 아니어도 중요한 계약이나 협력이 성사될 수 있습니다. 행복한 결혼식은 성공적인 합의를 의미합니다.', luckyNumber: 2, category: '사람' },
  { keyword: '친구', emoji: '\uD83E\uDD1D', meaning: '친구 꿈은 인간관계와 사회적 연결을 상징합니다. 오래된 친구를 만나면 과거의 인연이 도움이 될 수 있고, 새 친구를 사귀면 새로운 기회가 열립니다.', luckyNumber: 6, category: '사람' },
  // 사람 추가 25개
  { keyword: '아버지', emoji: '\uD83D\uDC68', meaning: '아버지 꿈은 권위와 보호를 상징합니다. 아버지가 웃는 꿈은 가업이나 사업이 번창할 징조이며, 아버지와 대화하는 꿈은 중요한 인생 조언을 얻을 수 있음을 뜻합니다. 돌아가신 아버지가 나타나면 큰 길몽입니다.', luckyNumber: 16, category: '사람' },
  { keyword: '할머니', emoji: '\uD83D\uDC75', meaning: '할머니 꿈은 지혜와 따뜻함을 상징합니다. 할머니가 음식을 주시는 꿈은 재물이 들어올 징조이며, 할머니와 이야기하는 꿈은 인생의 지혜를 깨달을 시기임을 뜻합니다.', luckyNumber: 20, category: '사람' },
  { keyword: '할아버지', emoji: '\uD83D\uDC74', meaning: '할아버지 꿈은 경험과 유산을 상징합니다. 할아버지가 무언가를 물려주시는 꿈은 유산이나 재물을 얻을 징조이며, 할아버지와 함께하는 꿈은 조상의 보호를 받고 있음을 의미합니다.', luckyNumber: 21, category: '사람' },
  { keyword: '형제자매', emoji: '\uD83D\uDC6C', meaning: '형제자매 꿈은 유대와 경쟁을 동시에 상징합니다. 형제자매와 사이좋게 지내는 꿈은 가정의 화목을, 다투는 꿈은 내면의 갈등을 반영합니다. 함께 여행하는 꿈은 좋은 협력을 의미합니다.', luckyNumber: 17, category: '사람' },
  { keyword: '선생님', emoji: '\uD83D\uDC69\u200D\uD83C\uDFEB', meaning: '선생님 꿈은 학습과 성장을 상징합니다. 선생님에게 칭찬받는 꿈은 노력이 인정받을 것을 뜻하며, 선생님과 대화하는 꿈은 새로운 지식이나 기술을 습득할 시기임을 알립니다.', luckyNumber: 23, category: '사람' },
  { keyword: '의사', emoji: '\uD83D\uDC68\u200D\u2695\uFE0F', meaning: '의사 꿈은 치유와 회복을 상징합니다. 의사에게 진료를 받는 꿈은 현재의 문제가 해결될 징조이며, 의사가 되는 꿈은 다른 사람을 돕는 역할을 하게 될 수 있음을 의미합니다.', luckyNumber: 28, category: '사람' },
  { keyword: '경찰', emoji: '\uD83D\uDC6E', meaning: '경찰 꿈은 질서와 정의를 상징합니다. 경찰의 도움을 받는 꿈은 곤란한 상황에서 구원을 받을 징조이며, 경찰에게 쫓기는 꿈은 양심의 가책이나 규칙을 어기는 것에 대한 불안을 반영합니다.', luckyNumber: 31, category: '사람' },
  { keyword: '왕', emoji: '\uD83E\uDD34', meaning: '왕 꿈은 권력과 통치를 상징합니다. 왕이 되는 꿈은 직장에서 승진하거나 리더 역할을 맡게 될 징조입니다. 왕을 만나는 꿈은 귀인을 만나 도움을 받을 수 있음을 의미합니다.', luckyNumber: 1, category: '사람' },
  { keyword: '공주', emoji: '\uD83D\uDC78', meaning: '공주 꿈은 우아함과 특별함을 상징합니다. 공주가 되는 꿈은 자신의 가치를 인정받을 시기이며, 공주를 만나는 꿈은 좋은 인연이 생길 수 있음을 뜻합니다. 자기 사랑이 필요한 시기입니다.', luckyNumber: 14, category: '사람' },
  { keyword: '군인', emoji: '\uD83E\uDDD1\u200D\u2708\uFE0F', meaning: '군인 꿈은 규율과 용기를 상징합니다. 군인이 되는 꿈은 강한 의지력으로 목표를 달성할 수 있음을 뜻하며, 군대를 보는 꿈은 조직적인 힘이 필요한 시기임을 알립니다.', luckyNumber: 34, category: '사람' },
  { keyword: '스님', emoji: '\uD83E\uDDD8', meaning: '스님 꿈은 깨달음과 평온을 상징합니다. 스님의 가르침을 받는 꿈은 인생의 중요한 깨달음을 얻을 시기이며, 스님과 함께 걷는 꿈은 마음의 평화를 찾을 수 있음을 의미합니다.', luckyNumber: 33, category: '사람' },
  { keyword: '신부', emoji: '\u2694\uFE0F', meaning: '신부(성직자) 꿈은 영적 인도와 축복을 상징합니다. 신부에게 축복을 받는 꿈은 좋은 일이 생길 징조이며, 기도하는 신부를 보는 꿈은 내면의 평화를 찾고 있음을 의미합니다.', luckyNumber: 7, category: '사람' },
  { keyword: '천사', emoji: '\uD83D\uDC7C', meaning: '천사 꿈은 보호와 은총을 상징합니다. 천사를 보는 꿈은 어려운 시기에 도움이 올 것을 뜻하며, 천사의 날개를 가진 꿈은 영적으로 한 단계 성장할 수 있음을 의미합니다. 최고의 길몽 중 하나입니다.', luckyNumber: 3, category: '사람' },
  { keyword: '악마', emoji: '\uD83D\uDC7F', meaning: '악마 꿈은 유혹과 내면의 어둠을 상징합니다. 악마를 물리치는 꿈은 자신의 약점을 극복할 수 있음을 뜻하며, 악마에게 쫓기는 꿈은 피하고 있는 문제를 직면해야 함을 의미합니다.', luckyNumber: 39, category: '사람' },
  { keyword: '유령', emoji: '\uD83D\uDC7B', meaning: '유령 꿈은 미해결된 감정과 과거를 상징합니다. 유령을 보는 꿈은 과거의 일이 현재에 영향을 미치고 있음을 뜻합니다. 유령이 사라지는 꿈은 과거의 문제가 해결될 것을 의미합니다.', luckyNumber: 13, category: '사람' },
  { keyword: '도깨비', emoji: '\uD83D\uDC79', meaning: '도깨비 꿈은 한국 전통에서 재물과 장난을 상징합니다. 도깨비방망이를 얻는 꿈은 원하는 것을 이룰 수 있는 길몽이며, 도깨비와 씨름하는 꿈은 어려움을 극복하면 큰 보상을 얻을 것을 의미합니다.', luckyNumber: 42, category: '사람' },
  { keyword: '거인', emoji: '\uD83E\uDDD9', meaning: '거인 꿈은 큰 힘과 도전을 상징합니다. 거인을 만나는 꿈은 큰 과제에 직면할 수 있음을 뜻하며, 거인을 이기는 꿈은 불가능해 보이는 일도 해낼 수 있음을 의미합니다.', luckyNumber: 40, category: '사람' },
  { keyword: '난쟁이', emoji: '\uD83E\uDDD1\u200D\uD83E\uDDB0', meaning: '난쟁이 꿈은 사소하지만 중요한 것을 상징합니다. 작은 존재가 큰 도움을 주는 것처럼, 주변의 작은 것들에 감사하라는 메시지입니다. 세심한 관찰이 필요한 시기입니다.', luckyNumber: 19, category: '사람' },
  { keyword: '쌍둥이', emoji: '\uD83D\uDC6F', meaning: '쌍둥이 꿈은 선택과 이중성을 상징합니다. 두 갈래 길 앞에서 결정을 내려야 할 시기이며, 쌍둥이와 함께 있는 꿈은 좋은 파트너를 만날 수 있음을 뜻합니다. 내면의 양면성에 대한 성찰이 필요합니다.', luckyNumber: 22, category: '사람' },
  { keyword: '첫사랑', emoji: '\uD83D\uDC98', meaning: '첫사랑 꿈은 그리움과 순수함을 상징합니다. 첫사랑을 다시 만나는 꿈은 과거의 순수한 감정을 되찾고 싶은 마음이며, 현재 관계에서 진정성을 찾아야 할 시기임을 알립니다.', luckyNumber: 15, category: '사람' },
  { keyword: '옛 연인', emoji: '\uD83D\uDC94', meaning: '옛 연인 꿈은 미련이나 교훈을 상징합니다. 옛 연인과 행복한 꿈은 현재 삶에서 부족한 감정을 보완하고 싶은 마음이며, 이별하는 꿈은 과거를 완전히 정리하고 새 출발할 준비가 되었음을 뜻합니다.', luckyNumber: 12, category: '사람' },
  { keyword: '이웃', emoji: '\uD83C\uDFE1', meaning: '이웃 꿈은 사회적 관계와 소통을 상징합니다. 이웃과 사이좋게 지내는 꿈은 주변 환경이 좋아질 징조이며, 이웃과 다투는 꿈은 일상의 갈등을 해결해야 함을 의미합니다.', luckyNumber: 24, category: '사람' },
  { keyword: '모르는 사람', emoji: '\uD83E\uDDD1\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1', meaning: '모르는 사람 꿈은 자신의 숨겨진 면모를 상징합니다. 심리학적으로 꿈속의 낯선 사람은 자신의 또 다른 자아이며, 그 사람의 행동이 현재 자신에게 필요한 것을 알려줍니다.', luckyNumber: 29, category: '사람' },
  { keyword: '유명인', emoji: '\uD83C\uDFA4', meaning: '유명인 꿈은 인정받고 싶은 욕구를 반영합니다. 유명인과 만나는 꿈은 사회적 지위 상승의 욕구를, 유명인이 되는 꿈은 재능을 펼칠 기회가 올 것을 의미합니다. 자신감을 가지세요.', luckyNumber: 11, category: '사람' },

  // ══════════════════════════════════════════
  // 사물 (35개)
  // ══════════════════════════════════════════
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
  // 사물 추가 25개
  { keyword: '목걸이', emoji: '\uD83D\uDCAE', meaning: '목걸이 꿈은 연결과 아름다움을 상징합니다. 목걸이를 선물받는 꿈은 소중한 인연이 생길 징조이며, 금 목걸이는 재물운 상승을 의미합니다. 목걸이가 끊어지는 꿈은 관계 변화를 주의하라는 경고입니다.', luckyNumber: 18, category: '사물' },
  { keyword: '칼', emoji: '\uD83D\uDD2A', meaning: '칼 꿈은 결단력과 분리를 상징합니다. 칼을 받는 꿈은 문제를 해결할 능력을 얻는 것이며, 칼로 무언가를 자르는 꿈은 관계나 상황의 정리를 의미합니다. 전통적으로 칼은 잡귀를 물리치는 상징입니다.', luckyNumber: 32, category: '사물' },
  { keyword: '총', emoji: '\uD83D\uDD2B', meaning: '총 꿈은 힘과 통제를 상징합니다. 총을 쏘는 꿈은 목표를 향해 집중하고 있음을 뜻하며, 총소리를 듣는 꿈은 갑작스러운 소식이나 변화를 의미합니다. 심리학적으로 공격성이나 자기 방어를 반영합니다.', luckyNumber: 36, category: '사물' },
  { keyword: '책', emoji: '\uD83D\uDCD6', meaning: '책 꿈은 지식과 학습을 상징합니다. 책을 읽는 꿈은 새로운 지식을 습득할 시기이며, 책을 선물받는 꿈은 좋은 스승이나 멘토를 만날 징조입니다. 두꺼운 책은 깊은 공부가 필요함을 의미합니다.', luckyNumber: 25, category: '사물' },
  { keyword: '편지', emoji: '\u2709\uFE0F', meaning: '편지 꿈은 소식과 메시지를 상징합니다. 편지를 받는 꿈은 중요한 소식이 올 징조이며, 편지를 쓰는 꿈은 전하지 못한 마음이 있음을 뜻합니다. 전통적으로 편지는 좋은 소식의 전조입니다.', luckyNumber: 10, category: '사물' },
  { keyword: '신발', emoji: '\uD83D\uDC5F', meaning: '신발 꿈은 사회적 지위와 진행을 상징합니다. 새 신발을 신는 꿈은 새로운 출발이나 승진을 뜻하며, 신발을 잃는 꿈은 현재의 지위에 변화가 올 수 있음을 의미합니다. 예쁜 구두는 좋은 인연을 상징합니다.', luckyNumber: 22, category: '사물' },
  { keyword: '모자', emoji: '\uD83E\uDDE2', meaning: '모자 꿈은 사회적 역할과 정체성을 상징합니다. 모자를 쓰는 꿈은 새로운 역할을 맡게 될 것을 뜻하며, 왕관 같은 모자는 높은 지위를 의미합니다. 모자를 벗는 꿈은 진정한 자아를 드러내는 것입니다.', luckyNumber: 27, category: '사물' },
  { keyword: '안경', emoji: '\uD83D\uDC53', meaning: '안경 꿈은 통찰과 이해를 상징합니다. 안경을 쓰는 꿈은 상황을 더 명확히 볼 수 있게 됨을 뜻하며, 안경이 깨지는 꿈은 잘못된 인식을 바로잡아야 함을 의미합니다.', luckyNumber: 15, category: '사물' },
  { keyword: '우산', emoji: '\u2602\uFE0F', meaning: '우산 꿈은 보호와 대비를 상징합니다. 우산을 펴는 꿈은 어려움에 대한 준비가 되어있음을 뜻하며, 우산이 없어 비를 맞는 꿈은 도움이 필요한 상황에 처할 수 있음을 의미합니다.', luckyNumber: 19, category: '사물' },
  { keyword: '가방', emoji: '\uD83D\uDC5C', meaning: '가방 꿈은 책임과 여정을 상징합니다. 가방에 짐을 싸는 꿈은 새로운 출발을 준비하고 있음을 뜻하며, 가방을 잃는 꿈은 정체성이나 목적의 혼란을 의미합니다. 무거운 가방은 많은 책임을 상징합니다.', luckyNumber: 33, category: '사물' },
  { keyword: '사다리', emoji: '\uD83E\uDE9C', meaning: '사다리 꿈은 상승과 도전을 상징합니다. 사다리를 오르는 꿈은 승진이나 목표 달성에 가까워지고 있음을 뜻하며, 사다리가 부러지는 꿈은 계획을 재점검해야 함을 의미합니다. 전통적으로 출세의 상징입니다.', luckyNumber: 37, category: '사물' },
  { keyword: '다리', emoji: '\uD83C\uDF09', meaning: '다리(bridge) 꿈은 연결과 전환을 상징합니다. 다리를 건너는 꿈은 인생의 중요한 전환점을 지나고 있음을 뜻하며, 무사히 건너면 어려움을 극복할 수 있습니다. 무너지는 다리는 결정을 서두르지 말라는 경고입니다.', luckyNumber: 26, category: '사물' },
  { keyword: '문', emoji: '\uD83D\uDEAA', meaning: '문 꿈은 기회와 새로운 시작을 상징합니다. 열린 문은 새로운 기회가 왔음을, 닫힌 문은 아직 때가 아님을 의미합니다. 문을 여는 꿈은 새로운 세계에 진입할 준비가 되었음을 뜻합니다.', luckyNumber: 9, category: '사물' },
  { keyword: '창문', emoji: '\uD83E\uDE9F', meaning: '창문 꿈은 시야와 관점을 상징합니다. 창문을 열면 새로운 가능성이 보이고, 깨끗한 창문은 명확한 판단력을 의미합니다. 창문 밖을 바라보는 꿈은 미래에 대한 희망을 반영합니다.', luckyNumber: 20, category: '사물' },
  { keyword: '계단', emoji: '\uD83E\uDEDC', meaning: '계단 꿈은 단계적 성장을 상징합니다. 계단을 오르는 꿈은 목표에 한 걸음씩 다가가고 있음을 뜻하며, 내려가는 꿈은 기초로 돌아가야 할 필요성을 의미합니다. 긴 계단은 큰 목표를 상징합니다.', luckyNumber: 30, category: '사물' },
  { keyword: '엘리베이터', emoji: '\uD83D\uDED7', meaning: '엘리베이터 꿈은 빠른 변화를 상징합니다. 올라가는 엘리베이터는 급격한 성공을, 내려가는 것은 일시적 하락을 의미합니다. 엘리베이터가 고장 나는 꿈은 변화 속 불안감을 반영합니다.', luckyNumber: 41, category: '사물' },
  { keyword: '자전거', emoji: '\uD83D\uDEB2', meaning: '자전거 꿈은 균형과 자립을 상징합니다. 자전거를 잘 타는 꿈은 인생의 균형을 잘 잡고 있음을 뜻하며, 넘어지는 꿈은 균형을 잃고 있다는 경고입니다. 자기 힘으로 나아가는 의지를 의미합니다.', luckyNumber: 16, category: '사물' },
  { keyword: '배', emoji: '\u26F5', meaning: '배(ship) 꿈은 인생 여정과 모험을 상징합니다. 순항하는 배는 삶이 순탄히 흘러감을, 폭풍 속의 배는 시련을 뜻합니다. 큰 배는 대업의 시작을, 항구에 도착하는 배는 목표 달성을 의미합니다.', luckyNumber: 34, category: '사물' },
  { keyword: '기차', emoji: '\uD83D\uDE82', meaning: '기차 꿈은 운명과 정해진 길을 상징합니다. 기차를 타는 꿈은 정해진 계획대로 일이 진행될 것을 뜻하며, 기차를 놓치는 꿈은 기회를 놓치지 말라는 경고입니다. 기차역은 전환점을 의미합니다.', luckyNumber: 38, category: '사물' },
  { keyword: '전화', emoji: '\uD83D\uDCDE', meaning: '전화 꿈은 소통과 연결을 상징합니다. 전화를 받는 꿈은 중요한 소식이 올 징조이며, 전화를 걸지 못하는 꿈은 누군가에게 전하지 못한 말이 있음을 뜻합니다. 좋은 전화는 행운의 소식입니다.', luckyNumber: 10, category: '사물' },
  { keyword: '컴퓨터', emoji: '\uD83D\uDCBB', meaning: '컴퓨터 꿈은 정보와 논리적 사고를 상징합니다. 컴퓨터로 작업하는 꿈은 체계적인 접근이 필요한 시기이며, 컴퓨터가 고장 나는 꿈은 계획을 재정비해야 함을 의미합니다.', luckyNumber: 21, category: '사물' },
  { keyword: '카메라', emoji: '\uD83D\uDCF7', meaning: '카메라 꿈은 기억과 포착을 상징합니다. 사진을 찍는 꿈은 현재의 순간을 소중히 하라는 메시지이며, 좋은 사진을 얻는 꿈은 중요한 기회를 포착할 수 있음을 의미합니다.', luckyNumber: 23, category: '사물' },

  // ══════════════════════════════════════════
  // 상황 (33개)
  // ══════════════════════════════════════════
  { keyword: '죽음', emoji: '\uD83E\uDEB6', meaning: '죽음 꿈은 역설적으로 재생과 변화를 의미합니다. 나쁜 꿈처럼 느껴지지만 새로운 시작의 전조입니다. 자신의 죽음은 큰 변화를, 타인의 죽음은 관계의 변화를 의미합니다.', luckyNumber: 13, category: '상황' },
  { keyword: '추락', emoji: '\uD83D\uDCA8', meaning: '떨어지는 꿈은 불안감이나 통제력 상실을 반영합니다. 하지만 추락 후 안전하게 착지하면 어려움을 극복할 수 있음을 의미합니다. 스카이다이빙은 용기 있는 도전의 상징입니다.', luckyNumber: 10, category: '상황' },
  { keyword: '날기', emoji: '\uD83E\uDD85', meaning: '하늘을 나는 꿈은 자유와 해방을 상징합니다. 높이 날수록 큰 성공을, 자유롭게 날면 현재의 제약에서 벗어날 수 있음을 의미합니다. 매우 긍정적인 꿈입니다.', luckyNumber: 1, category: '상황' },
  { keyword: '쫓김', emoji: '\uD83C\uDFC3', meaning: '쫓기는 꿈은 현실에서 피하고 싶은 것이 있음을 반영합니다. 두려움을 직면하면 해결의 실마리를 찾을 수 있습니다. 도망 후 숨는 꿈은 잠시 쉬어야 함을 의미합니다.', luckyNumber: 5, category: '상황' },
  { keyword: '이사', emoji: '\uD83D\uDCE6', meaning: '이사 꿈은 삶의 변화와 전환을 상징합니다. 좋은 집으로 이사하면 상황이 개선될 징조이며, 이사 과정이 순탄하면 변화가 순조로울 것입니다.', luckyNumber: 3, category: '상황' },
  { keyword: '싸움', emoji: '\uD83E\uDD4A', meaning: '싸우는 꿈은 내면의 갈등을 반영합니다. 싸움에서 이기면 문제를 극복할 수 있고, 지면 자기 성찰이 필요합니다. 화해하는 꿈은 갈등이 해소됨을 의미합니다.', luckyNumber: 9, category: '상황' },
  { keyword: '수영', emoji: '\uD83C\uDFCA', meaning: '수영 꿈은 감정의 흐름과 적응을 상징합니다. 자유롭게 수영하면 감정 조절이 잘 되고, 물에 빠지면 감정에 압도될 수 있습니다. 경영하는 꿈은 인생의 방향을 잘 잡고 있음을 의미합니다.', luckyNumber: 6, category: '상황' },
  { keyword: '시험합격', emoji: '\uD83C\uDF89', meaning: '합격 꿈은 노력의 결실을 의미합니다. 곧 좋은 소식이 올 수 있으며, 인정과 보상을 받을 징조입니다. 자신감을 가지고 도전하면 좋은 결과가 있을 것입니다.', luckyNumber: 1, category: '상황' },
  // 상황 추가 25개
  { keyword: '이별', emoji: '\uD83D\uDC94', meaning: '이별 꿈은 끝남과 새로운 시작을 동시에 상징합니다. 역설적으로 이별하는 꿈은 관계가 더 깊어질 수 있음을 뜻하며, 평화로운 이별은 자기 성장의 시기를 의미합니다.', luckyNumber: 14, category: '상황' },
  { keyword: '졸업', emoji: '\uD83C\uDF93', meaning: '졸업 꿈은 한 단계의 완성과 다음 단계로의 이동을 상징합니다. 졸업식에서 축하받는 꿈은 노력의 결실을 맺을 징조이며, 새로운 도전을 시작하기에 좋은 시기임을 알립니다.', luckyNumber: 25, category: '상황' },
  { keyword: '출산', emoji: '\uD83D\uDC76', meaning: '출산 꿈은 창조와 새로운 시작을 상징합니다. 건강한 아기를 낳는 꿈은 사업이나 프로젝트가 성공적으로 시작될 것을 뜻합니다. 전통적으로 출산 꿈은 큰 길몽으로, 태몽의 의미가 있습니다.', luckyNumber: 42, category: '상황' },
  { keyword: '수술', emoji: '\uD83C\uDFE5', meaning: '수술 꿈은 문제의 근본적 해결을 상징합니다. 수술이 성공적인 꿈은 오래된 문제가 해결될 징조이며, 수술을 기다리는 꿈은 중요한 결정을 앞두고 있음을 의미합니다.', luckyNumber: 28, category: '상황' },
  { keyword: '사고', emoji: '\uD83D\uDEA8', meaning: '사고 꿈은 예상치 못한 변화를 상징합니다. 사고 후 무사한 꿈은 위기를 극복할 수 있음을 뜻하며, 사고를 목격하는 꿈은 주변 상황에 주의를 기울이라는 경고입니다. 안전에 신경 써야 할 시기입니다.', luckyNumber: 35, category: '상황' },
  { keyword: '도둑', emoji: '\uD83E\uDD77', meaning: '도둑 꿈은 손실과 경계를 상징합니다. 도둑을 잡는 꿈은 잃었던 것을 되찾을 수 있음을 뜻하며, 도둑에게 물건을 빼앗기는 꿈은 역설적으로 재물이 들어올 것을 의미하는 길몽일 수 있습니다.', luckyNumber: 38, category: '상황' },
  { keyword: '화재', emoji: '\uD83D\uDD25', meaning: '화재 꿈은 정화와 변혁을 상징합니다. 집에 불이 나는 꿈은 전통적으로 큰 길몽으로, 재물이 크게 늘어날 징조입니다. 불을 끄는 꿈은 문제를 해결할 능력이 있음을 뜻합니다.', luckyNumber: 44, category: '상황' },
  { keyword: '홍수', emoji: '\uD83C\uDF0A', meaning: '홍수 꿈은 감정의 범람과 큰 변화를 상징합니다. 홍수를 무사히 넘기는 꿈은 큰 시련을 극복할 것을 뜻하며, 전통적으로 홍수는 재물이 밀려들어오는 대길몽으로 해석됩니다.', luckyNumber: 43, category: '상황' },
  { keyword: '전쟁', emoji: '\u2694\uFE0F', meaning: '전쟁 꿈은 내면의 갈등과 투쟁을 상징합니다. 전쟁에서 살아남는 꿈은 강한 생존력을 뜻하며, 전쟁이 끝나는 꿈은 오래된 갈등이 해소될 것을 의미합니다. 평화를 향한 노력이 필요합니다.', luckyNumber: 40, category: '상황' },
  { keyword: '승리', emoji: '\uD83C\uDFC6', meaning: '승리 꿈은 성취와 인정을 상징합니다. 경기나 시합에서 이기는 꿈은 현재 추진 중인 일에서 좋은 결과를 얻을 징조입니다. 트로피를 받는 꿈은 공식적인 인정을 받을 것을 의미합니다.', luckyNumber: 1, category: '상황' },
  { keyword: '패배', emoji: '\uD83D\uDE1E', meaning: '패배 꿈은 겸손과 재기를 상징합니다. 역설적으로 꿈에서의 패배는 현실에서의 성공을 의미할 수 있으며, 실패에서 배우는 꿈은 더 강해질 수 있음을 뜻합니다. 포기하지 마세요.', luckyNumber: 29, category: '상황' },
  { keyword: '춤', emoji: '\uD83D\uDC83', meaning: '춤 꿈은 기쁨과 표현을 상징합니다. 즐겁게 춤추는 꿈은 행복한 시기가 올 것을 뜻하며, 많은 사람 앞에서 춤추는 꿈은 재능을 인정받을 기회가 올 것을 의미합니다.', luckyNumber: 17, category: '상황' },
  { keyword: '노래', emoji: '\uD83C\uDFA4', meaning: '노래 꿈은 감정 표현과 소통을 상징합니다. 노래를 부르는 꿈은 억눌린 감정을 표현해야 할 시기이며, 아름다운 노래를 듣는 꿈은 좋은 소식이 올 징조입니다.', luckyNumber: 11, category: '상황' },
  { keyword: '요리', emoji: '\uD83C\uDF73', meaning: '요리 꿈은 창조와 양육을 상징합니다. 맛있는 음식을 만드는 꿈은 새로운 프로젝트가 성공할 징조이며, 요리를 대접하는 꿈은 주변 사람들에게 인정받을 것을 의미합니다.', luckyNumber: 22, category: '상황' },
  { keyword: '청소', emoji: '\uD83E\uDDF9', meaning: '청소 꿈은 정리와 정화를 상징합니다. 집을 깨끗이 청소하는 꿈은 마음의 짐을 덜고 새롭게 시작할 수 있음을 뜻합니다. 전통적으로 청소 꿈은 복을 받을 준비가 되었음을 의미합니다.', luckyNumber: 18, category: '상황' },
  { keyword: '세수', emoji: '\uD83E\uDDF4', meaning: '세수하는 꿈은 새로운 시작과 정화를 상징합니다. 맑은 물로 세수하는 꿈은 걱정이 씻겨나가고 기분이 상쾌해질 징조입니다. 전통적으로 세수 꿈은 좋은 일이 생길 전조로 해석됩니다.', luckyNumber: 4, category: '상황' },
  { keyword: '목욕', emoji: '\uD83D\uDEC1', meaning: '목욕 꿈은 심신의 정화와 재충전을 상징합니다. 따뜻한 물에 목욕하는 꿈은 피로가 풀리고 새로운 에너지를 얻을 것을 뜻합니다. 전통적으로 목욕 꿈은 재물이 들어올 길몽입니다.', luckyNumber: 23, category: '상황' },
  { keyword: '등산', emoji: '\u26F0\uFE0F', meaning: '등산 꿈은 도전과 성취를 상징합니다. 정상에 도달하는 꿈은 목표를 달성할 수 있음을 뜻하며, 등산 중 아름다운 경치를 보는 꿈은 과정에서도 즐거움을 찾을 수 있음을 의미합니다.', luckyNumber: 31, category: '상황' },
  { keyword: '운전', emoji: '\uD83D\uDE97', meaning: '운전 꿈은 인생의 주도권을 상징합니다. 능숙하게 운전하는 꿈은 자신의 삶을 잘 통제하고 있음을 뜻하며, 브레이크가 안 되는 꿈은 속도를 줄이고 주의해야 함을 의미합니다.', luckyNumber: 33, category: '상황' },
  { keyword: '비행', emoji: '\u2708\uFE0F', meaning: '비행 꿈은 자유와 초월을 상징합니다. 비행기를 타고 나는 꿈은 새로운 세계로의 진출을 뜻하며, 자유롭게 나는 꿈은 현재의 한계를 넘어설 수 있음을 의미합니다. 높이 날수록 큰 성공입니다.', luckyNumber: 45, category: '상황' },
  { keyword: '우주', emoji: '\uD83D\uDE80', meaning: '우주 꿈은 무한한 가능성과 탐구를 상징합니다. 우주를 여행하는 꿈은 한계를 넘어 새로운 영역에 도전할 수 있음을 뜻합니다. 전통적으로 우주는 큰 운명의 변화를 예고하는 꿈입니다.', luckyNumber: 44, category: '상황' },

  // ══════════════════════════════════════════
  // 숫자 (25개)
  // ══════════════════════════════════════════
  { keyword: '숫자 1', emoji: '1\uFE0F\u20E3', meaning: '1이 나오는 꿈은 새로운 시작과 독립을 상징합니다. 리더십을 발휘할 기회가 오고 있으며, 자신만의 길을 개척해야 할 시기입니다.', luckyNumber: 1, category: '숫자' },
  { keyword: '숫자 3', emoji: '3\uFE0F\u20E3', meaning: '3이 나오는 꿈은 창의력과 소통을 상징합니다. 세 가지 선택지가 있을 수 있으며, 표현력이 필요한 시기입니다. 숫자 3은 삼위일체, 완성의 숫자입니다.', luckyNumber: 3, category: '숫자' },
  { keyword: '숫자 7', emoji: '7\uFE0F\u20E3', meaning: '7이 나오는 꿈은 영적 성장과 행운을 상징합니다. 직관을 믿어야 할 때이며, 신비로운 경험을 할 수 있습니다. 행운의 숫자로 로또에 행운이 있을 수 있습니다.', luckyNumber: 7, category: '숫자' },
  { keyword: '숫자 8', emoji: '8\uFE0F\u20E3', meaning: '8이 나오는 꿈은 풍요와 성공을 상징합니다. 재물운이 상승하고 사업에 좋은 기회가 올 수 있습니다. 무한대(\u221E)와 같은 모양으로 끝없는 가능성을 의미합니다.', luckyNumber: 8, category: '숫자' },
  { keyword: '숫자 9', emoji: '9\uFE0F\u20E3', meaning: '9가 나오는 꿈은 완성과 마무리를 상징합니다. 한 단계가 끝나고 새로운 시작이 다가오고 있습니다. 지금까지의 노력이 결실을 맺을 때입니다.', luckyNumber: 9, category: '숫자' },
  // 숫자 추가 20개
  { keyword: '숫자 0', emoji: '0\uFE0F\u20E3', meaning: '0이 나오는 꿈은 무한과 시작점을 상징합니다. 아무것도 없는 것처럼 보이지만 모든 가능성을 품고 있습니다. 백지 상태에서 새로 시작할 수 있는 기회가 열리고 있습니다.', luckyNumber: 10, category: '숫자' },
  { keyword: '숫자 2', emoji: '2\uFE0F\u20E3', meaning: '2가 나오는 꿈은 균형과 조화를 상징합니다. 파트너십이나 협력이 중요한 시기이며, 음양의 조화가 필요합니다. 좋은 동반자를 만나 시너지를 낼 수 있습니다.', luckyNumber: 2, category: '숫자' },
  { keyword: '숫자 4', emoji: '4\uFE0F\u20E3', meaning: '4가 나오는 꿈은 안정과 기반을 상징합니다. 사방위를 뜻하는 안정적인 숫자로, 기초를 탄탄히 다져야 할 때입니다. 한국에서는 죽음을 연상시키지만 꿈에서는 변화와 새 출발을 의미합니다.', luckyNumber: 4, category: '숫자' },
  { keyword: '숫자 5', emoji: '5\uFE0F\u20E3', meaning: '5가 나오는 꿈은 변화와 자유를 상징합니다. 오행의 중심 숫자로, 다양한 분야에서 균형을 찾아야 합니다. 여행이나 이동이 있을 수 있으며, 모험을 즐기기 좋은 시기입니다.', luckyNumber: 5, category: '숫자' },
  { keyword: '숫자 6', emoji: '6\uFE0F\u20E3', meaning: '6이 나오는 꿈은 조화와 가정을 상징합니다. 가족과의 유대가 강해지는 시기이며, 책임감이 필요한 일이 생길 수 있습니다. 육감이 발달하여 직관적 판단이 정확해집니다.', luckyNumber: 6, category: '숫자' },
  { keyword: '숫자 10', emoji: '\uD83D\uDD1F', meaning: '10이 나오는 꿈은 완성과 새로운 순환을 상징합니다. 하나의 목표가 완성되고 다음 단계로 나아갈 준비가 되었습니다. 십(十)은 완전한 수로, 만사형통의 기운이 있습니다.', luckyNumber: 10, category: '숫자' },
  { keyword: '숫자 11', emoji: '\u2B50', meaning: '11이 나오는 꿈은 직관과 영감을 상징합니다. 마스터 넘버로, 영적 각성의 시기입니다. 직감이 평소보다 강해지며, 중요한 영감이 떠오를 수 있습니다.', luckyNumber: 11, category: '숫자' },
  { keyword: '숫자 12', emoji: '\uD83D\uDD52', meaning: '12가 나오는 꿈은 순환과 완전함을 상징합니다. 12달, 12시간처럼 하나의 사이클이 완성되는 것을 뜻합니다. 시간을 잘 활용하면 큰 성과를 거둘 수 있습니다.', luckyNumber: 12, category: '숫자' },
  { keyword: '숫자 13', emoji: '\uD83D\uDD2E', meaning: '13이 나오는 꿈은 변화와 전환을 상징합니다. 서양에서는 불길한 수이지만, 동양에서는 시련 속 성장을 의미합니다. 두려움을 극복하면 더 큰 행운이 따릅니다.', luckyNumber: 13, category: '숫자' },
  { keyword: '숫자 21', emoji: '\uD83C\uDF1F', meaning: '21이 나오는 꿈은 성인이 되는 전환점을 상징합니다. 인생의 새로운 단계에 진입하고 있으며, 독립적인 결정을 내릴 때입니다. 행운과 성취가 따르는 숫자입니다.', luckyNumber: 21, category: '숫자' },
  { keyword: '숫자 44', emoji: '\uD83C\uDFB0', meaning: '44가 나오는 꿈은 배가된 안정을 상징합니다. 4의 에너지가 두 배로, 강력한 기반을 다질 수 있습니다. 재물운에 특히 좋으며, 부동산이나 저축에 행운이 따릅니다.', luckyNumber: 44, category: '숫자' },
  { keyword: '숫자 77', emoji: '\uD83D\uDCAB', meaning: '77이 나오는 꿈은 최고의 행운을 상징합니다. 7의 행운이 두 배로 증폭되어, 인생에서 특별한 축복을 받을 수 있습니다. 로또나 복권에 도전해볼 만한 시기입니다.', luckyNumber: 7, category: '숫자' },
  { keyword: '숫자 100', emoji: '\uD83D\uDCAF', meaning: '100이 나오는 꿈은 완벽한 달성과 만족을 상징합니다. 목표를 100% 달성할 수 있으며, 모든 면에서 충만함을 느낄 수 있습니다. 백(百)은 많음과 풍요의 상징입니다.', luckyNumber: 10, category: '숫자' },
  { keyword: '숫자 1000', emoji: '\uD83C\uDF1F', meaning: '1000이 나오는 꿈은 큰 규모의 행운을 상징합니다. 천(千)은 무한한 가능성과 큰 성취를 뜻합니다. 사업이나 투자에서 큰 규모의 성과를 기대할 수 있으며, 전통적으로 천금의 가치를 지닌 길몽입니다.', luckyNumber: 45, category: '숫자' },
  { keyword: '숫자 10000', emoji: '\uD83D\uDC8E', meaning: '10000(만)이 나오는 꿈은 최고의 길몽 중 하나입니다. 만(萬)은 만사형통을 뜻하며, 모든 일이 순조롭게 풀릴 징조입니다. 큰 재물운과 성공이 따르는 최상의 숫자 꿈입니다.', luckyNumber: 1, category: '숫자' },
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

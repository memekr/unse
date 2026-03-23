/**
 * 운세미 결과 카드 이미지 생성기
 * Canvas API로 사주/별자리 운세 결과를 공유 가능한 이미지로 렌더링
 */

export interface ResultCardData {
  name: string;
  score: number;
  fortune: string;
  zodiac: string;
  zodiacIcon: string;
  luckyNumbers?: number[];
  dominantElement?: string;
  elementColor?: string;
  advice?: string;
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, maxWidth: number, lineHeight: number): string[] {
  const lines: string[] = [];
  let currentLine = '';
  for (const char of text) {
    const testLine = currentLine + char;
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && currentLine.length > 0) {
      lines.push(currentLine);
      currentLine = char;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
}

export function generateResultCard(data: ResultCardData): Promise<Blob> {
  const canvas = document.createElement('canvas');
  const dpr = 2; // retina quality
  canvas.width = 600 * dpr;
  canvas.height = 800 * dpr;
  canvas.style.width = '600px';
  canvas.style.height = '800px';
  const ctx = canvas.getContext('2d')!;
  ctx.scale(dpr, dpr);

  // Dark purple gradient background
  const grad = ctx.createLinearGradient(0, 0, 0, 800);
  grad.addColorStop(0, '#0D0A1A');
  grad.addColorStop(0.5, '#1a1030');
  grad.addColorStop(1, '#0D0A1A');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 600, 800);

  // Decorative stars
  ctx.fillStyle = 'rgba(255,255,255,0.08)';
  const starPositions = [
    [50, 50], [120, 30], [500, 80], [540, 45], [30, 150], [570, 200],
    [80, 400], [520, 450], [60, 600], [540, 650], [150, 700], [450, 720],
  ];
  for (const [sx, sy] of starPositions) {
    ctx.beginPath();
    ctx.arc(sx, sy, 1.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // Title bar gradient
  const titleGrad = ctx.createLinearGradient(150, 40, 450, 40);
  titleGrad.addColorStop(0, 'rgba(168,85,247,0)');
  titleGrad.addColorStop(0.5, 'rgba(168,85,247,0.15)');
  titleGrad.addColorStop(1, 'rgba(168,85,247,0)');
  ctx.fillStyle = titleGrad;
  ctx.fillRect(100, 30, 400, 40);

  // Title
  ctx.fillStyle = '#c084fc';
  ctx.font = 'bold 24px "Apple SD Gothic Neo", "Noto Sans KR", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('오늘의 운세', 300, 60);

  // Date
  const today = new Date();
  const dateStr = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`;
  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  ctx.font = '13px "Apple SD Gothic Neo", "Noto Sans KR", sans-serif';
  ctx.fillText(dateStr, 300, 85);

  // Zodiac icon
  ctx.font = '52px "Apple Color Emoji", sans-serif';
  ctx.fillText(data.zodiacIcon, 300, 145);

  // Name
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 32px "Apple SD Gothic Neo", "Noto Sans KR", sans-serif';
  ctx.fillText(`${data.name}님`, 300, 195);

  // Zodiac subtitle
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.font = '15px "Apple SD Gothic Neo", "Noto Sans KR", sans-serif';
  ctx.fillText(data.zodiac, 300, 220);

  // ── Score Circle ──
  const cx = 300, cy = 310, r = 55;

  // Background circle
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(255,255,255,0.06)';
  ctx.lineWidth = 8;
  ctx.stroke();

  // Score arc
  const scoreAngle = (data.score / 100) * Math.PI * 2;
  const scoreColor = data.score >= 80 ? '#a855f7' : data.score >= 60 ? '#c084fc' : data.score >= 40 ? '#fbbf24' : '#f87171';
  ctx.beginPath();
  ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + scoreAngle);
  ctx.strokeStyle = scoreColor;
  ctx.lineWidth = 8;
  ctx.lineCap = 'round';
  ctx.stroke();

  // Score text
  ctx.fillStyle = scoreColor;
  ctx.font = 'bold 36px "Apple SD Gothic Neo", "Noto Sans KR", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`${data.score}`, cx, cy + 8);
  ctx.fillStyle = 'rgba(255,255,255,0.4)';
  ctx.font = '11px "Apple SD Gothic Neo", "Noto Sans KR", sans-serif';
  ctx.fillText('종합운', cx, cy + 28);

  // ── Element badge ──
  if (data.dominantElement) {
    const elColor = data.elementColor || '#c084fc';
    ctx.fillStyle = elColor + '22'; // with alpha
    roundRect(ctx, 230, 385, 140, 30, 15);
    ctx.fill();
    ctx.fillStyle = elColor;
    ctx.font = 'bold 13px "Apple SD Gothic Neo", "Noto Sans KR", sans-serif';
    ctx.fillText(data.dominantElement, 300, 405);
  }

  // ── Fortune text ──
  ctx.fillStyle = '#e2e8f0';
  ctx.font = '16px "Apple SD Gothic Neo", "Noto Sans KR", sans-serif';
  ctx.textAlign = 'center';

  const fortuneLines = wrapText(ctx, data.fortune, 300, 440, 26);
  let fortuneY = 450;
  for (const line of fortuneLines.slice(0, 4)) {
    ctx.fillText(line, 300, fortuneY);
    fortuneY += 26;
  }

  // ── Advice ──
  if (data.advice) {
    ctx.fillStyle = 'rgba(251,191,36,0.15)';
    roundRect(ctx, 60, fortuneY + 10, 480, 60, 12);
    ctx.fill();

    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 13px "Apple SD Gothic Neo", "Noto Sans KR", sans-serif';
    ctx.fillText('오늘의 조언', 300, fortuneY + 35);
    ctx.fillStyle = '#fde68a';
    ctx.font = '14px "Apple SD Gothic Neo", "Noto Sans KR", sans-serif';
    const adviceLines = wrapText(ctx, data.advice, 300, 420, 22);
    ctx.fillText(adviceLines[0] || '', 300, fortuneY + 55);
  }

  // ── Lucky numbers ──
  if (data.luckyNumbers && data.luckyNumbers.length > 0) {
    const numY = fortuneY + (data.advice ? 100 : 30);
    ctx.fillStyle = 'rgba(255,255,255,0.25)';
    ctx.font = '12px "Apple SD Gothic Neo", "Noto Sans KR", sans-serif';
    ctx.fillText('행운의 번호', 300, numY);

    const numStartX = 300 - ((data.luckyNumbers.length - 1) * 20);
    data.luckyNumbers.forEach((num, i) => {
      const nx = numStartX + i * 40;
      // Circle
      const numGrad = ctx.createRadialGradient(nx, numY + 25, 0, nx, numY + 25, 16);
      numGrad.addColorStop(0, '#a855f7');
      numGrad.addColorStop(1, '#7c3aed');
      ctx.fillStyle = numGrad;
      ctx.beginPath();
      ctx.arc(nx, numY + 25, 16, 0, Math.PI * 2);
      ctx.fill();
      // Number
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 14px "Apple SD Gothic Neo", "Noto Sans KR", sans-serif';
      ctx.fillText(`${num}`, nx, numY + 30);
    });
  }

  // ── Divider line ──
  const divGrad = ctx.createLinearGradient(100, 730, 500, 730);
  divGrad.addColorStop(0, 'rgba(168,85,247,0)');
  divGrad.addColorStop(0.5, 'rgba(168,85,247,0.3)');
  divGrad.addColorStop(1, 'rgba(168,85,247,0)');
  ctx.strokeStyle = divGrad;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(100, 740);
  ctx.lineTo(500, 740);
  ctx.stroke();

  // ── Watermark ──
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.font = 'bold 15px "Apple SD Gothic Neo", "Noto Sans KR", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('운세미 unse.me', 300, 770);

  ctx.fillStyle = 'rgba(255,255,255,0.15)';
  ctx.font = '11px "Apple SD Gothic Neo", "Noto Sans KR", sans-serif';
  ctx.fillText('무료 운세 | 사주풀이 | 타로', 300, 790);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob!), 'image/png');
  });
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

/**
 * Download the card as PNG
 */
export function downloadResultCard(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `운세미_${name}_${new Date().toISOString().slice(0, 10)}.png`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Share the card via Web Share API (with image) or fall back to download
 */
export async function shareResultCard(blob: Blob, name: string) {
  const file = new File([blob], `운세미_${name}.png`, { type: 'image/png' });

  if (navigator.share && navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({
        title: `${name}님의 오늘의 운세 - 운세미`,
        text: `${name}님의 운세 결과를 확인해보세요!`,
        url: 'https://unse.me',
        files: [file],
      });
      return;
    } catch { /* user cancelled or not supported */ }
  }

  // Fallback: download
  downloadResultCard(blob, name);
}

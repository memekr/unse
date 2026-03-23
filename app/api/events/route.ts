import fs from 'node:fs/promises';
import path from 'node:path';
import { NextResponse } from 'next/server';

const LOG_PATH = path.join(process.cwd(), 'data', 'runtime', 'events.jsonl');
const ALLOWED_EVENTS = new Set(['ad_click', 'ad_impression', 'page_view', 'cta_click']);

async function ensureLogDir() {
  await fs.mkdir(path.dirname(LOG_PATH), { recursive: true });
}

async function appendEvent(entry: Record<string, unknown>) {
  await ensureLogDir();
  await fs.appendFile(LOG_PATH, `${JSON.stringify(entry)}\n`, 'utf8');
}

async function readRecentEvents(limit = 50) {
  try {
    const raw = await fs.readFile(LOG_PATH, 'utf8');
    return raw
      .split(/\r?\n/)
      .filter(Boolean)
      .slice(-limit)
      .map((line) => JSON.parse(line));
  } catch {
    return [];
  }
}

export async function GET() {
  const events = await readRecentEvents();
  return NextResponse.json({ ok: true, count: events.length, events });
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as
    | { name?: string; data?: Record<string, unknown>; ts?: string; path?: string; href?: string }
    | null;

  if (!body?.name || !ALLOWED_EVENTS.has(body.name)) {
    return NextResponse.json({ ok: false, error: 'invalid_event' }, { status: 400 });
  }

  const entry = {
    name: body.name,
    data: body.data ?? {},
    ts: body.ts ?? new Date().toISOString(),
    path: body.path,
    href: body.href,
    receivedAt: new Date().toISOString(),
    userAgent: request.headers.get('user-agent') ?? undefined,
    forwardedFor: request.headers.get('x-forwarded-for') ?? undefined,
  };

  await appendEvent(entry);

  return NextResponse.json({ ok: true });
}

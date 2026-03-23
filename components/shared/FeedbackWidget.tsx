'use client';

import { useState, useEffect, useCallback } from 'react';

type FeedbackWidgetProps = {
  /** Discord webhook URL — falls back to env NEXT_PUBLIC_FEEDBACK_WEBHOOK */
  webhookUrl?: string;
  siteName?: string;
};

const COOLDOWN_MS = 24 * 60 * 60 * 1000; // 24 hours

function storageKey(path: string) {
  return `feedback_done_${path}`;
}

export default function FeedbackWidget({ webhookUrl, siteName }: FeedbackWidgetProps) {
  const [visible, setVisible] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [text, setText] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    try {
      const key = storageKey(window.location.pathname);
      const last = localStorage.getItem(key);
      if (last && Date.now() - Number(last) < COOLDOWN_MS) {
        return; // still in cooldown
      }
      setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  const sendToDiscord = useCallback(
    async (positive: boolean, feedback?: string) => {
      const url = webhookUrl || process.env.NEXT_PUBLIC_FEEDBACK_WEBHOOK;
      if (!url) return;
      const payload = {
        content: null,
        embeds: [
          {
            title: positive ? '👍 긍정 피드백' : '👎 부정 피드백',
            color: positive ? 0x34d399 : 0xf87171,
            fields: [
              { name: '사이트', value: siteName || window.location.hostname, inline: true },
              { name: '페이지', value: window.location.pathname, inline: true },
              ...(feedback ? [{ name: '내용', value: feedback }] : []),
            ],
            timestamp: new Date().toISOString(),
          },
        ],
      };
      try {
        await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } catch {
        // silent fail
      }
    },
    [webhookUrl, siteName],
  );

  const markDone = useCallback(() => {
    try {
      localStorage.setItem(storageKey(window.location.pathname), String(Date.now()));
    } catch {
      // ignore
    }
  }, []);

  const handlePositive = useCallback(() => {
    sendToDiscord(true);
    markDone();
    setSubmitted(true);
    setTimeout(() => setVisible(false), 2000);
  }, [sendToDiscord, markDone]);

  const handleNegative = useCallback(() => {
    setShowForm(true);
  }, []);

  const handleSubmit = useCallback(() => {
    if (!text.trim()) return;
    setSending(true);
    sendToDiscord(false, text.trim()).then(() => {
      markDone();
      setSubmitted(true);
      setSending(false);
      setTimeout(() => setVisible(false), 2000);
    });
  }, [text, sendToDiscord, markDone]);

  if (!visible) return null;

  return (
    <div className="feedback-widget">
      {submitted ? (
        <p className="feedback-thanks">감사합니다!</p>
      ) : showForm ? (
        <div className="feedback-form">
          <p className="feedback-label">어떤 점이 아쉬웠나요?</p>
          <textarea
            className="feedback-textarea"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="개선 사항을 알려주세요..."
            rows={3}
            maxLength={500}
          />
          <div className="feedback-actions">
            <button
              className="feedback-submit"
              onClick={handleSubmit}
              disabled={sending || !text.trim()}
            >
              {sending ? '전송 중...' : '전송'}
            </button>
            <button
              className="feedback-cancel"
              onClick={() => { markDone(); setVisible(false); }}
            >
              닫기
            </button>
          </div>
        </div>
      ) : (
        <div className="feedback-prompt">
          <span className="feedback-question">이 페이지가 도움이 되었나요?</span>
          <div className="feedback-buttons">
            <button onClick={handlePositive} aria-label="도움이 되었어요" className="feedback-btn-yes">
              👍
            </button>
            <button onClick={handleNegative} aria-label="아쉬웠어요" className="feedback-btn-no">
              👎
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .feedback-widget {
          position: fixed;
          bottom: 1rem;
          right: 1rem;
          z-index: 900;
          background: var(--color-bg-elevated, #1a1a2e);
          border: 1px solid var(--color-border, rgba(255, 255, 255, 0.1));
          border-radius: 0.75rem;
          padding: 0.75rem 1rem;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
          max-width: 320px;
          width: calc(100vw - 2rem);
        }
        .feedback-thanks {
          margin: 0;
          text-align: center;
          color: var(--color-success, #34d399);
          font-weight: 600;
          font-size: 0.875rem;
        }
        .feedback-prompt {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
        }
        .feedback-question {
          font-size: 0.8125rem;
          color: var(--color-text, #eee);
          flex: 1;
        }
        .feedback-buttons {
          display: flex;
          gap: 0.5rem;
        }
        .feedback-btn-yes,
        .feedback-btn-no {
          background: var(--color-surface, rgba(255, 255, 255, 0.05));
          border: 1px solid var(--color-border, rgba(255, 255, 255, 0.1));
          border-radius: 0.5rem;
          padding: 0.375rem 0.75rem;
          font-size: 1.125rem;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s;
        }
        .feedback-btn-yes:hover,
        .feedback-btn-no:hover {
          background: var(--color-glass, rgba(255, 255, 255, 0.1));
          transform: scale(1.1);
        }
        .feedback-form {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .feedback-label {
          margin: 0;
          font-size: 0.8125rem;
          color: var(--color-text, #eee);
          font-weight: 500;
        }
        .feedback-textarea {
          background: var(--color-surface, rgba(255, 255, 255, 0.05));
          border: 1px solid var(--color-border, rgba(255, 255, 255, 0.15));
          border-radius: 0.5rem;
          padding: 0.5rem;
          color: var(--color-text, #eee);
          font-size: 0.8125rem;
          resize: vertical;
          min-height: 60px;
          font-family: inherit;
        }
        .feedback-textarea:focus {
          outline: none;
          border-color: var(--color-accent, #8b5cf6);
        }
        .feedback-actions {
          display: flex;
          gap: 0.5rem;
        }
        .feedback-submit {
          flex: 1;
          background: var(--color-cta, #8b5cf6);
          color: #fff;
          border: none;
          border-radius: 0.5rem;
          padding: 0.5rem;
          font-size: 0.8125rem;
          font-weight: 600;
          cursor: pointer;
        }
        .feedback-submit:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .feedback-cancel {
          background: transparent;
          color: var(--color-text-muted, #999);
          border: 1px solid var(--color-border, rgba(255, 255, 255, 0.1));
          border-radius: 0.5rem;
          padding: 0.5rem 0.75rem;
          font-size: 0.8125rem;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}

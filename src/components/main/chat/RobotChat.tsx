import { useEffect, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from 'react';

import profilRobot from '../../../assets/image/profil-robot.webp';
import { useLanguage } from '../../../context/LanguageContext.tsx';
import { useKeyboardInset } from '../../../hooks/useKeyboardInset.ts';
import { useStreamingTypewriter } from '../../../hooks/useStreamingTypewriter.ts';
import style from './RobotChat.module.css';

const FRAME_COUNT = 5;
const AVATAR_HEIGHT = 72;
const AVATAR_WIDTH = AVATAR_HEIGHT * (125 / 100);
const FRAME_DELAY_MS = 120;
// Confort UX ; la limite qui fait foi est côté serveur (public/api.php), à garder synchronisée.
const MAX_QUESTION_LENGTH = 500;

// Teinte HSL du plein (vert) au vide (rouge), dégradé continu sans paliers.
const QUOTA_HUE_FULL = 120;
const QUOTA_HUE_EMPTY = 0;

type Quota = { remaining: number; limit: number };
// Dernier échange seulement, pas un historique complet.
type Exchange = { question: string; answer: string };

function readQuota(headers: Headers): Quota | null {
  const remaining = Number(headers.get('X-RateLimit-Remaining'));
  const limit = Number(headers.get('X-RateLimit-Limit'));
  if (!Number.isFinite(remaining) || !Number.isFinite(limit) || limit <= 0) return null;
  return { remaining, limit };
}

const MARKDOWN_LINK_RE = /^\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)$/;
// Ponctuation de fin de phrase qu'une URL brute peut avaler par erreur.
const TRAILING_PUNCTUATION_RE = /[.,;:!?)\]}'"]+$/;

function renderLink(url: string, label: ReactNode, key: number): ReactNode {
  return (
    <a key={key} href={url} target="_blank" rel="noopener noreferrer">
      {label}
    </a>
  );
}

// Markdown léger (gras, italique, liens) + URLs brutes du RAG, liens en nouvel onglet.
function renderMarkdown(text: string): ReactNode {
  return text
    .split(/(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\(https?:\/\/[^\s)]+\)|https?:\/\/[^\s<>{}[\]"']+)/g)
    .map((part, i) => {
      const bold = /^\*\*([^*]+)\*\*$/.exec(part);
      if (bold) return <strong key={i}>{bold[1]}</strong>;

      const italic = /^\*([^*]+)\*$/.exec(part);
      if (italic) return <em key={i}>{italic[1]}</em>;

      const markdownLink = MARKDOWN_LINK_RE.exec(part);
      if (markdownLink) return renderLink(markdownLink[2], markdownLink[1], i);

      if (/^https?:\/\//.test(part)) {
        const trailing = TRAILING_PUNCTUATION_RE.exec(part)?.[0] ?? '';
        const url = trailing ? part.slice(0, -trailing.length) : part;
        return (
          <span key={i}>
            {renderLink(url, url, i)}
            {trailing}
          </span>
        );
      }

      return part;
    });
}

type RobotChatProps = {
  onClose: () => void;
};

export default function RobotChat({ onClose }: RobotChatProps) {
  const { t, language } = useLanguage();
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  // null tant que le quota réel n'est pas récupéré ; la barre démarre pleine par défaut.
  const [quota, setQuota] = useState<Quota | null>(null);
  // Réinitialisé à chaque fermeture : le composant est démonté/remonté par le parent.
  const [lastExchange, setLastExchange] = useState<Exchange | null>(null);
  const keyboardInset = useKeyboardInset();
  const streamedAnswer = useStreamingTypewriter(answer ?? '');
  const displayText = answer === null ? t('chat.greeting') : answer === '' ? '...' : streamedAnswer;
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (!isLoading) return;

    const interval = setInterval(() => {
      setFrame((prev) => (prev + 1) % FRAME_COUNT);
    }, FRAME_DELAY_MS);

    return () => clearInterval(interval);
  }, [isLoading]);

  // Peek du quota réel à l'ouverture, sans consommer de requête (GET dédié).
  useEffect(() => {
    const controller = new AbortController();

    fetch('api.php', { signal: controller.signal })
      .then((res) => {
        const nextQuota = readQuota(res.headers);
        if (nextQuota) setQuota(nextQuota);
      })
      .catch(() => {});

    return () => controller.abort();
  }, []);

  const displayFrame = isLoading ? frame : 0;

  const avatarStyle = {
    width: AVATAR_WIDTH,
    height: AVATAR_HEIGHT,
    backgroundImage: `url(${profilRobot})`,
    backgroundSize: `${FRAME_COUNT * AVATAR_WIDTH}px ${AVATAR_HEIGHT}px`,
    backgroundPositionX: `-${displayFrame * AVATAR_WIDTH}px`,
  } as CSSProperties;

  const answerRowStyle = { '--avatar-size': `${AVATAR_HEIGHT}px` } as CSSProperties;

  const quotaRatio = quota ? Math.max(0, Math.min(1, quota.remaining / quota.limit)) : 1;
  const quotaHue = QUOTA_HUE_EMPTY + quotaRatio * (QUOTA_HUE_FULL - QUOTA_HUE_EMPTY);
  const quotaBarStyle = {
    width: AVATAR_WIDTH,
    '--quota-ratio': quotaRatio,
    '--quota-color': `hsl(${quotaHue}, 70%, 45%)`,
  } as CSSProperties;

  const submit = async () => {
    const trimmed = question.trim();
    if (!trimmed || isLoading) return;

    setQuestion('');
    setIsLoading(true);
    setAnswer('');

    try {
      const res = await fetch('api.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: trimmed,
          language,
          previousQuestion: lastExchange?.question,
          previousAnswer: lastExchange?.answer,
        }),
      });

      const nextQuota = readQuota(res.headers);
      if (nextQuota) setQuota(nextQuota);

      if (!res.ok) {
        const data = await res.json();
        setAnswer(data.error ?? "Une erreur s'est produite.");
        return;
      }

      if (!res.body) {
        const text = await res.text();
        setAnswer(text);
        setLastExchange({ question: trimmed, answer: text });
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        setAnswer(accumulated);
      }

      // Gardé seulement si l'échange a réussi, pour ne pas polluer le contexte suivant.
      setLastExchange({ question: trimmed, answer: accumulated });
    } catch {
      setAnswer("Impossible de contacter le service de chat, réessaie plus tard.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      submit();
    }
  };

  return (
    <div className={style.backdrop} style={{ bottom: keyboardInset }} onClick={onClose}>
      <div className={style.panel} onClick={(event) => event.stopPropagation()}>
        <div className={style.answerRow} style={answerRowStyle}>
          <div className={style.bubble}>
            <span>{renderMarkdown(displayText)}</span>
          </div>
          <div className={style.avatarCol}>
            <div className={style.avatar} style={avatarStyle} />
            <div
              className={style.quotaTrack}
              style={quotaBarStyle}
              role="progressbar"
              aria-label={t('chat.quotaLabel')}
              aria-valuemin={0}
              aria-valuemax={quota?.limit ?? 100}
              aria-valuenow={quota?.remaining ?? quota?.limit ?? 100}
            >
              <div className={style.quotaFill} />
            </div>
          </div>
        </div>
        <textarea
          className={style.prompt}
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t('chat.placeholder')}
          rows={1}
          maxLength={MAX_QUESTION_LENGTH}
          autoFocus
        />
      </div>
    </div>
  );
}

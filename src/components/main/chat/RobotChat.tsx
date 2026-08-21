import { useEffect, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from 'react';

import profilRobot from '../../../assets/image/profil-robot.webp';
import { useLanguage } from '../../../context/LanguageContext.tsx';
import { useStreamingTypewriter } from '../../../hooks/useStreamingTypewriter.ts';
import style from './RobotChat.module.css';

const FRAME_COUNT = 5;
const AVATAR_HEIGHT = 72;
const AVATAR_WIDTH = AVATAR_HEIGHT * (125 / 100);
const FRAME_DELAY_MS = 120;

// L'agent répond en Markdown léger (**gras**, *italique*)
function renderMarkdown(text: string): ReactNode {
  return text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).map((part, i) => {
    const bold = /^\*\*([^*]+)\*\*$/.exec(part);
    if (bold) return <strong key={i}>{bold[1]}</strong>;

    const italic = /^\*([^*]+)\*$/.exec(part);
    return italic ? <em key={i}>{italic[1]}</em> : part;
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

  const displayFrame = isLoading ? frame : 0;

  const avatarStyle = {
    width: AVATAR_WIDTH,
    height: AVATAR_HEIGHT,
    backgroundImage: `url(${profilRobot})`,
    backgroundSize: `${FRAME_COUNT * AVATAR_WIDTH}px ${AVATAR_HEIGHT}px`,
    backgroundPositionX: `-${displayFrame * AVATAR_WIDTH}px`,
  } as CSSProperties;

  const answerRowStyle = { '--avatar-size': `${AVATAR_HEIGHT}px` } as CSSProperties;

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
        body: JSON.stringify({ question: trimmed, language }),
      });

      if (!res.ok) {
        const data = await res.json();
        setAnswer(data.error ?? "Une erreur s'est produite.");
        return;
      }

      if (!res.body) {
        setAnswer(await res.text());
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
    <div className={style.backdrop} onClick={onClose}>
      <div className={style.panel} onClick={(event) => event.stopPropagation()}>
        <div className={style.answerRow} style={answerRowStyle}>
          <div className={style.bubble}>
            <span>{renderMarkdown(displayText)}</span>
          </div>
          <div className={style.avatar} style={avatarStyle} />
        </div>
        <textarea
          className={style.prompt}
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t('chat.placeholder')}
          rows={1}
          autoFocus
        />
      </div>
    </div>
  );
}

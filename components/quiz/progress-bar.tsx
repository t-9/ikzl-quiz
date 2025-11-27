import { QUESTION_COUNT } from '@/lib/quiz';

interface Props {
  currentIndex: number;
}

export default function ProgressBar({ currentIndex }: Props) {
  const percent = Math.min(((currentIndex + 1) / QUESTION_COUNT) * 100, 100);
  return (
    <div className="grid" style={{ gap: 8 }}>
      <div className="flex-between">
        <small>
          問題 {currentIndex + 1} / {QUESTION_COUNT}
        </small>
        <small>がんばって！</small>
      </div>
      <div className="progress-shell">
        <div className="progress-bar" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

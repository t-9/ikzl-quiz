'use client';

import type { Question } from '@/lib/quiz';
import { useMemo } from 'react';

interface Props {
  question: Question;
  selectedIndex: number | null;
  onSelect: (index: number) => void;
  showResult?: boolean;
}

export default function QuestionCard({ question, selectedIndex, onSelect, showResult }: Props) {
  const feedback = useMemo(() => {
    if (!showResult || selectedIndex === null) return null;
    const isCorrect = selectedIndex === question.correct_index;
    return isCorrect ? '正解！' : '残念、不正解';
  }, [question.correct_index, selectedIndex, showResult]);

  return (
    <div className="grid" style={{ gap: 12 }}>
      <div>
        <div className="badge" style={{ marginBottom: 8 }}>
          <span>{question.category}</span>
          <span>{question.difficulty}</span>
        </div>
        <h2>{question.question}</h2>
      </div>
      <div className="grid" style={{ gap: 10 }}>
        {question.choices.map((choice, idx) => {
          const isCorrect = idx === question.correct_index;
          const selected = selectedIndex === idx;
          const resultClass =
            showResult && selected
              ? isCorrect
                ? 'correct'
                : 'wrong'
              : showResult && isCorrect
                ? 'correct'
                : '';
          return (
            <button
              key={choice}
              className={`choice-button ${resultClass}`.trim()}
              onClick={() => onSelect(idx)}
              disabled={showResult}
            >
              {choice}
            </button>
          );
        })}
      </div>
      {feedback ? <p>{feedback}</p> : null}
    </div>
  );
}

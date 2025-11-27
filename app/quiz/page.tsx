'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/card';
import Button from '@/components/ui/button';
import QuestionCard from '@/components/quiz/question-card';
import Timer from '@/components/quiz/timer';
import ProgressBar from '@/components/quiz/progress-bar';
import type { Question, QuestionsResponse } from '@/lib/quiz';
import { DEFAULT_TIMER_SECONDS, QUESTION_COUNT, shuffleQuestions } from '@/lib/quiz';

export default function QuizPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(DEFAULT_TIMER_SECONDS);
  const [score, setScore] = useState(0);
  const [totalTimeMs, setTotalTimeMs] = useState(0);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      const res = await fetch('/api/questions');
      if (!res.ok) {
        setLoading(false);
        return;
      }
      const data: QuestionsResponse = await res.json();
      setQuestions(shuffleQuestions(data.questions));
      setLoading(false);
    };
    fetchQuestions();
  }, []);

  useEffect(() => {
    if (loading || questions.length === 0) return undefined;
    if (secondsLeft <= 0) {
      handleAnswer(null);
      return undefined;
    }
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft, loading, questions.length]);

  const currentQuestion = useMemo(() => questions[currentIndex], [questions, currentIndex]);

  const handleAnswer = (choiceIndex: number | null) => {
    if (!currentQuestion) return;
    const timeSpent = DEFAULT_TIMER_SECONDS - secondsLeft;
    setTotalTimeMs((prev) => prev + timeSpent * 1000);

    const isCorrect = choiceIndex !== null && choiceIndex === currentQuestion.correct_index;
    const gained = isCorrect ? 100 + secondsLeft : 0;
    setScore((prev) => prev + gained);
    setSelectedIndex(choiceIndex);

    setTimeout(() => {
      const nextIndex = currentIndex + 1;
      if (nextIndex >= QUESTION_COUNT || nextIndex >= questions.length) {
        router.push(
          `/result?score=${score + gained}&totalQuestions=${QUESTION_COUNT}&timeMs=${totalTimeMs + timeSpent * 1000}`
        );
        return;
      }
      setCurrentIndex(nextIndex);
      setSecondsLeft(DEFAULT_TIMER_SECONDS);
      setSelectedIndex(null);
    }, 800);
  };

  if (loading) {
    return <p>読み込み中...</p>;
  }

  if (!currentQuestion) {
    return <p>問題を読み込めませんでした。</p>;
  }

  return (
    <Card title="クイズ">
      <div className="flex-between" style={{ marginBottom: 12 }}>
        <ProgressBar currentIndex={currentIndex} />
        <Timer seconds={secondsLeft} />
      </div>
      <QuestionCard
        question={currentQuestion}
        selectedIndex={selectedIndex}
        onSelect={handleAnswer}
        showResult={selectedIndex !== null}
      />
      <div style={{ marginTop: 12 }}>
        <Button
          variant="secondary"
          onClick={() =>
            router.push(
              `/result?score=${score}&totalQuestions=${currentIndex + 1}&timeMs=${totalTimeMs +
                (DEFAULT_TIMER_SECONDS - secondsLeft) * 1000}`
            )
          }
        >
          途中で終了
        </Button>
      </div>
    </Card>
  );
}

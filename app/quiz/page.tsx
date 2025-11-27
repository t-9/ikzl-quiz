'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import ProgressBar from '@/components/quiz/progress-bar';
import QuestionCard from '@/components/quiz/question-card';
import Timer from '@/components/quiz/timer';
import Button from '@/components/ui/button';
import Card from '@/components/ui/card';
import type { Question, QuestionsResponse } from '@/lib/quiz';
import { DEFAULT_TIMER_SECONDS, QUESTION_COUNT, shuffleQuestions } from '@/lib/quiz';

type FetchState = 'idle' | 'loading' | 'ready' | 'error';

export default function QuizPage() {
  const router = useRouter();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [fetchState, setFetchState] = useState<FetchState>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [questionTimeLeft, setQuestionTimeLeft] = useState(DEFAULT_TIMER_SECONDS);
  const [score, setScore] = useState(0);
  const [elapsedMs, setElapsedMs] = useState(0);

  const quizStartRef = useRef<number | null>(null);

  const currentQuestion = useMemo(
    () => questions[currentIndex],
    [questions, currentIndex]
  );

  const totalQuestionLimit = Math.min(QUESTION_COUNT, questions.length || QUESTION_COUNT);

  const getElapsedMs = () => {
    if (quizStartRef.current) {
      return performance.now() - quizStartRef.current;
    }
    return elapsedMs;
  };

  const navigateToResult = (finalScore: number, totalQuestions: number) => {
    const totalTime = Math.round(getElapsedMs());
    router.push(`/result?score=${finalScore}&totalQuestions=${totalQuestions}&timeMs=${totalTime}`);
  };

  useEffect(() => {
    if (fetchState !== 'idle') return undefined;

    let active = true;
    const controller = new AbortController();

    const fetchQuestions = async () => {
      setFetchState('loading');
      setErrorMessage('');

      try {
        const response = await fetch('/api/questions', { signal: controller.signal });

        if (!response.ok) {
          throw new Error('問題を取得できませんでした。しばらくしてから再度お試しください。');
        }

        const data: QuestionsResponse = await response.json();
        if (!active) return;

        const randomizedQuestions = shuffleQuestions(data.questions).slice(0, QUESTION_COUNT);
        setQuestions(randomizedQuestions);
        setCurrentIndex(0);
        setScore(0);
        setSelectedIndex(null);
        setQuestionTimeLeft(DEFAULT_TIMER_SECONDS);
        quizStartRef.current = performance.now();
        setFetchState('ready');
      } catch (error) {
        if (!active) return;
        const fallbackMessage =
          error instanceof Error && error.message
            ? error.message
            : '問題の取得中にエラーが発生しました。';
        setErrorMessage(fallbackMessage);
        setFetchState('error');
      }
    };

    fetchQuestions();

    return () => {
      active = false;
      controller.abort();
    };
  }, [fetchState]);

  useEffect(() => {
    if (fetchState !== 'ready' || !questions.length) return undefined;

    const interval = setInterval(() => {
      if (quizStartRef.current) {
        setElapsedMs(performance.now() - quizStartRef.current);
      }
    }, 250);

    return () => clearInterval(interval);
  }, [fetchState, questions.length]);

  useEffect(() => {
    if (fetchState !== 'ready' || !currentQuestion || selectedIndex !== null) return undefined;

    if (questionTimeLeft <= 0) {
      handleAnswer(null);
      return undefined;
    }

    const timer = setTimeout(() => {
      setQuestionTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [fetchState, currentQuestion, questionTimeLeft, selectedIndex]);

  useEffect(() => {
    if (!currentQuestion) return;
    setQuestionTimeLeft(DEFAULT_TIMER_SECONDS);
    setSelectedIndex(null);
  }, [currentQuestion]);

  const handleAnswer = (choiceIndex: number | null) => {
    if (!currentQuestion || selectedIndex !== null) return;

    const selectedValue = choiceIndex ?? -1;
    const isCorrect = selectedValue === currentQuestion.correct_index;
    const bonusFromTime = Math.max(questionTimeLeft, 0);
    const gainedScore = isCorrect ? 100 + bonusFromTime : 0;
    const updatedScore = score + gainedScore;

    setScore(updatedScore);
    setSelectedIndex(selectedValue);
    setQuestionTimeLeft(0);

    const nextIndex = currentIndex + 1;
    const totalQuestions = totalQuestionLimit || QUESTION_COUNT;

    setTimeout(() => {
      if (nextIndex >= totalQuestions) {
        navigateToResult(updatedScore, totalQuestions);
        return;
      }

      setCurrentIndex(nextIndex);
    }, 700);
  };

  const handleExitEarly = () => {
    const answeredCount = Math.min(currentIndex + (selectedIndex !== null ? 1 : 0), totalQuestionLimit);
    navigateToResult(score, Math.max(answeredCount, 1));
  };

  if (fetchState === 'loading' || fetchState === 'idle') {
    return (
      <Card title="クイズ">
        <p>問題を読み込んでいます...</p>
      </Card>
    );
  }

  if (fetchState === 'error') {
    return (
      <Card title="クイズ">
        <div className="grid" style={{ gap: 12 }}>
          <p>{errorMessage || '問題の読み込みに失敗しました。'}</p>
          <Button onClick={() => setFetchState('idle')}>再読み込み</Button>
        </div>
      </Card>
    );
  }

  if (!currentQuestion) {
    return (
      <Card title="クイズ">
        <p>問題を読み込めませんでした。</p>
      </Card>
    );
  }

  return (
    <Card title="クイズ">
      <div className="flex-between" style={{ marginBottom: 12 }}>
        <ProgressBar currentIndex={currentIndex} />
        <Timer seconds={questionTimeLeft} />
      </div>

      <QuestionCard
        question={currentQuestion}
        selectedIndex={selectedIndex}
        onSelect={handleAnswer}
        showResult={selectedIndex !== null}
      />

      <div className="flex-between" style={{ marginTop: 12 }}>
        <small>経過時間: {(elapsedMs / 1000).toFixed(1)}s</small>
        <Button variant="secondary" onClick={handleExitEarly}>
          途中で終了
        </Button>
      </div>
    </Card>
  );
}

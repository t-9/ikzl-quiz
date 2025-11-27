export type Question = {
  id: string;
  category: string;
  difficulty: string;
  question: string;
  choices: string[];
  correct_index: number;
};

export type QuestionsResponse = {
  questions: Question[];
};

export type SubmitScorePayload = {
  player_name: string;
  score: number;
  total_questions: number;
  time_taken_ms: number;
};

export type LeaderboardEntry = {
  player_name: string;
  score: number;
  total_questions: number;
  time_taken_ms: number;
  created_at: string;
};

export type LeaderboardResponse = {
  entries: LeaderboardEntry[];
};

export const QUESTION_COUNT = 10;
export const DEFAULT_TIMER_SECONDS = 20;

export function shuffleQuestions(questions: Question[]): Question[] {
  const copy = [...questions];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

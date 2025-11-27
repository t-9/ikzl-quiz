import { NextResponse } from 'next/server';

import { supabaseServer } from '@/lib/supabase-client';
import type { Question, QuestionsResponse } from '@/lib/quiz';
import { QUESTION_COUNT } from '@/lib/quiz';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
} as const;

const CACHE_HEADERS = {
  'Cache-Control': 'no-store',
} as const;

function jsonResponse<T>(body: T, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: {
      ...CORS_HEADERS,
      ...CACHE_HEADERS,
    },
  });
}

function errorResponse(message: string, status: number) {
  return jsonResponse({ error: message }, status);
}

function normalizeQuestion(record: Record<string, unknown>): Question | null {
  const { id, category, difficulty, question, choices, correct_index } = record;

  if (
    (typeof id === 'string' || typeof id === 'number') &&
    typeof category === 'string' &&
    typeof difficulty === 'string' &&
    typeof question === 'string' &&
    Array.isArray(choices) &&
    choices.every((choice) => typeof choice === 'string') &&
    typeof correct_index === 'number'
  ) {
    return {
      id: String(id),
      category,
      difficulty,
      question,
      choices,
      correct_index,
    };
  }

  return null;
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      ...CORS_HEADERS,
      ...CACHE_HEADERS,
    },
  });
}

export async function GET() {
  try {
    const { data, error } = await supabaseServer
      .from('questions')
      .select('id, category, difficulty, question, choices, correct_index')
      .eq('is_active', true)
      .order('random')
      .limit(QUESTION_COUNT);

    if (error) {
      return errorResponse('failed to fetch questions', 500);
    }

    if (!data || data.length === 0) {
      return errorResponse('no active questions found', 404);
    }

    const normalizedQuestions = data.map((item) => normalizeQuestion(item)).filter(Boolean) as Question[];

    if (normalizedQuestions.length !== data.length) {
      return errorResponse('received invalid question data from database', 502);
    }

    const response: QuestionsResponse = { questions: normalizedQuestions };

    return jsonResponse(response, 200);
  } catch (e) {
    return errorResponse('unexpected error while fetching questions', 500);
  }
}

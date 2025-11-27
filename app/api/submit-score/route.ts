import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-client';
import type { SubmitScorePayload } from '@/lib/quiz';

function validatePayload(body: unknown): { data?: SubmitScorePayload; errors?: string[] } {
  if (typeof body !== 'object' || body === null) {
    return { errors: ['request body must be an object'] };
  }

  const {
    player_name: playerName,
    score,
    total_questions: totalQuestions,
    time_taken_ms: timeTakenMs,
  } = body as Partial<SubmitScorePayload>;

  const errors: string[] = [];

  if (typeof playerName !== 'string' || !playerName.trim()) {
    errors.push('player_name must be a non-empty string');
  }

  if (typeof score !== 'number' || !Number.isFinite(score) || score < 0) {
    errors.push('score must be a non-negative number');
  }

  if (
    typeof totalQuestions !== 'number' ||
    !Number.isInteger(totalQuestions) ||
    totalQuestions <= 0
  ) {
    errors.push('total_questions must be a positive integer');
  }

  if (
    typeof timeTakenMs !== 'number' ||
    !Number.isFinite(timeTakenMs) ||
    timeTakenMs < 0
  ) {
    errors.push('time_taken_ms must be a non-negative number');
  }

  if (errors.length > 0) {
    return { errors };
  }

  return {
    data: {
      player_name: playerName.trim(),
      score,
      total_questions: totalQuestions,
      time_taken_ms: timeTakenMs,
    },
  } as { data: SubmitScorePayload };
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch (error) {
    return NextResponse.json({ error: 'invalid json body' }, { status: 400 });
  }

  const { data, errors } = validatePayload(body);

  if (errors) {
    return NextResponse.json({ error: 'invalid payload', details: errors }, { status: 400 });
  }

  const { data: created, error } = await supabaseServer
    .from('quiz_results')
    .insert(data)
    .select('id, player_name, score, total_questions, time_taken_ms, created_at')
    .single();

  if (error || !created) {
    return NextResponse.json({ error: 'failed to save score' }, { status: 500 });
  }

  return NextResponse.json({ result: created }, { status: 201 });
}

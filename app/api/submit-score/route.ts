import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-client';
import type { SubmitScorePayload } from '@/lib/quiz';

export async function POST(request: Request) {
  const body = (await request.json()) as SubmitScorePayload;
  if (!body.player_name || typeof body.score !== 'number') {
    return NextResponse.json({ error: 'invalid payload' }, { status: 400 });
  }

  const { error } = await supabaseServer.from('quiz_results').insert({
    player_name: body.player_name,
    score: body.score,
    total_questions: body.total_questions,
    time_taken_ms: body.time_taken_ms,
  });

  if (error) {
    return NextResponse.json({ error: 'failed to save score' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

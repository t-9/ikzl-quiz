import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-client';
import type { LeaderboardResponse } from '@/lib/quiz';

export async function GET() {
  try {
    const { data, error, status } = await supabaseServer
      .from('quiz_results')
      .select('player_name, score, total_questions, time_taken_ms, created_at')
      .order('score', { ascending: false })
      .order('time_taken_ms', { ascending: true })
      .order('created_at', { ascending: false })
      .limit(10);

    if (error || !data) {
      const statusCode = error?.status ?? status;
      const normalizedStatus = statusCode && statusCode >= 400 && statusCode <= 599 ? statusCode : 500;
      return NextResponse.json({ error: 'failed to fetch leaderboard' }, { status: normalizedStatus });
    }

    const response: LeaderboardResponse = { entries: data };
    return NextResponse.json(response);
  } catch (err) {
    return NextResponse.json({ error: 'internal server error' }, { status: 500 });
  }
}

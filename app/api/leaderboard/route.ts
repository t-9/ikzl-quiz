import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-client';

export async function GET() {
  const { data, error } = await supabaseServer
    .from('quiz_results')
    .select('player_name, score, total_questions, time_taken_ms, created_at')
    .order('score', { ascending: false })
    .order('time_taken_ms', { ascending: true })
    .order('created_at', { ascending: false })
    .limit(10);

  if (error || !data) {
    return NextResponse.json({ error: 'failed to fetch leaderboard' }, { status: 500 });
  }

  return NextResponse.json({ entries: data });
}

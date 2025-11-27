import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-client';
import { QUESTION_COUNT, shuffleQuestions } from '@/lib/quiz';

export async function GET() {
  const { data, error } = await supabaseServer
    .from('questions')
    .select('*')
    .eq('is_active', true);

  if (error || !data) {
    return NextResponse.json({ error: 'failed to fetch questions' }, { status: 500 });
  }

  const randomized = shuffleQuestions(data).slice(0, QUESTION_COUNT);

  return NextResponse.json({ questions: randomized });
}

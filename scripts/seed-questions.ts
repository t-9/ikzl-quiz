import fs from 'fs';
import path from 'path';

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL in .env.local');
  process.exit(1);
}

if (!serviceRoleKey) {
  console.error('Missing SUPABASE_SERVICE_ROLE_KEY in .env.local. Use this key only in local development.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

type RawQuestion = {
  category?: unknown;
  difficulty?: unknown;
  question?: unknown;
  choices?: unknown;
  correct_index?: unknown;
  is_active?: unknown;
};

type SeedQuestion = {
  category: string;
  difficulty: string;
  question: string;
  choices: string[];
  correct_index: number;
  is_active: boolean;
};

function parseQuestions(filePath: string): SeedQuestion[] {
  const json = fs.readFileSync(filePath, 'utf-8');
  const payload: unknown = JSON.parse(json);

  if (!Array.isArray(payload)) {
    throw new Error('questions.sample.json must contain an array');
  }

  return payload.map((entry: RawQuestion, index) => {
    const { category, difficulty, question, choices, correct_index, is_active } = entry;

    if (
      typeof category !== 'string' ||
      typeof difficulty !== 'string' ||
      typeof question !== 'string' ||
      !Array.isArray(choices) ||
      !choices.every((choice) => typeof choice === 'string') ||
      typeof correct_index !== 'number'
    ) {
      throw new Error(`Invalid question format at index ${index}`);
    }

    return {
      category,
      difficulty,
      question,
      choices,
      correct_index,
      is_active: typeof is_active === 'boolean' ? is_active : true,
    } satisfies SeedQuestion;
  });
}

async function seedQuestions() {
  const filePath = path.resolve(process.cwd(), 'questions.sample.json');
  const questions = parseQuestions(filePath);

  if (questions.length === 0) {
    console.log('No questions found in sample file. Nothing to insert.');
    return;
  }

  const questionTexts = questions.map((q) => q.question);

  console.log('Removing existing records for provided questions...');
  const { error: deleteError } = await supabase
    .from('questions')
    .delete()
    .in('question', questionTexts);

  if (deleteError) {
    throw new Error(`Failed to delete existing questions: ${deleteError.message}`);
  }

  console.log('Inserting questions...');
  const { data, error: insertError } = await supabase
    .from('questions')
    .insert(questions)
    .select('id, question');

  if (insertError) {
    throw new Error(`Failed to insert questions: ${insertError.message}`);
  }

  console.log(`Seeded ${data?.length ?? 0} questions.`);
}

seedQuestions()
  .then(() => {
    console.log('Done.');
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

import { supabaseServer } from '@/lib/supabase-client';

vi.mock('@/lib/supabase-client', () => {
  const from = vi.fn();
  return { supabaseServer: { from } };
});

const mockedSupabase = supabaseServer as unknown as {
  from: ReturnType<typeof vi.fn> & {
    mockReturnValue: typeof vi.fn;
  };
};

function mockQuestionsQuery(result: unknown) {
  const chain = {
    select: vi.fn(),
    eq: vi.fn(),
    order: vi.fn(),
    limit: vi.fn(),
  };

  chain.select.mockReturnValue(chain);
  chain.eq.mockReturnValue(chain);
  chain.order.mockReturnValue(chain);
  chain.limit.mockResolvedValue(result);

  mockedSupabase.from.mockReturnValue(chain as never);
  return chain;
}

describe('GET /api/questions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns normalized questions with cache and cors headers', async () => {
    const questions = [
      {
        id: '1',
        category: 'tech',
        difficulty: 'easy',
        question: 'What is JS?',
        choices: ['Language', 'Framework'],
        correct_index: 0,
      },
    ];

    mockQuestionsQuery({ data: questions, error: null });

    const { GET } = await import('./route');
    const response = await GET();
    const body = await response.json();

    expect(mockedSupabase.from).toHaveBeenCalledWith('questions');
    expect(response.status).toBe(200);
    expect(body).toEqual({ questions });
    expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
    expect(response.headers.get('Cache-Control')).toBe('no-store');
  });

  it('returns 404 when no active questions are found', async () => {
    mockQuestionsQuery({ data: [], error: null });

    const { GET } = await import('./route');
    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body.error).toMatch(/no active questions/);
  });

  it('returns 500 when database query fails', async () => {
    mockQuestionsQuery({ data: null, error: { message: 'db down' } });

    const { GET } = await import('./route');
    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.error).toMatch(/failed to fetch questions/);
  });

  it('returns 502 when payload is malformed', async () => {
    const malformed = [{ id: null, category: 'tech', difficulty: 'easy', question: 'Q', choices: [], correct_index: 0 }];
    mockQuestionsQuery({ data: malformed, error: null });

    const { GET } = await import('./route');
    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(502);
    expect(body.error).toMatch(/invalid question data/);
  });
});

describe('OPTIONS /api/questions', () => {
  it('returns preflight headers', async () => {
    const { OPTIONS } = await import('./route');
    const response = await OPTIONS();

    expect(response.status).toBe(204);
    expect(response.headers.get('Access-Control-Allow-Methods')).toContain('GET');
    expect(response.headers.get('Cache-Control')).toBe('no-store');
  });
});

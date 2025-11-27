import { supabaseServer } from '@/lib/supabase-client';

vi.mock('@/lib/supabase-client', () => {
  const from = vi.fn();
  return { supabaseServer: { from } };
});

const mockedSupabase = supabaseServer as unknown as {
  from: ReturnType<typeof vi.fn> & { mockReturnValue: typeof vi.fn };
};

function mockInsert(result: unknown) {
  const chain = {
    insert: vi.fn(),
    select: vi.fn(),
    single: vi.fn(),
  };

  chain.insert.mockReturnValue(chain);
  chain.select.mockReturnValue(chain);
  chain.single.mockResolvedValue(result);

  mockedSupabase.from.mockReturnValue(chain as never);
  return chain;
}

describe('POST /api/submit-score', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 400 for invalid json', async () => {
    const { POST } = await import('./route');
    const request = new Request('http://localhost/api/submit-score', {
      method: 'POST',
      body: '{bad json',
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toBe('invalid json body');
  });

  it('validates payload and returns 400 with details', async () => {
    const { POST } = await import('./route');
    const request = new Request('http://localhost/api/submit-score', {
      method: 'POST',
      body: JSON.stringify({ player_name: '', score: -1, total_questions: 0, time_taken_ms: -5 }),
      headers: { 'Content-Type': 'application/json' },
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toBe('invalid payload');
    expect(body.details).toHaveLength(4);
  });

  it('persists a valid score and returns the created record', async () => {
    const created = {
      id: '1',
      player_name: 'Bob',
      score: 8,
      total_questions: 10,
      time_taken_ms: 9000,
      created_at: '2024-01-02T00:00:00Z',
    };

    const chain = mockInsert({ data: created, error: null });

    const { POST } = await import('./route');
    const request = new Request('http://localhost/api/submit-score', {
      method: 'POST',
      body: JSON.stringify({
        player_name: '  Bob  ',
        score: 8,
        total_questions: 10,
        time_taken_ms: 9000,
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    const response = await POST(request);
    const body = await response.json();

    expect(mockedSupabase.from).toHaveBeenCalledWith('quiz_results');
    expect(chain.insert).toHaveBeenCalledWith({
      player_name: 'Bob',
      score: 8,
      total_questions: 10,
      time_taken_ms: 9000,
    });
    expect(response.status).toBe(201);
    expect(body.result).toEqual(created);
  });

  it('returns 500 when insert fails', async () => {
    mockInsert({ data: null, error: { message: 'db error' } });

    const { POST } = await import('./route');
    const request = new Request('http://localhost/api/submit-score', {
      method: 'POST',
      body: JSON.stringify({
        player_name: 'Carol',
        score: 5,
        total_questions: 10,
        time_taken_ms: 8000,
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.error).toBe('failed to save score');
  });
});

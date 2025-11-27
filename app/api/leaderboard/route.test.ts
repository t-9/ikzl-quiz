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

function mockLeaderboardQuery(result: unknown) {
  const chain = {
    select: vi.fn(),
    order: vi.fn(),
    limit: vi.fn(),
  };

  chain.select.mockReturnValue(chain);
  chain.order.mockReturnValue(chain);
  chain.limit.mockResolvedValue(result);

  mockedSupabase.from.mockReturnValue(chain as never);
  return chain;
}

describe('GET /api/leaderboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns leaderboard entries sorted correctly', async () => {
    const entries = [
      {
        player_name: 'Alice',
        score: 9,
        total_questions: 10,
        time_taken_ms: 10000,
        created_at: '2024-01-01T00:00:00Z',
      },
    ];

    const chain = mockLeaderboardQuery({ data: entries, error: null, status: 200 });

    const { GET } = await import('./route');
    const response = await GET();
    const body = await response.json();

    expect(mockedSupabase.from).toHaveBeenCalledWith('quiz_results');
    expect(chain.order).toHaveBeenCalledTimes(3);
    expect(chain.limit).toHaveBeenCalledWith(10);
    expect(response.status).toBe(200);
    expect(body).toEqual({ entries });
  });

  it('returns normalized status when supabase returns an error', async () => {
    mockLeaderboardQuery({ data: null, error: { status: 503 }, status: 503 });

    const { GET } = await import('./route');
    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(503);
    expect(body.error).toMatch(/failed to fetch leaderboard/);
  });

  it('returns 500 for unexpected failures', async () => {
    const { GET } = await import('./route');

    mockedSupabase.from.mockImplementation(() => {
      throw new Error('unexpected');
    });

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.error).toBe('internal server error');
  });
});

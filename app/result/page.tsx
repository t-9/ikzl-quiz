'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Card from '@/components/ui/card';
import Input from '@/components/ui/input';
import Button from '@/components/ui/button';
import LeaderboardTable from '@/components/result/leaderboard-table';
import type { LeaderboardEntry, LeaderboardResponse, SubmitScorePayload } from '@/lib/quiz';

export default function ResultPage() {
  const searchParams = useSearchParams();
  const [playerName, setPlayerName] = useState('');
  const [saving, setSaving] = useState(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [error, setError] = useState('');
  const score = Number(searchParams.get('score') ?? 0);
  const totalQuestions = Number(searchParams.get('totalQuestions') ?? 10);
  const timeMs = Number(searchParams.get('timeMs') ?? 0);

  const canSubmit = useMemo(() => playerName.trim().length > 0 && !saving, [playerName, saving]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const res = await fetch('/api/leaderboard');
      if (!res.ok) return;
      const data: LeaderboardResponse = await res.json();
      setLeaderboard(data.entries);
    };
    fetchLeaderboard();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError('');
    const payload: SubmitScorePayload = {
      player_name: playerName.trim(),
      score,
      total_questions: totalQuestions,
      time_taken_ms: timeMs,
    };
    const res = await fetch('/api/submit-score', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      setError('スコアの保存に失敗しました');
    }
    setSaving(false);
    const refreshed = await fetch('/api/leaderboard');
    if (refreshed.ok) {
      const data: LeaderboardResponse = await refreshed.json();
      setLeaderboard(data.entries);
    }
  };

  return (
    <div className="grid" style={{ gap: 16 }}>
      <Card title="結果">
        <p>あなたのスコア: {score}</p>
        <p>解答数: {totalQuestions}問</p>
        <p>経過時間: {(timeMs / 1000).toFixed(1)} 秒</p>
        <div className="grid" style={{ gap: 10, marginTop: 12 }}>
          <Input
            placeholder="ニックネームを入力"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
          />
          <Button onClick={handleSave} disabled={!canSubmit}>
            ランキングに登録
          </Button>
          {error ? <small style={{ color: '#ef4444' }}>{error}</small> : null}
        </div>
      </Card>
      <Card title="グローバルランキング Top10">
        {leaderboard.length === 0 ? <p>まだランキングがありません。</p> : <LeaderboardTable entries={leaderboard} />}
      </Card>
    </div>
  );
}

import type { LeaderboardEntry } from '@/lib/quiz';
import { Table, TBody, TD, TH, THead } from '@/components/ui/table';

interface Props {
  entries: LeaderboardEntry[];
}

export default function LeaderboardTable({ entries }: Props) {
  return (
    <Table>
      <THead>
        <tr>
          <TH>順位</TH>
          <TH>名前</TH>
          <TH>スコア</TH>
          <TH>タイム</TH>
          <TH>日付</TH>
        </tr>
      </THead>
      <TBody>
        {entries.map((entry, idx) => (
          <tr key={`${entry.player_name}-${entry.created_at}`}>
            <TD>{idx + 1}</TD>
            <TD>{entry.player_name}</TD>
            <TD>{entry.score}</TD>
            <TD>{(entry.time_taken_ms / 1000).toFixed(1)}s</TD>
            <TD>{new Date(entry.created_at).toLocaleDateString('ja-JP')}</TD>
          </tr>
        ))}
      </TBody>
    </Table>
  );
}

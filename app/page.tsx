import Link from 'next/link';
import Card from '@/components/ui/card';
import Button from '@/components/ui/button';

export default function HomePage() {
  return (
    <div className="grid" style={{ gap: 20 }}>
      <Card title="IKZL Quiz" subtitle="10問のシングルプレイクイズに挑戦しよう！">
        <p>・1問ずつ4択で回答</p>
        <p>・正解するとスコアを獲得、タイマーが早いほどボーナス</p>
        <p>・結果画面でニックネームを登録してグローバルランキングへ</p>
        <div style={{ marginTop: 16 }}>
          <Link href="/quiz">
            <Button>スタート</Button>
          </Link>
        </div>
      </Card>
      <Card title="ランキング">
        <p>トップ10をチェックしよう。あなたは何位に入れる？</p>
        <Link href="/result">
          <Button variant="secondary">ランキングを見る</Button>
        </Link>
      </Card>
    </div>
  );
}

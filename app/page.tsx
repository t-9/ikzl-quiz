import Link from 'next/link';
import Card from '@/components/ui/card';
import Button from '@/components/ui/button';

export default function HomePage() {
  return (
    <div className="grid" style={{ gap: 20 }}>
      <Card
        title="IKZL Quiz"
        subtitle="10問のシングルプレイクイズに挑戦しよう！"
      >
        <div className="space-y-3">
          <p>4択問題をテンポ良く解いて、タイマーが残っているほどスコアが伸びます。</p>
          <p>全問クリア後に表示される結果画面からニックネームを登録して、ランキングへ挑戦しよう。</p>
          <div className="flex" style={{ gap: 12, alignItems: 'center' }}>
            <Link href="/quiz">
              <Button>スタート</Button>
            </Link>
            <small>所要時間: 約3分</small>
          </div>
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

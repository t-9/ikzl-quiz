import Link from 'next/link';

export default function Header() {
  return (
    <header>
      <div className="header-inner">
        <Link href="/">
          <h3>IKZL Quiz</h3>
        </Link>
        <div className="flex" style={{ gap: 8 }}>
          <Link className="btn btn-secondary" href="/quiz">
            スタート
          </Link>
          <Link className="btn btn-secondary" href="/result">
            ランキング
          </Link>
        </div>
      </div>
    </header>
  );
}

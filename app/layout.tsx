import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/header';
import { cn } from '@/components/ui/utils';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'IKZL Quiz',
  description: '10問クイズで遊んでランキングに挑戦',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className="theme-root" suppressHydrationWarning>
      <body className={cn(inter.className, 'app-body')} data-theme="dark">
        <Header />
        <main className="page-container">{children}</main>
      </body>
    </html>
  );
}

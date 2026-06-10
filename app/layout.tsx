import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'Jericho21q Top-Up',
  description: 'Digital product top-up storefront for pulsa, data packages, and game vouchers.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
          <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <Link href="/" className="text-lg font-black tracking-tight text-brand-900">
              Jericho21q Top-Up
            </Link>
            <div className="flex gap-4 text-sm font-semibold text-slate-600">
              <Link href="/">Catalog</Link>
              <Link href="/admin">Admin</Link>
            </div>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}

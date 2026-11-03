import type { Metadata } from 'next';
import './globals.css';
import Navbar from './components/Navbar';

export const metadata: Metadata = {
  title: 'Gaming Arena | Online Web Games',
  description: 'Play high-performance browser games instantly. Free to play, global leaderboards, zero installation needed.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0b0d14] text-slate-100 min-h-screen antialiased selection:bg-emerald-500 selection:text-black">
        <div className="relative flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">{children}</main>
          <footer className="border-t border-slate-800/80 bg-[#10131d] py-6 text-xs text-slate-500">
            <div className="mx-auto max-w-7xl px-4 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <p>© {new Date().getFullYear()} Gaming Arena. All rights reserved.</p>
              </div>
              <div className="flex items-center gap-4 text-slate-400">
                <span className="hover:text-emerald-400 transition-colors cursor-pointer">Instant Play</span>
                <span>•</span>
                <span className="hover:text-emerald-400 transition-colors cursor-pointer">Global Leaderboards</span>
                <span>•</span>
                <span className="hover:text-emerald-400 transition-colors cursor-pointer">No Installs</span>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}

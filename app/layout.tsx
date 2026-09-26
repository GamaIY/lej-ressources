import type { Metadata, Viewport } from 'next';
import Link from 'next/link';
import { BandeauConfidentialite } from '@/components/BandeauConfidentialite';
import './globals.css';

const siteName = 'LEJ';

export const metadata: Metadata = {
  title: {
    default: `${siteName} — Ressources`,
    template: `%s · ${siteName}`,
  },
  description:
    'Cours, syntheses, anciennes interrogations et examens, classes par matiere.',
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8fafc' },
    { media: '(prefers-color-scheme: dark)', color: '#020617' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="min-h-dvh bg-slate-50 text-slate-900 antialiased dark:bg-slate-950 dark:text-slate-100">
        <div className="page-backdrop flex min-h-dvh flex-col">
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
          <BandeauConfidentialite />
        </div>
      </body>
    </html>
  );
}

function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-slate-50/80 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-950/80">
      <div className="mx-auto flex h-16 max-w-5xl items-center gap-2 px-4 sm:gap-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-xl bg-slate-900 text-sm font-bold text-white shadow-sm transition group-hover:scale-105 dark:bg-white dark:text-slate-900">
            {siteName}
          </span>
          <span className="hidden text-[15px] font-semibold tracking-tight sm:block">
            Ressources
          </span>
        </Link>

        <nav className="ml-auto flex items-center gap-0.5 text-sm font-medium sm:gap-1">
          <Link
            href="/"
            className="rounded-lg px-2.5 py-2 text-slate-600 transition hover:bg-slate-200/60 hover:text-slate-900 sm:px-3 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-100"
          >
            Matieres
          </Link>
          <Link
            href="/recherche"
            className="rounded-lg bg-slate-900 px-3 py-2 text-white transition hover:bg-slate-700 sm:px-3.5 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
          >
            Rechercher
          </Link>
        </nav>
      </div>
    </header>
  );
}

function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 py-8 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-500">
      <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>{siteName} — ressources partagees entre etudiants.</p>
        <Link
          href="/confidentialite"
          className="text-xs underline underline-offset-2 transition hover:text-slate-900 dark:hover:text-slate-200"
        >
          Confidentialite
        </Link>
      </div>
    </footer>
  );
}

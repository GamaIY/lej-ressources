import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-32 text-center">
      <p className="text-5xl font-bold tracking-tight text-slate-300 dark:text-slate-700">404</p>
      <h1 className="mt-4 text-xl font-semibold">Page introuvable</h1>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
        Ce lien ne mene nulle part. La page a peut-etre ete renommee ou supprimee.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
      >
        Retour a l&apos;accueil
      </Link>
    </div>
  );
}

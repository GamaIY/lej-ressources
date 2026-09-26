// Les classes Tailwind doivent apparaitre litteralement dans le code source
// pour etre generees : d'ou cette table de correspondance explicite.

type Palette = {
  chip: string;
  dot: string;
  card: string;
  text: string;
  bar: string;
};

export const PALETTE: Record<string, Palette> = {
  blue: {
    chip: 'bg-blue-500/10 text-blue-700 ring-blue-500/20 dark:text-blue-300',
    dot: 'bg-blue-500',
    card: 'hover:border-blue-400/70 dark:hover:border-blue-500/60',
    text: 'text-blue-600 dark:text-blue-400',
    bar: 'bg-blue-500',
  },
  violet: {
    chip: 'bg-violet-500/10 text-violet-700 ring-violet-500/20 dark:text-violet-300',
    dot: 'bg-violet-500',
    card: 'hover:border-violet-400/70 dark:hover:border-violet-500/60',
    text: 'text-violet-600 dark:text-violet-400',
    bar: 'bg-violet-500',
  },
  emerald: {
    chip: 'bg-emerald-500/10 text-emerald-700 ring-emerald-500/20 dark:text-emerald-300',
    dot: 'bg-emerald-500',
    card: 'hover:border-emerald-400/70 dark:hover:border-emerald-500/60',
    text: 'text-emerald-600 dark:text-emerald-400',
    bar: 'bg-emerald-500',
  },
  amber: {
    chip: 'bg-amber-500/10 text-amber-700 ring-amber-500/20 dark:text-amber-300',
    dot: 'bg-amber-500',
    card: 'hover:border-amber-400/70 dark:hover:border-amber-500/60',
    text: 'text-amber-600 dark:text-amber-400',
    bar: 'bg-amber-500',
  },
  rose: {
    chip: 'bg-rose-500/10 text-rose-700 ring-rose-500/20 dark:text-rose-300',
    dot: 'bg-rose-500',
    card: 'hover:border-rose-400/70 dark:hover:border-rose-500/60',
    text: 'text-rose-600 dark:text-rose-400',
    bar: 'bg-rose-500',
  },
  cyan: {
    chip: 'bg-cyan-500/10 text-cyan-700 ring-cyan-500/20 dark:text-cyan-300',
    dot: 'bg-cyan-500',
    card: 'hover:border-cyan-400/70 dark:hover:border-cyan-500/60',
    text: 'text-cyan-600 dark:text-cyan-400',
    bar: 'bg-cyan-500',
  },
  lime: {
    chip: 'bg-lime-500/10 text-lime-700 ring-lime-500/20 dark:text-lime-300',
    dot: 'bg-lime-500',
    card: 'hover:border-lime-400/70 dark:hover:border-lime-500/60',
    text: 'text-lime-600 dark:text-lime-400',
    bar: 'bg-lime-500',
  },
  orange: {
    chip: 'bg-orange-500/10 text-orange-700 ring-orange-500/20 dark:text-orange-300',
    dot: 'bg-orange-500',
    card: 'hover:border-orange-400/70 dark:hover:border-orange-500/60',
    text: 'text-orange-600 dark:text-orange-400',
    bar: 'bg-orange-500',
  },
  fuchsia: {
    chip: 'bg-fuchsia-500/10 text-fuchsia-700 ring-fuchsia-500/20 dark:text-fuchsia-300',
    dot: 'bg-fuchsia-500',
    card: 'hover:border-fuchsia-400/70 dark:hover:border-fuchsia-500/60',
    text: 'text-fuchsia-600 dark:text-fuchsia-400',
    bar: 'bg-fuchsia-500',
  },
  slate: {
    chip: 'bg-slate-500/10 text-slate-700 ring-slate-500/20 dark:text-slate-300',
    dot: 'bg-slate-500',
    card: 'hover:border-slate-400/70 dark:hover:border-slate-500/60',
    text: 'text-slate-600 dark:text-slate-400',
    bar: 'bg-slate-500',
  },
};

export function palette(couleur: string | null | undefined): Palette {
  return PALETTE[couleur ?? 'slate'] ?? PALETTE.slate;
}

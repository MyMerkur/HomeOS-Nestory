import { Apple, PlayCircle } from "lucide-react";

export function DownloadSection({
  title,
  subtitle,
  comingSoon,
  appStore,
  playStore,
}: {
  title: string;
  subtitle: string;
  comingSoon: string;
  appStore: string;
  playStore: string;
}) {
  return (
    <section id="how-it-works" className="mx-auto max-w-4xl px-6 py-20 text-center">
      <div className="rounded-3xl bg-brand-green px-8 py-16 text-brand-cream">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
        <p className="mx-auto mt-4 max-w-xl text-brand-cream/80">{subtitle}</p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <span className="flex items-center gap-2 rounded-xl border border-brand-cream/30 bg-brand-cream/10 px-5 py-3 text-sm font-medium">
            <Apple className="h-5 w-5" />
            {appStore}
            <span className="ml-1 rounded-full bg-brand-cream/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide">
              {comingSoon}
            </span>
          </span>
          <span className="flex items-center gap-2 rounded-xl border border-brand-cream/30 bg-brand-cream/10 px-5 py-3 text-sm font-medium">
            <PlayCircle className="h-5 w-5" />
            {playStore}
            <span className="ml-1 rounded-full bg-brand-cream/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide">
              {comingSoon}
            </span>
          </span>
        </div>
      </div>
    </section>
  );
}

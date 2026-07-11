import {
  Barcode,
  ShoppingCart,
  Receipt,
  PackageSearch,
  Pill,
  PiggyBank,
  LayoutGrid,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { FeatureIcon, FeatureItem } from "@/content/types";

const ICONS: Record<FeatureIcon, LucideIcon> = {
  pantry: Barcode,
  shopping: ShoppingCart,
  bills: Receipt,
  assets: PackageSearch,
  medicine: Pill,
  waste: PiggyBank,
  widget: LayoutGrid,
  family: Users,
};

export function FeatureGrid({
  eyebrow,
  title,
  items,
}: {
  eyebrow: string;
  title: string;
  items: FeatureItem[];
}) {
  return (
    <section className="bg-white/50 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-green-dark">{eyebrow}</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">{title}</h2>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => {
            const Icon = ICONS[item.icon];
            return (
              <div
                key={item.title}
                className="rounded-2xl border border-black/5 bg-brand-cream p-6 transition-shadow hover:shadow-lg"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-green/10 text-brand-green-dark">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-base font-semibold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm text-brand-muted">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

import {
  Barcode,
  ShoppingCart,
  Receipt,
  PiggyBank,
  Users,
  Bell,
  CalendarClock,
  Wallet,
} from "lucide-react";

export type MockupVariant = "pantry" | "shopping" | "bills" | "waste" | "family";

function Chrome({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mx-auto aspect-[9/19] w-[240px] rounded-[2.5rem] border-[10px] border-neutral-900 bg-neutral-900 shadow-2xl sm:w-[260px]">
      <div className="absolute left-1/2 top-0 z-10 h-5 w-24 -translate-x-1/2 rounded-b-2xl bg-neutral-900" />
      <div className="h-full w-full overflow-hidden rounded-[2rem] bg-brand-cream">
        {children}
      </div>
    </div>
  );
}

function ScreenHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-between bg-brand-green px-4 pb-3 pt-8 text-brand-cream">
      <span className="text-sm font-semibold">{title}</span>
      <Bell className="h-4 w-4 opacity-80" />
    </div>
  );
}

function Row({
  icon,
  title,
  subtitle,
  tint,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  tint?: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-white px-3 py-2.5 shadow-sm">
      <div
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
        style={{ backgroundColor: tint ?? "#EAF1EA" }}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <div className="truncate text-xs font-medium text-neutral-800">{title}</div>
        <div className="truncate text-[10px] text-neutral-500">{subtitle}</div>
      </div>
    </div>
  );
}

export function PhoneMockup({ variant }: { variant: MockupVariant }) {
  if (variant === "pantry") {
    return (
      <Chrome>
        <ScreenHeader title="Kiler" />
        <div className="flex flex-col gap-2 p-3">
          <Row icon={<Barcode className="h-4 w-4 text-brand-green-dark" />} title="Süt" subtitle="SKT: 2 gün kaldı" />
          <Row icon={<Barcode className="h-4 w-4 text-brand-green-dark" />} title="Yumurta" subtitle="SKT: 5 gün kaldı" />
          <Row icon={<Barcode className="h-4 w-4 text-amber-700" />} title="Yoğurt" subtitle="SKT: bugün" tint="#FBEFD9" />
          <Row icon={<Barcode className="h-4 w-4 text-brand-green-dark" />} title="Ekmek" subtitle="SKT: 3 gün kaldı" />
        </div>
      </Chrome>
    );
  }

  if (variant === "shopping") {
    return (
      <Chrome>
        <ScreenHeader title="Alışveriş Listesi" />
        <div className="flex flex-col gap-2 p-3">
          <Row icon={<ShoppingCart className="h-4 w-4 text-brand-green-dark" />} title="Zeytinyağı" subtitle="Önerilen — tükenmek üzere" />
          <Row icon={<ShoppingCart className="h-4 w-4 text-brand-green-dark" />} title="Deterjan" subtitle="Önerilen" />
          <Row icon={<ShoppingCart className="h-4 w-4 text-neutral-400" />} title="Kağıt Havlu" subtitle="Manuel eklendi" />
        </div>
      </Chrome>
    );
  }

  if (variant === "bills") {
    return (
      <Chrome>
        <ScreenHeader title="Faturalar" />
        <div className="flex flex-col gap-2 p-3">
          <Row icon={<Receipt className="h-4 w-4 text-brand-green-dark" />} title="Elektrik" subtitle="Son ödeme: 3 gün" />
          <Row icon={<Wallet className="h-4 w-4 text-brand-green-dark" />} title="İnternet" subtitle="Son ödeme: 9 gün" />
          <Row icon={<CalendarClock className="h-4 w-4 text-amber-700" />} title="Buzdolabı Garantisi" subtitle="8 ay kaldı" tint="#FBEFD9" />
        </div>
      </Chrome>
    );
  }

  if (variant === "waste") {
    return (
      <Chrome>
        <ScreenHeader title="İsraf Raporu" />
        <div className="flex flex-col gap-3 p-4">
          <div className="rounded-xl bg-white p-3 shadow-sm">
            <div className="text-[10px] text-neutral-500">Bu ay israf edilen</div>
            <div className="text-xl font-semibold text-neutral-800">120 ₺</div>
            <div className="mt-2 flex items-end gap-1.5">
              {[40, 65, 30, 80, 45, 55, 25].map((h, i) => (
                <div key={i} className="w-3 rounded-t bg-brand-green/70" style={{ height: `${h * 0.5}px` }} />
              ))}
            </div>
          </div>
          <Row icon={<PiggyBank className="h-4 w-4 text-brand-green-dark" />} title="4 ürün atıldı" subtitle="Geçen aya göre %12 az" />
        </div>
      </Chrome>
    );
  }

  return (
    <Chrome>
      <ScreenHeader title="Ev Üyeleri" />
      <div className="flex flex-col gap-2 p-3">
        <Row icon={<Users className="h-4 w-4 text-brand-green-dark" />} title="Ayşe süt ekledi" subtitle="2 dakika önce" />
        <Row icon={<Users className="h-4 w-4 text-brand-green-dark" />} title="Mehmet listeyi güncelledi" subtitle="1 saat önce" />
        <Row icon={<Bell className="h-4 w-4 text-amber-700" />} title="Fatura hatırlatması gönderildi" subtitle="Bugün" tint="#FBEFD9" />
      </div>
    </Chrome>
  );
}

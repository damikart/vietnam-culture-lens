import { getEntitiesByCategory } from "@/lib/data";
import { CategorySection } from "@/components/landing/CategorySection";
import type { LandingCategory } from "@/lib/types";
import Link from "next/link";

const CATEGORIES: LandingCategory[] = ["tuc-ngu", "tu-ngu", "tin-nguong"];

export default function Home() {
  const categorized = CATEGORIES.map((cat) => ({
    category: cat,
    entities: getEntitiesByCategory(cat),
  }));

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <header className="px-5 pt-16 pb-12 md:pt-24 md:pb-16">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            Lật Văn Hóa
          </h1>
          <p className="mt-3 text-base leading-relaxed text-on-surface-muted md:text-lg">
            Chọn một thứ quen thuộc — câu tục ngữ, từ ngữ, tín ngưỡng — rồi
            xem chiều sâu ẩn bên dưới, qua góc nhìn của 4 học giả.
          </p>
          <Link
            href="/hoc-gia"
            className="mt-4 inline-block text-sm text-on-surface-muted hover:text-on-surface transition-colors underline underline-offset-4 decoration-white/20 hover:decoration-white/40"
          >
            Về 4 học giả →
          </Link>
        </div>
      </header>

      {/* Categories */}
      <main className="px-5 pb-20">
        <div className="mx-auto max-w-2xl space-y-12 md:grid md:grid-cols-3 md:gap-8 md:space-y-0 md:max-w-5xl">
          {categorized.map(({ category, entities }) => (
            <CategorySection
              key={category}
              category={category}
              entities={entities}
            />
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] px-5 py-8">
        <div className="mx-auto max-w-2xl text-center text-xs text-on-surface-muted">
          <p>
            Dữ liệu từ 4 công trình nghiên cứu: Cao Xuân Hạo, Ngô Đức Thịnh,
            Trần Ngọc Thêm, Trần Quốc Vượng.
          </p>
        </div>
      </footer>
    </div>
  );
}

import Link from "next/link";
import type { Metadata } from "next";
import { SCHOLARS, SCHOLAR_IDS } from "@/lib/scholars";
import { getEntitiesByScholar } from "@/lib/data";
import { BackLink } from "@/components/ui/BackLink";

export const metadata: Metadata = {
  title: "Học giả — Lật Văn Hóa",
  description: "4 học giả, 4 góc nhìn khác nhau về văn hóa Việt Nam.",
};

export default function ScholarListPage() {
  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-2xl px-5 pt-8 pb-20">
        <div className="mb-8">
          <BackLink />
        </div>

        <h1 className="text-2xl font-bold mb-2">4 Học giả</h1>
        <p className="text-on-surface-muted mb-8">
          Mỗi người mang một lăng kính riêng để nhìn văn hóa Việt Nam.
        </p>

        <div className="grid gap-4">
          {SCHOLAR_IDS.map((id) => {
            const scholar = SCHOLARS[id];
            const count = getEntitiesByScholar(id).length;

            return (
              <Link
                key={id}
                href={`/hoc-gia/${scholar.slug}`}
                className="group block rounded-lg border border-white/[0.06] bg-surface-card p-5 transition-all hover:border-white/[0.12] hover:bg-surface-elevated"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: scholar.color }}
                  />
                  <span className="text-lg font-semibold group-hover:text-white transition-colors">
                    {scholar.name}
                  </span>
                </div>
                <p
                  className="text-sm font-medium mb-2"
                  style={{ color: scholar.color }}
                >
                  {scholar.field}
                </p>
                <p className="text-sm text-on-surface-muted leading-relaxed line-clamp-2">
                  {scholar.description}
                </p>
                <p className="mt-2 text-xs text-on-surface-muted">
                  {count} mục
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

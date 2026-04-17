import Link from "next/link";
import type { IndexedEntity, EntityType } from "@/lib/types";

const TYPE_LABELS: Record<EntityType, string> = {
  concept: "Khái niệm",
  misconception: "Quan niệm sai lầm",
  term: "Từ ngữ",
  proverb: "Tục ngữ",
  comparison: "So sánh văn hóa",
  symbol: "Biểu tượng",
  region: "Vùng văn hóa",
};

const TYPE_ORDER: EntityType[] = [
  "concept",
  "misconception",
  "term",
  "proverb",
  "symbol",
  "comparison",
  "region",
];

export function ScholarItemList({ entities }: { entities: IndexedEntity[] }) {
  const grouped = new Map<EntityType, IndexedEntity[]>();
  for (const e of entities) {
    const list = grouped.get(e.type) || [];
    list.push(e);
    grouped.set(e.type, list);
  }

  return (
    <div className="space-y-8">
      {TYPE_ORDER.map((type) => {
        const items = grouped.get(type);
        if (!items || items.length === 0) return null;

        return (
          <section key={type}>
            <h3 className="text-sm font-medium uppercase tracking-wider text-on-surface-muted mb-3">
              {TYPE_LABELS[type]}{" "}
              <span className="text-on-surface-muted/60">{items.length}</span>
            </h3>
            <div className="grid gap-2">
              {items.map((entity) => (
                <Link
                  key={entity.id}
                  href={`/${entity.category}/${entity.slug}`}
                  className="block rounded-lg border border-white/[0.06] bg-surface-card px-4 py-2.5 text-sm leading-relaxed transition-all hover:border-white/[0.12] hover:bg-surface-elevated"
                >
                  {entity.displayName}
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

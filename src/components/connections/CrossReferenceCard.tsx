import Link from "next/link";
import type { IndexedEntity } from "@/lib/types";
import { SCHOLARS } from "@/lib/scholars";

const CATEGORY_LABELS = {
  "tuc-ngu": "Tục ngữ",
  "tu-ngu": "Từ ngữ",
  "tin-nguong": "Tín ngưỡng/Phong tục",
} as const;

export function CrossReferenceCard({ entity }: { entity: IndexedEntity }) {
  const scholar = SCHOLARS[entity.scholarId];
  const href = `/${entity.category}/${entity.slug}`;

  return (
    <Link
      href={href}
      className="group block rounded-lg border border-white/[0.06] bg-surface-card px-4 py-3 transition-all hover:border-white/[0.12] hover:bg-surface-elevated"
    >
      <div className="flex items-center gap-2 mb-1">
        <span className="text-[10px] uppercase tracking-wider text-on-surface-muted">
          {CATEGORY_LABELS[entity.category]}
        </span>
        <span
          className="inline-block h-1.5 w-1.5 rounded-full"
          style={{ backgroundColor: scholar.color }}
        />
      </div>
      <p className="text-sm leading-relaxed text-on-surface group-hover:text-white transition-colors line-clamp-2">
        {entity.displayName}
      </p>
    </Link>
  );
}

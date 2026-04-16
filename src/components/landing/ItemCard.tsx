import Link from "next/link";
import type { IndexedEntity } from "@/lib/types";
import { SCHOLARS } from "@/lib/scholars";

export function ItemCard({ entity }: { entity: IndexedEntity }) {
  const scholar = SCHOLARS[entity.scholarId];
  const href = `/${entity.category}/${entity.slug}`;

  return (
    <Link
      href={href}
      className="group block rounded-lg border border-white/[0.06] bg-surface-card px-4 py-3 transition-all hover:border-white/[0.12] hover:bg-surface-elevated"
    >
      <p className="text-[15px] leading-relaxed text-on-surface group-hover:text-white transition-colors">
        {entity.displayName}
      </p>
      <span
        className="mt-1.5 inline-block text-xs opacity-70"
        style={{ color: scholar.color }}
      >
        {scholar.name}
      </span>
    </Link>
  );
}

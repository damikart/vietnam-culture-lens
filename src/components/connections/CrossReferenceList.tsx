import type { IndexedEntity } from "@/lib/types";
import { getRelatedEntities } from "@/lib/data";
import { CrossReferenceCard } from "./CrossReferenceCard";

export function CrossReferenceList({ entity }: { entity: IndexedEntity }) {
  const related = getRelatedEntities(entity, 4);

  if (related.length === 0) return null;

  return (
    <section className="mt-12 pt-8 border-t border-white/[0.06]">
      <h2 className="text-sm font-medium text-on-surface-muted uppercase tracking-wider mb-4">
        Khám phá thêm
      </h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {related.map((r) => (
          <CrossReferenceCard key={r.id} entity={r} />
        ))}
      </div>
    </section>
  );
}

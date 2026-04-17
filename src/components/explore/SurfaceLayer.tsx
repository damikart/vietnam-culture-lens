import type { IndexedEntity, Concept, Misconception, Term, Proverb, Comparison, CulturalSymbol } from "@/lib/types";

export function SurfaceLayer({ entity }: { entity: IndexedEntity }) {
  const { type, data, displayName } = entity;

  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-bold leading-tight md:text-3xl">
        {displayName}
      </h1>

      {type === "proverb" && (
        <>
          {(data as Proverb).text_en && (
            <p className="text-sm text-on-surface-muted italic">
              {(data as Proverb).text_en}
            </p>
          )}
        </>
      )}

      {type === "term" && (
        <div className="space-y-2">
          <p className="text-base text-on-surface-muted">
            <span className="text-on-surface font-medium">Nghĩa thông thường: </span>
            {(data as Term).surface_meaning}
          </p>
        </div>
      )}

      {type === "concept" && (
        <p className="text-base leading-relaxed text-on-surface-muted">
          {(data as Concept).definition}
        </p>
      )}

      {type === "misconception" && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/[0.05] px-4 py-3">
          <p className="text-xs font-medium uppercase tracking-wider text-red-400 mb-1">
            Điều bạn nghĩ
          </p>
          <p className="text-base leading-relaxed">
            {(data as Misconception).common_belief}
          </p>
        </div>
      )}

      {type === "symbol" && (
        <p className="text-base leading-relaxed text-on-surface-muted">
          {(data as CulturalSymbol).physical_form}
        </p>
      )}

      {type === "comparison" && (
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-white/[0.06] bg-surface-card px-4 py-3">
            <p className="text-xs font-medium uppercase tracking-wider text-on-surface-muted mb-1">
              Việt Nam
            </p>
            <p className="text-sm leading-relaxed">
              {(data as Comparison).vietnam}
            </p>
          </div>
          <div className="rounded-lg border border-white/[0.06] bg-surface-card px-4 py-3">
            <p className="text-xs font-medium uppercase tracking-wider text-on-surface-muted mb-1">
              {(data as Comparison).other_culture_name}
            </p>
            <p className="text-sm leading-relaxed">
              {(data as Comparison).other_culture}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

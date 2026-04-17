import type { IndexedEntity, Concept, Misconception, Term, CulturalSymbol, Comparison, Proverb, CulturalRegion } from "@/lib/types";
import { SCHOLARS } from "@/lib/scholars";
import { Citation } from "@/components/ui/Citation";

function getInsightContent(entity: IndexedEntity): {
  insight: string;
  evidence?: string[];
  correction?: string;
} {
  const { type, data } = entity;

  switch (type) {
    case "concept":
      return { insight: (data as Concept).key_insight };
    case "misconception":
      return {
        insight: (data as Misconception).correction,
        evidence: (data as Misconception).evidence,
        correction: (data as Misconception).correction,
      };
    case "term":
      return {
        insight: (data as Term).cultural_meaning,
      };
    case "symbol":
      return {
        insight: (data as CulturalSymbol).cultural_meaning,
      };
    case "comparison":
      return {
        insight: (data as Comparison).explanation,
      };
    case "proverb":
      return { insight: (data as Proverb).illustrates };
    case "region":
      return { insight: (data as CulturalRegion).character };
    default:
      return { insight: "" };
  }
}

export function ScholarLayer({
  entity,
  isRevealed,
  primaryRawId,
}: {
  entity: IndexedEntity;
  isRevealed: boolean;
  primaryRawId?: string;
}) {
  const scholar = SCHOLARS[entity.scholarId];
  const { insight, evidence } = getInsightContent(entity);
  const sourceRefs = "source_refs" in entity.data ? entity.data.source_refs : undefined;

  if (!insight) return null;

  return (
    <div
      className="transition-all duration-500 ease-out"
      style={{
        opacity: isRevealed ? 1 : 0,
        transform: isRevealed ? "translateY(0)" : "translateY(20px)",
        maxHeight: isRevealed ? "1000px" : "0",
        overflow: "hidden",
      }}
    >
      <div
        className="rounded-lg border border-white/[0.06] bg-surface-card px-5 py-4 border-l-4"
        style={{ borderLeftColor: scholar.color }}
      >
        <div className="flex items-center gap-2 mb-3">
          <span
            className="inline-block h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: scholar.color }}
          />
          <span className="text-sm font-medium" style={{ color: scholar.color }}>
            {scholar.name}
          </span>
          <span className="text-xs text-on-surface-muted">
            {scholar.field}
          </span>
        </div>

        {primaryRawId && entity.data.id !== primaryRawId && (
          <p className="text-xs uppercase tracking-wider text-on-surface-muted mb-2">
            Qua khái niệm liên quan:{" "}
            <span className="text-on-surface normal-case">{entity.displayName}</span>
          </p>
        )}

        {entity.type === "misconception" && (
          <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/[0.05] px-4 py-3 mb-3">
            <p className="text-xs font-medium uppercase tracking-wider text-emerald-400 mb-1">
              Thực tế
            </p>
            <p className="text-[15px] leading-relaxed">{insight}</p>
          </div>
        )}

        {entity.type !== "misconception" && (
          <p className="text-[15px] leading-relaxed mb-3">{insight}</p>
        )}

        {evidence && evidence.length > 0 && (
          <div className="space-y-1.5 mb-3">
            <p className="text-xs font-medium uppercase tracking-wider text-on-surface-muted">
              Bằng chứng
            </p>
            <ul className="space-y-1">
              {evidence.map((e, i) => (
                <li key={i} className="text-sm text-on-surface-muted leading-relaxed pl-3 border-l border-white/[0.08]">
                  {e}
                </li>
              ))}
            </ul>
          </div>
        )}

        {entity.type === "symbol" && (
          <div className="space-y-2 mb-3">
            {(entity.data as CulturalSymbol).yin_element && (
              <p className="text-sm text-on-surface-muted">
                <span className="text-on-surface">Âm:</span>{" "}
                {(entity.data as CulturalSymbol).yin_element}
              </p>
            )}
            {(entity.data as CulturalSymbol).yang_element && (
              <p className="text-sm text-on-surface-muted">
                <span className="text-on-surface">Dương:</span>{" "}
                {(entity.data as CulturalSymbol).yang_element}
              </p>
            )}
            {(entity.data as CulturalSymbol).yin_yang_meaning && (
              <p className="text-sm text-on-surface-muted">
                {(entity.data as CulturalSymbol).yin_yang_meaning}
              </p>
            )}
          </div>
        )}

        {entity.type === "term" && (entity.data as Term).differs_from_common && (
          <p className="text-sm text-on-surface-muted mb-3 italic">
            {(entity.data as Term).differs_from_common}
          </p>
        )}

        {sourceRefs && sourceRefs.length > 0 && (
          <div className="pt-2 border-t border-white/[0.06]">
            {sourceRefs.map((ref, i) => (
              <Citation key={i} sourceRef={ref} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

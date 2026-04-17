import type { IndexedEntity, Concept, Misconception, Term, CulturalSymbol } from "@/lib/types";
import { getScholarLayers } from "@/lib/data";
import { BackLink } from "@/components/ui/BackLink";
import { ScholarBadge } from "@/components/ui/ScholarBadge";
import { ShareButton } from "@/components/share/ShareButton";
import { LayerRevealContainer } from "./LayerRevealContainer";
import { CrossReferenceList } from "@/components/connections/CrossReferenceList";

function getShareText(entity: IndexedEntity): string {
  const d = entity.data;
  if ("key_insight" in d) return (d as Concept).key_insight;
  if ("correction" in d) return (d as Misconception).correction;
  if ("cultural_meaning" in d) return (d as Term | CulturalSymbol).cultural_meaning;
  return entity.displayName;
}

export function ExplorePage({ entity }: { entity: IndexedEntity }) {
  // Additional scholar layers: same rawId in other scholars + related concepts
  // authored by other scholars. Target total reveal = 2-4 layers per SPEC.
  const scholarLayers = getScholarLayers(entity, 3);
  const excludeFromCrossRefs = new Set(scholarLayers.map((e) => e.id));

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-2xl px-5 pt-8 pb-20">
        <div className="mb-8 flex items-center justify-between">
          <BackLink />
          <ShareButton
            title={entity.displayName}
            text={getShareText(entity).slice(0, 140)}
          />
        </div>

        <div className="mb-4">
          <ScholarBadge scholarId={entity.scholarId} />
        </div>

        <LayerRevealContainer
          entity={entity}
          additionalLayers={scholarLayers}
        />

        <CrossReferenceList entity={entity} excludeIds={excludeFromCrossRefs} />
      </div>
    </div>
  );
}

import type { IndexedEntity, Concept, Misconception, Term, CulturalSymbol } from "@/lib/types";
import { getMultiScholarEntities } from "@/lib/data";
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
  const rawId = entity.data.id;
  const multiScholar = getMultiScholarEntities(rawId).filter(
    (e) => e.id !== entity.id
  );

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
          additionalLayers={multiScholar}
        />

        <CrossReferenceList entity={entity} />
      </div>
    </div>
  );
}

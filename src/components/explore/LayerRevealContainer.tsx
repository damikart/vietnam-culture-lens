"use client";

import { useState } from "react";
import type { IndexedEntity } from "@/lib/types";
import { SurfaceLayer } from "./SurfaceLayer";
import { ScholarLayer } from "./ScholarLayer";

export function LayerRevealContainer({
  entity,
  additionalLayers,
}: {
  entity: IndexedEntity;
  additionalLayers: IndexedEntity[];
}) {
  const allLayers = [entity, ...additionalLayers];
  const [revealedCount, setRevealedCount] = useState(0);
  const hasMore = revealedCount < allLayers.length;

  return (
    <div className="space-y-6">
      {/* Surface layer - always visible */}
      <SurfaceLayer entity={entity} />

      {/* Scholar insight layers */}
      {allLayers.map((layer, i) => (
        <ScholarLayer
          key={layer.id}
          entity={layer}
          isRevealed={i < revealedCount}
        />
      ))}

      {/* Reveal button */}
      {hasMore && (
        <button
          onClick={() => setRevealedCount((c) => c + 1)}
          className="group flex items-center gap-2 rounded-lg border border-white/[0.1] bg-surface-card px-5 py-3 text-sm font-medium text-on-surface transition-all hover:border-white/[0.2] hover:bg-surface-elevated"
        >
          <span className="inline-block transition-transform group-hover:translate-y-0.5">
            ↓
          </span>
          {revealedCount === 0
            ? "Bóc lớp"
            : `Khám phá tiếp (${allLayers.length - revealedCount} lớp còn)`}
        </button>
      )}

      {!hasMore && revealedCount > 0 && (
        <p className="text-xs text-on-surface-muted">
          Đã khám phá hết {revealedCount} lớp
        </p>
      )}
    </div>
  );
}

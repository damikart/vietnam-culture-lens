"use client";

import { useState } from "react";
import type { IndexedEntity, LandingCategory } from "@/lib/types";
import { ItemCard } from "./ItemCard";

const DISPLAY_LIMIT = 24;

const CATEGORY_LABELS: Record<LandingCategory, string> = {
  "tuc-ngu": "Tục ngữ",
  "tu-ngu": "Từ ngữ",
  "tin-nguong": "Tín ngưỡng & Văn hóa",
};

const CATEGORY_DESCRIPTIONS: Record<LandingCategory, string> = {
  "tuc-ngu": "Những câu nói quen thuộc — ẩn chứa điều bạn chưa biết",
  "tu-ngu": "Từ bạn dùng hàng ngày — nghĩa thật có thể khác xa",
  "tin-nguong": "Phong tục, tín ngưỡng, quan niệm — gốc rễ bất ngờ",
};

export function CategorySection({
  category,
  entities,
}: {
  category: LandingCategory;
  entities: IndexedEntity[];
}) {
  const [showAll, setShowAll] = useState(false);
  const displayed = showAll ? entities : entities.slice(0, DISPLAY_LIMIT);
  const hiddenCount = entities.length - DISPLAY_LIMIT;

  return (
    <section>
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-on-surface">
          {CATEGORY_LABELS[category]}
          <span className="ml-2 text-sm font-normal text-on-surface-muted">
            {entities.length}
          </span>
        </h2>
        <p className="mt-1 text-sm text-on-surface-muted">
          {CATEGORY_DESCRIPTIONS[category]}
        </p>
      </div>
      <div className="grid gap-2">
        {displayed.map((entity) => (
          <ItemCard key={entity.id} entity={entity} />
        ))}
      </div>
      {!showAll && hiddenCount > 0 && (
        <button
          onClick={() => setShowAll(true)}
          className="mt-3 w-full rounded-lg border border-white/[0.08] py-2.5 text-sm text-on-surface-muted transition-all hover:border-white/[0.15] hover:text-on-surface"
        >
          Xem thêm {hiddenCount} mục
        </button>
      )}
    </section>
  );
}

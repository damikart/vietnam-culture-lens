import type { IndexedEntity, LandingCategory } from "@/lib/types";
import { ItemCard } from "./ItemCard";

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
        {entities.map((entity) => (
          <ItemCard key={entity.id} entity={entity} />
        ))}
      </div>
    </section>
  );
}

import { SCHOLARS } from "@/lib/scholars";

export function ScholarBadge({ scholarId }: { scholarId: string }) {
  const scholar = SCHOLARS[scholarId];
  if (!scholar) return null;

  return (
    <span className="inline-flex items-center gap-1.5 text-xs">
      <span
        className="inline-block h-2 w-2 rounded-full"
        style={{ backgroundColor: scholar.color }}
      />
      <span style={{ color: scholar.color }}>{scholar.name}</span>
      <span className="text-on-surface-muted">· {scholar.field}</span>
    </span>
  );
}

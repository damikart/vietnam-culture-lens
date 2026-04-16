import type { Scholar } from "@/lib/scholars";

export function ScholarProfile({ scholar }: { scholar: Scholar }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <span
          className="inline-block h-3 w-3 rounded-full"
          style={{ backgroundColor: scholar.color }}
        />
        <h2 className="text-xl font-bold">{scholar.name}</h2>
      </div>
      <p className="text-sm font-medium" style={{ color: scholar.color }}>
        {scholar.field}
      </p>
      <p className="text-[15px] leading-relaxed text-on-surface-muted">
        {scholar.description}
      </p>
    </div>
  );
}

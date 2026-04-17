import type { SourceRef } from "@/lib/types";
import { getSourceById } from "@/lib/data";

export function Citation({ sourceRef }: { sourceRef: SourceRef }) {
  const source = getSourceById(sourceRef.source_id);
  if (!source) return null;

  const parts = [source.title];
  if (sourceRef.chapter) parts.push(`Ch. ${sourceRef.chapter}`);
  if (sourceRef.section) {
    const sec = sourceRef.section.startsWith("§") ? sourceRef.section : `§${sourceRef.section}`;
    parts.push(sec);
  }
  if (sourceRef.page) parts.push(`tr. ${sourceRef.page}`);

  return (
    <p className="text-xs text-on-surface-muted italic">
      Nguồn: {parts.join(", ")} ({source.year})
    </p>
  );
}

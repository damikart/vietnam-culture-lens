import type {
  ScholarData,
  IndexedEntity,
  EntityType,
  LandingCategory,
  Concept,
  Misconception,
  Term,
  Proverb,
  Comparison,
  CulturalSymbol,
  CulturalRegion,
  Source,
} from "./types";
import { slugify } from "./slugify";

import tntRaw from "../../data/tran_ngoc_them.json";
import tqvRaw from "../../data/tran_quoc_vuong.json";
import cxhRaw from "../../data/cao_xuan_hao.json";
import ndtRaw from "../../data/ngo_duc_thinh.json";

const scholarFiles: Record<string, ScholarData> = {
  tran_ngoc_them: tntRaw as unknown as ScholarData,
  tran_quoc_vuong: tqvRaw as unknown as ScholarData,
  cao_xuan_hao: cxhRaw as unknown as ScholarData,
  ngo_duc_thinh: ndtRaw as unknown as ScholarData,
};

function getDisplayName(
  type: EntityType,
  data: Concept | Misconception | Term | Proverb | Comparison | CulturalSymbol | CulturalRegion
): string {
  switch (type) {
    case "concept":
      return (data as Concept).name_vi;
    case "misconception":
      return (data as Misconception).title;
    case "term":
      return (data as Term).term_vi;
    case "proverb":
      return (data as Proverb).text_vi;
    case "comparison":
      return `${(data as Comparison).vietnam.slice(0, 40)}…`;
    case "symbol":
      return (data as CulturalSymbol).name_vi;
    case "region":
      return (data as CulturalRegion).name_vi;
  }
}

function getCategoryForType(type: EntityType): LandingCategory {
  switch (type) {
    case "proverb":
      return "tuc-ngu";
    case "term":
      return "tu-ngu";
    case "region":
      return "tin-nguong";
    default:
      return "tin-nguong";
  }
}

function getRelatedConceptIds(
  type: EntityType,
  data: Concept | Misconception | Term | Proverb | Comparison | CulturalSymbol | CulturalRegion
): string[] {
  if ("related_concepts" in data && Array.isArray(data.related_concepts)) {
    return data.related_concepts;
  }
  return [];
}

// Build the index
const allEntities: IndexedEntity[] = [];
const slugMap = new Map<string, IndexedEntity>();
const idMap = new Map<string, IndexedEntity[]>();
const crossRefMap = new Map<string, Set<string>>();
const sourceMap = new Map<string, { source: Source; scholarId: string }>();

function addEntity(
  scholarId: string,
  type: EntityType,
  data: Concept | Misconception | Term | Proverb | Comparison | CulturalSymbol | CulturalRegion
) {
  const rawId = data.id;
  const category = getCategoryForType(type);
  const displayName = getDisplayName(type, data);
  const baseSlug = slugify(displayName);

  // Handle slug collisions
  let slug = baseSlug;
  if (slugMap.has(`${category}/${slug}`)) {
    slug = `${baseSlug}-${scholarId.split("_").pop()}`;
  }

  const entity: IndexedEntity = {
    id: `${rawId}__${scholarId}`,
    type,
    slug,
    category,
    scholarId,
    displayName,
    data,
  };

  allEntities.push(entity);
  slugMap.set(`${category}/${slug}`, entity);

  // Map raw ID to entities (for cross-refs)
  const existing = idMap.get(rawId) || [];
  existing.push(entity);
  idMap.set(rawId, existing);
}

// Initialize
for (const [scholarId, fileData] of Object.entries(scholarFiles)) {
  // Index sources
  for (const source of fileData.sources) {
    sourceMap.set(source.id, { source, scholarId });
  }

  for (const c of fileData.concepts || []) addEntity(scholarId, "concept", c);
  for (const m of fileData.misconceptions || []) addEntity(scholarId, "misconception", m);
  for (const t of fileData.terms || []) addEntity(scholarId, "term", t);
  for (const p of fileData.proverbs || []) addEntity(scholarId, "proverb", p);
  for (const cmp of fileData.comparisons || []) addEntity(scholarId, "comparison", cmp);
  for (const s of fileData.symbols || []) addEntity(scholarId, "symbol", s);
  for (const r of fileData.cultural_regions || []) addEntity(scholarId, "region", r);
}

// Build cross-reference map (bidirectional)
for (const entity of allEntities) {
  const relatedIds = getRelatedConceptIds(entity.type, entity.data);
  const rawId = entity.data.id;

  for (const relId of relatedIds) {
    // Forward: rawId -> relId
    if (!crossRefMap.has(rawId)) crossRefMap.set(rawId, new Set());
    crossRefMap.get(rawId)!.add(relId);

    // Reverse: relId -> rawId
    if (!crossRefMap.has(relId)) crossRefMap.set(relId, new Set());
    crossRefMap.get(relId)!.add(rawId);
  }
}

// Public API
export function getAllEntities(): IndexedEntity[] {
  return allEntities;
}

export function getEntityBySlug(
  category: LandingCategory,
  slug: string
): IndexedEntity | undefined {
  return slugMap.get(`${category}/${slug}`);
}

export function getEntitiesByCategory(category: LandingCategory): IndexedEntity[] {
  return allEntities.filter((e) => e.category === category);
}

export function getEntitiesByScholar(scholarId: string): IndexedEntity[] {
  return allEntities.filter((e) => e.scholarId === scholarId);
}

/** Extract domain(s) from an entity for fallback matching. */
function getDomains(entity: IndexedEntity): string[] {
  const d = entity.data as unknown as Record<string, unknown>;
  if (Array.isArray(d.domains)) return d.domains.filter((x): x is string => typeof x === "string");
  if (typeof d.domain === "string") return [d.domain];
  return [];
}

/** Strict related: only items reached via `related_concepts` cross-refs, sorted by diversity. */
export function getStrictRelatedEntities(
  entity: IndexedEntity,
  max = 4
): IndexedEntity[] {
  const rawId = entity.data.id;
  const relatedRawIds = crossRefMap.get(rawId);
  if (!relatedRawIds) return [];

  const results: IndexedEntity[] = [];
  const seen = new Set<string>();
  seen.add(entity.id);

  for (const relId of relatedRawIds) {
    const entities = idMap.get(relId);
    if (!entities) continue;

    for (const e of entities) {
      if (seen.has(e.id)) continue;
      seen.add(e.id);
      results.push(e);
    }
  }

  results.sort((a, b) => {
    const score = (e: IndexedEntity) =>
      (e.category !== entity.category ? 2 : 0) +
      (e.scholarId !== entity.scholarId ? 1 : 0);
    return score(b) - score(a);
  });

  return results.slice(0, max);
}

/**
 * Related entities for the Kết nối section. Starts from strict related_concepts,
 * then falls back to same-domain entities (cross-category preferred) to guarantee
 * coverage for terms/comparisons/symbols/regions that lack related_concepts.
 */
export function getRelatedEntities(
  entity: IndexedEntity,
  max = 4,
  excludeIds: Set<string> = new Set()
): IndexedEntity[] {
  const seen = new Set<string>(excludeIds);
  seen.add(entity.id);

  const results: IndexedEntity[] = [];

  // 1. Strict related_concepts (already sorted by diversity)
  const strict = getStrictRelatedEntities(entity, 50);
  for (const e of strict) {
    if (seen.has(e.id)) continue;
    seen.add(e.id);
    results.push(e);
    if (results.length >= max) return results;
  }

  // 2. Domain fallback — items sharing a domain, prefer different category/scholar.
  const entityDomains = new Set(getDomains(entity));
  if (entityDomains.size > 0) {
    const fallback = allEntities.filter((e) => {
      if (seen.has(e.id)) return false;
      const eDomains = getDomains(e);
      return eDomains.some((d) => entityDomains.has(d));
    });

    fallback.sort((a, b) => {
      const score = (e: IndexedEntity) =>
        (e.category !== entity.category ? 2 : 0) +
        (e.scholarId !== entity.scholarId ? 1 : 0);
      return score(b) - score(a);
    });

    for (const e of fallback) {
      seen.add(e.id);
      results.push(e);
      if (results.length >= max) return results;
    }
  }

  return results;
}

export function getScholarForSource(sourceId: string): string | undefined {
  return sourceMap.get(sourceId)?.scholarId;
}

export function getSourceById(sourceId: string): Source | undefined {
  return sourceMap.get(sourceId)?.source;
}

export function getAllSlugsForCategory(
  category: LandingCategory
): { slug: string }[] {
  return getEntitiesByCategory(category).map((e) => ({ slug: e.slug }));
}

/** Get all entities that share the same raw ID (e.g. phon_thuc in both TNT and TQV) */
export function getMultiScholarEntities(rawId: string): IndexedEntity[] {
  return idMap.get(rawId) || [];
}

/**
 * Additional scholar layers for the Khám phá reveal. Combines:
 *   1. Same raw ID in other scholar files (same concept, different scholar)
 *   2. Strictly related concepts authored by other scholars
 * Returns up to `max` layers to complement the primary scholar — so total
 * reveal count is 1 (primary) + layers.length, targeting 2-4 per SPEC.
 */
export function getScholarLayers(
  entity: IndexedEntity,
  max = 3
): IndexedEntity[] {
  const seen = new Set<string>([entity.id]);
  const layers: IndexedEntity[] = [];

  // 1. Same rawId, different scholar — canonical "other scholar's take"
  for (const e of getMultiScholarEntities(entity.data.id)) {
    if (seen.has(e.id)) continue;
    seen.add(e.id);
    layers.push(e);
    if (layers.length >= max) return layers;
  }

  // 2. Strict related concepts from other scholars, sorted by scholar diversity
  const strict = getStrictRelatedEntities(entity, 50).filter(
    (e) => e.scholarId !== entity.scholarId
  );
  // Prefer one layer per distinct scholar before repeating
  const scholarsUsed = new Set<string>([entity.scholarId]);
  const byDistinctScholar: IndexedEntity[] = [];
  const rest: IndexedEntity[] = [];
  for (const e of strict) {
    if (scholarsUsed.has(e.scholarId)) {
      rest.push(e);
    } else {
      scholarsUsed.add(e.scholarId);
      byDistinctScholar.push(e);
    }
  }
  for (const e of [...byDistinctScholar, ...rest]) {
    if (seen.has(e.id)) continue;
    seen.add(e.id);
    layers.push(e);
    if (layers.length >= max) return layers;
  }

  return layers;
}

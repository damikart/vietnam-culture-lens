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

/** Implicit domain tags by entity type — used as fallback when the JSON entry
 *  lacks an explicit `domain`/`domains` field (common on regions and some symbols).
 *  Values chosen to intersect with existing domains already in use. */
const IMPLICIT_DOMAINS_BY_TYPE: Partial<Record<EntityType, string[]>> = {
  region: ["customs", "social_organization"],
  symbol: ["customs", "religion"],
  proverb: ["customs"],
};

/** Extract domain(s) from an entity for fallback matching. Merges explicit
 *  JSON domains with implicit type-based domains so every entity has at least
 *  one domain signal to match against. */
function getDomains(entity: IndexedEntity): string[] {
  const d = entity.data as unknown as Record<string, unknown>;
  const explicit: string[] = Array.isArray(d.domains)
    ? d.domains.filter((x): x is string => typeof x === "string")
    : typeof d.domain === "string"
    ? [d.domain]
    : [];
  const implicit = IMPLICIT_DOMAINS_BY_TYPE[entity.type] ?? [];
  // De-dup, explicit first (higher relevance)
  return [...new Set([...explicit, ...implicit])];
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
 * Related entities for the Kết nối section.
 * Builds a unified candidate pool from strict related_concepts + domain matches,
 * then enforces a cross-category quota so every page gets at least 2 cross-category
 * items when the data allows it.
 */
export function getRelatedEntities(
  entity: IndexedEntity,
  max = 4,
  excludeIds: Set<string> = new Set()
): IndexedEntity[] {
  const seen = new Set<string>(excludeIds);
  seen.add(entity.id);

  type Candidate = { entity: IndexedEntity; sourceRank: number };
  const pool = new Map<string, Candidate>();

  // 1. Strict related_concepts (sourceRank 0 — preferred)
  for (const e of getStrictRelatedEntities(entity, 100)) {
    if (seen.has(e.id) || pool.has(e.id)) continue;
    pool.set(e.id, { entity: e, sourceRank: 0 });
  }

  // 2. Domain-fallback candidates (sourceRank 1)
  const entityDomains = new Set(getDomains(entity));
  if (entityDomains.size > 0) {
    for (const e of allEntities) {
      if (seen.has(e.id) || pool.has(e.id)) continue;
      const eDomains = getDomains(e);
      if (!eDomains.some((d) => entityDomains.has(d))) continue;
      pool.set(e.id, { entity: e, sourceRank: 1 });
    }
  }

  // Score: cross-category (+2), cross-scholar (+1), strict beats domain when equal (-0.5)
  const scoreOf = (c: Candidate) =>
    (c.entity.category !== entity.category ? 2 : 0) +
    (c.entity.scholarId !== entity.scholarId ? 1 : 0) -
    c.sourceRank * 0.5;

  const all = [...pool.values()].sort((a, b) => scoreOf(b) - scoreOf(a));

  // Partition into cross-category and same-category
  const crossCategory = all.filter((c) => c.entity.category !== entity.category);
  const sameCategory = all.filter((c) => c.entity.category === entity.category);

  // Reserve up to 2 slots for cross-category when the pool has them
  const results: IndexedEntity[] = [];
  const reserved = Math.min(2, crossCategory.length, max);
  for (let i = 0; i < reserved; i++) {
    results.push(crossCategory[i].entity);
  }

  // Fill remaining slots from the combined pool (skipping already-picked cross-cat)
  const remaining = [...crossCategory.slice(reserved), ...sameCategory].sort(
    (a, b) => scoreOf(b) - scoreOf(a)
  );
  for (const c of remaining) {
    if (results.length >= max) break;
    results.push(c.entity);
  }

  // Last-resort pad: if still <2 results OR zero cross-category, borrow high-
  // signal entities from other categories so every page meets the 2-card / ≥1
  // cross-category minimum. This covers entities with sparse metadata (some
  // regions/symbols) that would otherwise render zero related cards.
  if (results.length < 2 || results.every((r) => r.category === entity.category)) {
    for (const e of allEntities) {
      if (results.length >= max) break;
      if (seen.has(e.id)) continue;
      if (results.some((r) => r.id === e.id)) continue;
      // Only pad with cross-category to satisfy both constraints at once
      if (e.category === entity.category) continue;
      // Prefer entities that are well-connected (have related_concepts) so the
      // pad feels meaningful rather than arbitrary
      const hasRelated = crossRefMap.has(e.data.id);
      if (!hasRelated) continue;
      results.push(e);
      seen.add(e.id);
      if (results.length >= 2 && results.some((r) => r.category !== entity.category)) {
        // Minimums met — stop unless we want to keep filling to max naturally
        if (results.length >= max) break;
      }
    }
    // Second pass allowing any remaining entity if still short of 2
    if (results.length < 2) {
      for (const e of allEntities) {
        if (results.length >= max) break;
        if (seen.has(e.id)) continue;
        if (results.some((r) => r.id === e.id)) continue;
        if (e.category === entity.category) continue;
        results.push(e);
        seen.add(e.id);
      }
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
 * Additional scholar layers for the Khám phá reveal.
 * Priority chain — each tier is consumed in order until `max` is reached:
 *   1. Same rawId in other scholar files (canonical "other take" on same concept)
 *   2. Strict related concepts from OTHER scholars (diverse lens on related theme)
 *   3. Strict related concepts from SAME scholar (related theme, same lens —
 *      the "Qua khái niệm liên quan" subheading in ScholarLayer disambiguates)
 *   4. Domain-fallback entities from OTHER scholars
 *   5. Domain-fallback entities from SAME scholar
 * Total reveal = 1 primary + layers.length, targeting 2-4 per SPEC.
 */
export function getScholarLayers(
  entity: IndexedEntity,
  max = 3
): IndexedEntity[] {
  const seen = new Set<string>([entity.id]);
  const layers: IndexedEntity[] = [];

  const push = (e: IndexedEntity): boolean => {
    if (seen.has(e.id)) return false;
    seen.add(e.id);
    layers.push(e);
    return layers.length >= max;
  };

  // Tier 1 — same rawId, different scholar
  for (const e of getMultiScholarEntities(entity.data.id)) {
    if (push(e)) return layers;
  }

  // Tiers 2 & 3 — strict related concepts, other-scholar first then same-scholar.
  // Within each group, prefer distinct scholars before repeats for extra breadth.
  const strict = getStrictRelatedEntities(entity, 100);
  const groupOrdered = (items: IndexedEntity[]): IndexedEntity[] => {
    const used = new Set<string>();
    const first: IndexedEntity[] = [];
    const rest: IndexedEntity[] = [];
    for (const e of items) {
      if (used.has(e.scholarId)) rest.push(e);
      else {
        used.add(e.scholarId);
        first.push(e);
      }
    }
    return [...first, ...rest];
  };

  const strictOther = groupOrdered(strict.filter((e) => e.scholarId !== entity.scholarId));
  const strictSame = strict.filter((e) => e.scholarId === entity.scholarId);

  for (const e of strictOther) if (push(e)) return layers;
  for (const e of strictSame) if (push(e)) return layers;

  // Tiers 4 & 5 — domain fallback, other-scholar first then same-scholar
  const entityDomains = new Set(getDomains(entity));
  if (entityDomains.size === 0) return layers;

  const domainMatches = allEntities.filter((e) => {
    if (seen.has(e.id)) return false;
    const eDomains = getDomains(e);
    return eDomains.some((d) => entityDomains.has(d));
  });
  // Sort each group: prefer SAME category for scholar-layer topical coherence,
  // so cross-category material stays available for the Khám phá thêm section.
  const sameCatFirst = (e: IndexedEntity) =>
    e.category === entity.category ? 1 : 0;
  const domainOther = groupOrdered(
    domainMatches
      .filter((e) => e.scholarId !== entity.scholarId)
      .sort((a, b) => sameCatFirst(b) - sameCatFirst(a))
  );
  const domainSame = domainMatches
    .filter((e) => e.scholarId === entity.scholarId)
    .sort((a, b) => sameCatFirst(b) - sameCatFirst(a));

  for (const e of domainOther) if (push(e)) return layers;
  for (const e of domainSame) if (push(e)) return layers;

  return layers;
}

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
  data: Concept | Misconception | Term | Proverb | Comparison | CulturalSymbol
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
  }
}

function getCategoryForType(type: EntityType): LandingCategory {
  switch (type) {
    case "proverb":
      return "tuc-ngu";
    case "term":
      return "tu-ngu";
    default:
      return "tin-nguong";
  }
}

function getRelatedConceptIds(
  type: EntityType,
  data: Concept | Misconception | Term | Proverb | Comparison | CulturalSymbol
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
  data: Concept | Misconception | Term | Proverb | Comparison | CulturalSymbol
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

export function getRelatedEntities(entity: IndexedEntity, max = 4): IndexedEntity[] {
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
      if (results.length >= max) return results;
    }
  }

  // Sort: prefer different categories and scholars
  results.sort((a, b) => {
    const aDiff =
      (a.category !== entity.category ? 1 : 0) +
      (a.scholarId !== entity.scholarId ? 1 : 0);
    const bDiff =
      (b.category !== entity.category ? 1 : 0) +
      (b.scholarId !== entity.scholarId ? 1 : 0);
    return bDiff - aDiff;
  });

  return results.slice(0, max);
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

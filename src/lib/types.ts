export interface SourceRef {
  source_id: string;
  chapter?: string;
  section?: string;
  page?: string;
}

export interface Source {
  id: string;
  author: string;
  title: string;
  year: number;
  type: string;
}

export interface Concept {
  id: string;
  name_vi: string;
  name_en: string;
  domain: string;
  definition: string;
  key_insight: string;
  related_concepts: string[];
  source_refs: SourceRef[];
}

export interface Misconception {
  id: string;
  title: string;
  common_belief: string;
  correction: string;
  evidence: string[];
  severity: "vehement" | "strong" | "mild";
  domains: string[];
  related_concepts: string[];
  source_refs: SourceRef[];
}

export interface Term {
  id: string;
  term_vi: string;
  surface_meaning: string;
  cultural_meaning: string;
  differs_from_common: string;
  domain: string;
  source_refs: SourceRef[];
}

export interface Proverb {
  id: string;
  text_vi: string;
  text_en?: string;
  illustrates: string;
  domain: string;
  related_concepts: string[];
  source_refs?: SourceRef[];
}

export interface Comparison {
  id: string;
  domain: string;
  vietnam: string;
  other_culture: string;
  other_culture_name: string;
  explanation: string;
  source_refs: SourceRef[];
}

export interface CulturalSymbol {
  id: string;
  name_vi: string;
  name_en: string;
  physical_form: string;
  yin_element?: string;
  yang_element?: string;
  yin_yang_meaning: string;
  cultural_meaning: string;
  related_concepts: string[];
  source_refs: SourceRef[];
}

export interface CulturalRegion {
  id: string;
  name_vi: string;
  boundary: string;
  dominant_ethnic: string;
  key_features: string[];
  character: string;
  source_refs: SourceRef[];
}

export interface ScholarData {
  version: string;
  sources: Source[];
  framework?: Record<string, unknown>;
  concepts: Concept[];
  misconceptions: Misconception[];
  terms: Term[];
  proverbs: Proverb[];
  comparisons: Comparison[];
  symbols: CulturalSymbol[];
  cultural_regions?: CulturalRegion[];
}

export type EntityType =
  | "concept"
  | "misconception"
  | "term"
  | "proverb"
  | "comparison"
  | "symbol";

export type LandingCategory = "tuc-ngu" | "tu-ngu" | "tin-nguong";

export type EntityData =
  | Concept
  | Misconception
  | Term
  | Proverb
  | Comparison
  | CulturalSymbol;

export interface IndexedEntity {
  id: string;
  type: EntityType;
  slug: string;
  category: LandingCategory;
  scholarId: string;
  displayName: string;
  data: EntityData;
}

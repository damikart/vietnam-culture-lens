import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getEntityBySlug, getAllSlugsForCategory } from "@/lib/data";
import { ExplorePage } from "@/components/explore/ExplorePage";
import type { Concept, Misconception, CulturalSymbol, Comparison } from "@/lib/types";

export function generateStaticParams() {
  return getAllSlugsForCategory("tin-nguong");
}

function getInsightPreview(entity: ReturnType<typeof getEntityBySlug>): string {
  if (!entity) return "";
  const d = entity.data;
  if ("key_insight" in d) return (d as Concept).key_insight;
  if ("correction" in d) return (d as Misconception).correction;
  if ("cultural_meaning" in d) return (d as CulturalSymbol).cultural_meaning;
  if ("explanation" in d) return (d as Comparison).explanation;
  return entity.displayName;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entity = getEntityBySlug("tin-nguong", slug);
  if (!entity) return {};

  const description = getInsightPreview(entity).slice(0, 160);
  return {
    title: `${entity.displayName} — Lật Văn Hóa`,
    description,
    openGraph: {
      title: entity.displayName,
      description,
      type: "article",
      locale: "vi_VN",
      siteName: "Lật Văn Hóa",
    },
    twitter: {
      card: "summary_large_image",
      title: entity.displayName,
      description,
    },
  };
}

export default async function TinNguongPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entity = getEntityBySlug("tin-nguong", slug);
  if (!entity) notFound();

  return <ExplorePage entity={entity} />;
}

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SCHOLARS, SCHOLAR_IDS, getScholarBySlug } from "@/lib/scholars";
import { getEntitiesByScholar } from "@/lib/data";
import { BackLink } from "@/components/ui/BackLink";
import { ScholarProfile } from "@/components/scholar/ScholarProfile";
import { ScholarItemList } from "@/components/scholar/ScholarItemList";

export function generateStaticParams() {
  return SCHOLAR_IDS.map((id) => ({ slug: SCHOLARS[id].slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const scholar = getScholarBySlug(slug);
  if (!scholar) return {};

  return {
    title: `${scholar.name} — Lật Văn Hóa`,
    description: `${scholar.field}: ${scholar.description.slice(0, 120)}`,
  };
}

export default async function ScholarDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const scholar = getScholarBySlug(slug);
  if (!scholar) notFound();

  const entities = getEntitiesByScholar(scholar.id);

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-2xl px-5 pt-8 pb-20">
        <div className="mb-8">
          <BackLink />
        </div>

        <ScholarProfile scholar={scholar} />

        <div className="mt-10">
          <h2 className="text-sm font-medium uppercase tracking-wider text-on-surface-muted mb-6">
            Tất cả nội dung ({entities.length} mục)
          </h2>
          <ScholarItemList entities={entities} />
        </div>
      </div>
    </div>
  );
}

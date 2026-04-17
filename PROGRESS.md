# Progress — Lat Van Hoa

## Completed
- [x] F6: Data layer — JSON loader, merge/index, cross-reference map; +6 cultural_regions as "region" type
- [x] F1: Landing — 3 categories; tin-nguong capped at 24 items with show-more button
- [x] F2: Kham pha — Layer reveal; proverb scholar layer now uses `illustrates` field
- [x] F3: Ket noi — Cross-references sorted by diversity before truncate (category diversity prioritized)
- [x] F4: Scholar profiles — Listing + detail pages; scholar cards show "Xem N mục qua lăng kính này →"
- [x] F5: Share — Share button + OG meta tags + per-entity opengraph-image.tsx (1200×630 PNG)

## QA Fixes Applied (2026-04-17)
- fix: citation removes duplicate § prefix from section refs
- fix: proverb scholar layer reveals illustrates as insight
- fix: cross-references collect all results before sorting by diversity
- fix: landing category section limits display to 24 with show-more
- fix: scholar list cards add view-through-lens CTA
- feat: index and render cultural_regions as region type in tin-nguong
- fix: og image per entity page with twitter large card meta

## Notes for Evaluator
- Data: 4 file JSON trong /data/, khong sua
- Scholar colors: purple (TNT), green (TQV), teal (CXH), amber (NDT)
- 317 static pages generated (163 entity pages + 154 OG image pages + 4 scholar + 1 listing + 1 landing)
- Build passes with 0 warnings, lint clean
- metadataBase set to NEXT_PUBLIC_BASE_URL ?? https://lat-van-hoa.vercel.app

## Tech Decisions
- Next.js 16 + App Router + TypeScript + Tailwind CSS
- Static export (`output: 'export'`)
- Dark theme (#0F1117 background)
- Inter font (Vietnamese subset)
- Scholar attribution by file origin
- Duplicate IDs (phon_thuc, dao_mau): composite key `{id}__{scholarId}`
- Cross-refs: bidirectional map from `related_concepts`; collect ALL before sort+slice(max=4)
- Layer reveal: client component with CSS transitions (opacity + translateY, 500ms)
- Category mapping: proverbs→tuc-ngu, terms→tu-ngu, everything else (incl. regions)→tin-nguong
- OG images: next/og ImageResponse, ASCII footer (no Vietnamese diacritics to avoid font issues)
- ShareButton: navigator.share → clipboard fallback → "Không thể sao chép" error state

# Progress — Lat Van Hoa

## Completed
- [x] F6: Data layer — JSON loader, merge/index, cross-reference map
- [x] F1: Landing — 3 categories (21 tuc ngu, 18 tu ngu, 109 tin nguong)
- [x] F2: Kham pha — Layer reveal (surface + scholar insights + evidence + citations)
- [x] F3: Ket noi — Cross-references at bottom of explore pages (max 4 items)
- [x] F4: Scholar profiles — Listing + detail pages with filtered items
- [x] F5: Share — Share button (navigator.share + clipboard fallback) + OG meta tags

## In Progress
(None)

## Blocked / Issues
(None)

## Notes for Evaluator
- Data: 4 file JSON trong /data/, khong sua
- Scholar colors: purple (TNT), green (TQV), teal (CXH), amber (NDT)
- 157 static pages generated (152 entity pages + 4 scholar + 1 listing + 1 landing)
- Build passes with 0 warnings, lint clean

## Tech Decisions
- Next.js 16 + App Router + TypeScript + Tailwind CSS
- Static export (`output: 'export'`)
- Dark theme (#0F1117 background)
- Inter font (Vietnamese subset)
- Scholar attribution by file origin
- Duplicate IDs (phon_thuc, dao_mau): composite key `{id}__{scholarId}`
- Cross-refs: bidirectional map from `related_concepts`, max 4 per page
- Layer reveal: client component with CSS transitions (opacity + translateY, 500ms)
- Category mapping: proverbs→tuc-ngu, terms→tu-ngu, everything else→tin-nguong

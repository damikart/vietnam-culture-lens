# CLAUDE.md — Lật Văn Hóa

## Project (WHAT)
Web app tĩnh cho người Việt trẻ khám phá chiều sâu văn hóa VN. React + Next.js, static export, deploy Vercel/Cloudflare Pages. Data: 4 file JSON trong `/data/`, không backend.

## Purpose (WHY)
Người dùng chọn tục ngữ / từ ngữ / tín ngưỡng quen thuộc → xem "bóc lớp" bởi 4 học giả → phát hiện chiều sâu ẩn. Core value = revelation, không phải information dump.

## Structure
```
/data/              → 4 JSON files (READ ONLY — không sửa)
/src/               → App code
/public/            → Static assets
SPEC.md             → Product spec (đọc trước khi code)
EVAL-CRITERIA.md    → Tiêu chí đánh giá
PROGRESS.md         → Cập nhật sau mỗi feature
```

## Workflow (HOW)
```bash
npm install
npm run dev          # Dev server
npm run build        # Static export
npm run lint         # Lint check
```
Verify sau mỗi feature: `npm run build` phải pass, không warning.

## Git Rules
- KHÔNG push trực tiếp lên main — luôn branch `feature/[name]`
- Commit message: `feat: ...` / `fix: ...` / `docs: ...`
- Mỗi commit = 1 feature hoặc 1 fix
- Update PROGRESS.md sau mỗi feature hoàn thành

## Constraints
- ĐỌC SPEC.md TRƯỚC KHI BẮT ĐẦU — implement đúng 6 features, không hơn không kém
- KHÔNG thêm feature ngoài SPEC.md (không AI chatbot, không 3D, không audio)
- KHÔNG sửa file JSON trong /data/ — đó là source of truth
- KHÔNG dùng thư viện UI nặng (no Material UI, no Ant Design) — typography-driven, custom CSS/Tailwind
- KHÔNG hardcode content — mọi text hiển thị phải đọc từ JSON
- Tiếng Việt: UI labels, meta tags, tất cả bằng tiếng Việt
- Mobile-first: thiết kế cho 320px trước, scale lên

## Data Contract
4 JSON files, mỗi file có structure:
- `sources[]` — thông tin sách/tác giả
- `concepts[]` — id, name_vi, name_en, domain, definition, key_insight, related_concepts, source_refs
- `misconceptions[]` — id, title, common_belief, correction, evidence[], severity, source_refs
- `terms[]` — id, term_vi, surface_meaning, cultural_meaning, differs_from_common, source_refs
- `proverbs[]` — id, text_vi, text_en, illustrates, related_concepts, source_refs
- `comparisons[]` — id, vietnam, other_culture, explanation, source_refs
- Một số file có thêm: `cultural_regions[]`, `symbols[]`, `framework{}`

Scholar mapping:
- tran_ngoc_them.json → Triết học hệ thống → accent color: purple (#7F77DD)
- tran_quoc_vuong.json → Khảo cổ học → accent color: green (#639922)
- cao_xuan_hao.json → Ngôn ngữ học → accent color: teal (#1D9E75)
- ngo_duc_thinh.json → Tín ngưỡng/Dân tộc học → accent color: amber (#EF9F27)

## Accumulated Rules
(Thêm dần từ failures — mục này lớn dần theo thời gian)

# Product Spec — Lật Văn Hóa

## Overview

Web app cho người Việt trẻ khám phá chiều sâu ẩn trong văn hóa Việt Nam qua một trải nghiệm tương tác. Người dùng chọn một thứ quen thuộc (câu tục ngữ, từ ngữ hàng ngày, tín ngưỡng/phong tục) — rồi xem nó được "bóc lớp" bởi 4 học giả từ 4 góc nhìn khác nhau: Ngôn ngữ học (Cao Xuân Hạo), Khảo cổ học (Trần Quốc Vượng), Tín ngưỡng/Dân tộc học (Ngô Đức Thịnh), Triết học hệ thống (Trần Ngọc Thêm).

Data layer: 4 file JSON đã có (~34 concepts, ~50 misconceptions, ~18 terms, ~21 proverbs, ~6 cultural regions, điện thần Tứ Phủ). AI-first: data phục vụ AI agents qua MCP/API trước, UI là surface layer.

## User Stories

1. As người Việt trẻ, I want chọn một câu tục ngữ quen thuộc và xem nó bị "giải phẫu" từ nhiều góc nhìn, so that tôi phát hiện chiều sâu mình chưa từng biết.
2. As người Việt trẻ, I want chọn một từ tôi dùng hàng ngày và thấy nghĩa ẩn bên dưới, so that tôi nhận ra ngôn ngữ mình nói chứa lịch sử 4000 năm.
3. As người Việt trẻ, I want chọn một tín ngưỡng/phong tục tôi thực hành và thấy gốc rễ thật, so that tôi hiểu tại sao mình làm điều này mà không biết tại sao.
4. As người dùng bất kỳ, I want thấy kết nối giữa các khái niệm (từ tục ngữ nhảy sang tín ngưỡng, từ ngôn ngữ nhảy sang khảo cổ), so that tôi thấy văn hóa là mạng lưới sống chứ không phải danh sách kiến thức.
5. As người dùng, I want chia sẻ một "revelation" cụ thể lên mạng xã hội, so that bạn bè tôi cũng bị kéo vào khám phá.

## Feature List

### F1: Landing — Chọn điểm bắt đầu
- Hiển thị 3 category: Tục ngữ (~20 câu), Từ ngữ (~20 từ), Tín ngưỡng/Phong tục (~25 mục)
- Mỗi item hiển thị dạng quen thuộc, bình thường, không spoil nội dung sâu
- Click/tap một item → chuyển sang màn Khám phá
- Responsive: mobile-first, hoạt động tốt trên điện thoại

### F2: Khám phá — Bóc lớp từng item
- Hiển thị item đã chọn ở trạng thái "bề mặt" (nghĩa thông thường)
- Hiển thị 2-4 "lớp" (tùy item có data từ bao nhiêu scholars)
- Mỗi lớp = 1 scholar, gồm: tên scholar, góc nhìn (1 câu), insight chính, bằng chứng cụ thể, citation (nguồn/chương/trang)
- Lớp được reveal tuần tự (scroll hoặc click) — tạo cảm giác khám phá, không dump hết
- Nếu item là misconception: hiển thị rõ "điều bạn tưởng" vs "thực tế" vs "bằng chứng"

### F3: Kết nối — Cross-reference giữa các item
- Cuối mỗi trang Khám phá, hiển thị 2-4 item liên quan từ category khác
- VD: đang xem tục ngữ "Chó treo, mèo đậy" → gợi ý từ "Thì" (cùng Cao Xuân Hạo) + tín ngưỡng "Đạo Mẫu" (liên quan Âm Dương)
- Kết nối dựa trên field `related_concepts` trong JSON
- Click item liên quan → chuyển sang trang Khám phá của item đó (rabbit hole)

### F4: Scholar profiles
- 4 trang profile ngắn (1 paragraph mỗi người): ai, chuyên môn gì, góc nhìn đặc thù
- Có thể filter toàn bộ content theo scholar: "xem tất cả qua lăng kính Cao Xuân Hạo"
- Hiển thị số lượng items mỗi scholar đóng góp

### F5: Share — Chia sẻ revelation
- Mỗi item Khám phá có nút Share
- Generate ảnh/card preview (Open Graph) với: câu tục ngữ/từ + 1 insight ngắn gọn nhất
- Share link mở đúng trang item đó (deep linking)

### F6: Data layer — JSON loader
- Load 4 file JSON từ `/data/` folder
- Merge và index tất cả entities (concepts, misconceptions, terms, proverbs, comparisons)
- Build cross-reference map từ `related_concepts` fields
- Không cần backend/database — static site, JSON bundled

## Technical Constraints

- Standalone web app (React hoặc Next.js)
- Static site — deploy Vercel/Cloudflare Pages, không cần server
- Mobile-first responsive
- Tiếng Việt là ngôn ngữ chính, UI labels tiếng Việt
- Performance: First Contentful Paint < 2s, mỗi trang Khám phá load < 500ms
- SEO: mỗi item có URL riêng, meta tags, Open Graph image
- Data: 4 file JSON đã có, KHÔNG fetch từ API bên ngoài
- Không cần authentication/user accounts cho MVP

## Design Direction

- Tone: trang nhã nhưng hiện đại, không "cổ trang" kitsch, không "giáo dục" nhàm
- Typography-driven: chữ lớn, khoảng trắng nhiều, để nội dung tự nói
- Màu sắc: nền tối (deep navy/charcoal), text sáng, accent color theo scholar (4 màu phân biệt)
- Animation: subtle, meaningful — reveal lớp mới có transition, không nhảy cóc
- Tham khảo aesthetic: Stripe docs, Linear app, Readymag — clean, confident, không rối
- Không có quảng cáo, không popup, không newsletter gate

## Out of Scope (MVP)

- Không có AI chatbot / free-text input (data curated, không hallucinate)
- Không có user accounts / progress tracking
- Không có 3D / WebGL / Three.js (tập trung content + typography + interaction)
- Không có audio / video (chầu văn, phát âm — để version sau)
- Không có multi-language (tiếng Anh — để version sau)
- Không có CMS / admin panel (edit JSON trực tiếp)
- Không thêm nguồn sách mới (data freeze ở 4 nguồn hiện có)

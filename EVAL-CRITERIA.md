# Evaluation Criteria — Lật Văn Hóa

## Criteria

### 1. Functionality
- Weight: HIGH
- Threshold: 8/10
- Measures: Mỗi feature trong SPEC.md hoạt động đúng
- PASS example: Chọn "Chó treo, mèo đậy" → hiển thị bề mặt → bóc lớp Cao Xuân Hạo (Đề-Thuyết) → lớp Trần Ngọc Thêm (tư duy tổng hợp) → cross-reference dẫn sang từ "Thì" → click vào → trang mới mở
- FAIL example: Chọn item → trang trắng. Hoặc: cross-reference link dẫn tới item không tồn tại. Hoặc: JSON parse error

### 2. Content Accuracy
- Weight: HIGH
- Threshold: 9/10
- Measures: Mọi insight, bằng chứng, citation khớp chính xác với data JSON. Không sáng tạo, không paraphrase sai, không thiếu citation
- PASS example: Insight "Yin gốc từ ina/yana = Mẹ" khớp với tran_ngoc_them.json field "key_insight" + source_ref đúng "§5.1"
- FAIL example: Insight bị cắt ngắn mất bằng chứng. Hoặc: gán sai scholar cho insight. Hoặc: citation sai chương/trang

### 3. Information Architecture
- Weight: HIGH
- Threshold: 7/10
- Measures: Người dùng mới (chưa biết gì về văn hóa học) hiểu được flow: chọn → đọc bề mặt → khám phá lớp sâu → nhảy sang item liên quan. Không bị lạc, không bị overwhelm
- PASS example: User test 3 người → cả 3 tự navigate được từ Landing đến Khám phá đến Cross-reference mà không cần hướng dẫn
- FAIL example: User không biết scroll/click để reveal lớp tiếp theo. Hoặc: cross-reference quá nhiều (>6) gây overwhelm

### 4. UI/UX & Visual Design
- Weight: STANDARD
- Threshold: 7/10
- Measures: Mobile-first responsive (320px-1440px), typography rõ ràng đọc được, animation subtle không lag, dark theme nhất quán, 4 scholar colors phân biệt rõ
- PASS example: Trên iPhone SE (320px) vẫn đọc được insight đầy đủ, lớp reveal mượt, không bị overlap text
- FAIL example: Text tràn ra ngoài viewport mobile. Animation giật trên thiết bị yếu. Màu scholar không phân biệt được trên nền tối

### 5. Performance & SEO
- Weight: STANDARD
- Threshold: 6/10
- Measures: FCP < 2s, mỗi item có URL riêng crawlable, Open Graph meta tags render preview khi share
- PASS example: Lighthouse Performance > 90. Share link lên Facebook/Zalo → hiển thị card preview với tên item + insight ngắn
- FAIL example: Trang load > 3s. Share link → không có preview image. URL là hash fragment (#) thay vì path (/tuc-ngu/cho-treo-meo-day)

### 6. Revelation Factor
- Weight: STANDARD
- Threshold: 6/10
- Measures: Ít nhất 5 items tạo được "holy shit moment" — người đọc phải dừng lại, nhíu mày, muốn share. Đo bằng: insight không obvious, bằng chứng cụ thể (tên di chỉ, con số, trích dẫn gốc), có twist giữa "điều tưởng" vs "thực tế"
- PASS example: Trang "Lịch Âm" — bề mặt quen thuộc → lật → "97% gọi sai tên, đây là Lịch Âm Dương" + bằng chứng "19 năm 7 tháng nhuận = đồng bộ hoàn hảo" + L. de Saussure quote
- FAIL example: Insight chỉ là định nghĩa từ điển. Không có twist. Không có bằng chứng cụ thể, chỉ có nhận xét chung chung

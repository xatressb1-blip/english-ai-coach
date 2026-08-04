FIX 33 - INTERVIEW REVIEW & RETRY

Mục tiêu
- Cho phép ứng viên xem lại toàn bộ câu trả lời sau Mock Interview.
- Hiển thị riêng câu trả lời chính, câu hỏi phụ và câu trả lời phụ.
- Hiển thị Coverage, Evidence, Structure và từng tiêu chí Covered / Partly covered / Missing.
- Chọn tối đa ba câu ưu tiên luyện lại theo điểm Overall thấp nhất.
- Thêm nút Practice This Question Again để mở đúng Guided Practice.
- Hiển thị lại phần review trong History, đồng thời tương thích báo cáo cũ.
- Tối ưu card thu gọn cho smartphone.

File mới
- components/interview/InterviewReview.tsx

File sửa
- components/interview/FinalRecruiterReport.tsx
- components/history/RecruiterReportHistory.tsx

Kiểm thử
1. Hoàn thành Level 1 có ít nhất một câu hỏi phụ.
2. Mở Final Report và cuộn tới Interview Review & Retry.
3. Mở từng câu, kiểm tra main answer và follow-up được tách riêng.
4. Kiểm tra Coverage, Evidence, Structure và tiêu chí nội dung.
5. Bấm Practice This Question Again và xác nhận mở đúng Guided Practice.
6. Vào History, mở một báo cáo mới và kiểm tra phần review.
7. Mở báo cáo cũ; giao diện không được lỗi nếu dữ liệu cũ thiếu một số trường.
8. Kiểm tra màn hình 360-430px không tràn ngang.

Chỉ commit sau khi chạy thành công:
- npx tsc --noEmit
- npm run build

FIX 43.3.14 — Nhận xét rõ ràng để giáo viên sử dụng nhanh
PATCH chỉ dùng trên FIX 43.3.13. Nếu máy đang ở bản khác, dùng FULL trong thư mục mới hoặc cài đúng bản nền trước.

THAY ĐỔI
- Điểm đã làm được của từng Q chuyển từ tên tiêu chí rời sang câu tiếng Việt ngắn.
  Ví dụ: Đề cập được ý đóng góp cho công ty; Nêu được việc đã làm trong tình huống minh họa; Nêu được kết quả của hành động.
- Ý được ghi nhận một phần có cụm Bước đầu, không tự nâng thành đầy đủ.
- Chọn tối đa hai ý có minh chứng: ưu tiên ý đầy đủ, dùng ý một phần để bổ sung khi còn chỗ. Trước đây có ý đầy đủ thì các ý một phần không được chọn.
- Thiếu minh chứng vẫn ghi Nội dung ghi nhận: xem chi tiết. Không tạo điểm mạnh thay sinh viên.
- Hai trạng thái Đạt yêu cầu thực hành / Đã ghi nhận câu trả lời và trường hợp Chưa có bản ghi giữ đúng tiêu chí 43.3.13.
- Giữ hướng luyện tập, khung đầy đủ trong Chi tiết, nguồn Live/Mixed/Backup và vai trò kết luận của giáo viên.
- Không gọi Gemini thêm; không sửa kết quả đã lưu, micro, nhận dạng giọng nói, interview, schema, dependencies hoặc đồng bộ.

BA FILE HOÀN CHỈNH CẦN THAY
services/lessonPresentation.ts
components/classroom/TeacherLessonSynthesis.tsx
components/classroom/TeacherClassroomDashboard.tsx
Hai component chỉ cập nhật phiên bản. Logic diễn đạt nằm trong service.

CÀI PATCH
1. Ctrl+C để dừng app. Sao lưu nguyên thư mục dự án sang english-ai-backup-43-3-13; giữ .env.local và dữ liệu trình duyệt.
2. Giải nén PATCH vào thư mục tạm; chép components và services vào C:\AI_Project\english-ai-mobile-fix-01, chọn Replace. Có thể chép README/VALIDATION vào gốc để lưu.
3. Mở CMD tại gốc có package.json:
cd /d C:\AI_Project\english-ai-mobile-fix-01
npx tsc --noEmit
npm run build
npm run start
PATCH không cần npm ci vì package không đổi.
4. Mở http://localhost:3000/teacher/classroom rồi Ctrl+F5, xác nhận FIX 43.3.14.

DÙNG FULL
Giải nén vào thư mục mới. Sao chép .env.local từ bản hiện tại, chạy npm ci rồi các lệnh tsc/build/start trên tại thư mục có package.json. Giữ thư mục cũ để quay lại.

KIỂM THỬ THỰC TẾ
- Mở lại phiên có bốn kết quả, bấm Tổng hợp. Không cần phỏng vấn lại; cách diễn đạt mới tính từ dữ liệu đã lưu.
- Mỗi Q vẫn có trạng thái như 43.3.13; không có điểm, xếp hạng hay tốt/rất tốt trên bảng chính.
- Mỗi nhận xét tối đa hai ý có minh chứng. Nếu có một ý đầy đủ và một ý một phần, ý một phần vẫn có thể xuất hiện kèm Bước đầu.
- Ô thiếu minh chứng không tự biến thành câu khẳng định sinh viên đã nêu ý đó.
- Mở Xem chi tiết để đối chiếu câu nhận xét với tiêu chí và transcript.
- Kiểm tra Đóng chi tiết, đổi phiên và nguồn phân tích vẫn hoạt động.
- Sau đó chạy một phiên mã mới theo luồng hai sinh viên/máy, Q1-Q2-Q3-Closing và kiểm tra 4/4 Synced.

GIỚI HẠN
Bản này cải thiện cách trình bày các ý đã được ghi nhận. Không khôi phục transcript sai/thiếu và không giải quyết các ô chưa có bằng chứng. Chất lượng nhận xét vẫn phụ thuộc dữ liệu đầu vào.
Không thêm nút xóa Session trong bản này; mỗi đợt luyện dùng mã mới.
ZIP chưa được push/deploy. Chỉ hướng dẫn GitHub/Vercel sau khi TypeScript và build trên máy thầy PASS.

QUAY LẠI
Dừng app, khôi phục thư mục sao lưu 43.3.13 rồi build/start. Không xóa localStorage hoặc Supabase.

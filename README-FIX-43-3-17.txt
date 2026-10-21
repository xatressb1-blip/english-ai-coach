FIX 43.3.17 — Hướng luyện tập nối với minh chứng của từng câu
PATCH áp dụng trên FIX 43.3.16. Mỗi file code là file hoàn chỉnh.

THAY ĐỔI
- Hướng luyện tập ghi rõ Q1/Q2/Q3 và ý làm căn cứ đã được ghi nhận trong chính câu đó.
- Giữ ưu tiên phần được phân tích đã lưu xác định còn thiếu, sau đó phần cần phát triển. Không ép mọi sinh viên luyện Q3.
- Khi nhóm kỹ năng/vị trí, đóng góp/phát triển hoặc ví dụ/hành động mới có minh chứng một ý, hướng dẫn nối tiếp ý đó thay vì yêu cầu nói lại cả nhóm.
- Nếu chưa xác định được một ý có minh chứng, dùng hướng dẫn trung tính: đối chiếu bản ghi và luyện một câu ngắn, rõ. Không khẳng định sinh viên chưa nói nội dung đó.
- Không có bản ghi: hướng dẫn luyện một ý và kiểm tra micro; không kết luận nguyên nhân là micro.
- Chỉ tổng hợp deterministic từ dữ liệu đã có. Không gọi Gemini thêm, không sửa transcript/result, schema, tiêu chí đạt hoặc luồng phỏng vấn/đổi vai.
- Cùng dữ liệu đầu vào sẽ cho cùng hướng luyện tập. Kết quả cũ cũng áp dụng cách trình bày này khi mở lại bảng tổng hợp.
- Giáo viên nhận xét cuối cùng từ phân tích hỗ trợ, quan sát và ý kiến bạn đồng hành. Không xếp hạng.

VÍ DỤ MINH HỌA (không phải kết quả kiểm chứng lại của sinh viên trên ảnh)
- Q3 có minh chứng kỹ năng nhưng chưa đủ nhóm kỹ năng/vị trí: liên hệ kỹ năng đã nêu với một nhiệm vụ.
- Q3 có minh chứng đóng góp nhưng chưa đủ nhóm đóng góp/phát triển: thêm một câu về điều muốn học hỏi/phát triển.
- Q3 có minh chứng kỹ năng, phân tích đã lưu ghi phần tìm hiểu công ty còn thiếu: chọn một thông tin thật và giải thích vì sao muốn ứng tuyển.
- Q2 có ưu tiên liên hệ công việc: hướng luyện tập vẫn ghi Q2, không tự chuyển sang Q3.

FILE CẦN THAY
services/lessonPresentation.ts
components/classroom/TeacherLessonSynthesis.tsx (chỉ nhãn phiên bản)
components/classroom/TeacherClassroomDashboard.tsx (chỉ nhãn phiên bản)

CÀI PATCH
1. Ctrl+C dừng app. Sao lưu thư mục hiện tại thành english-ai-backup-43-3-16. Giữ .env.local và dữ liệu trình duyệt.
2. Giải nén PATCH vào thư mục tạm. Chép services và components vào C:\AI_Project\english-ai-mobile-fix-01, chọn Replace files. Có thể chép hai tài liệu vào gốc để lưu.
3. Trong CMD chạy lần lượt:
cd /d C:\AI_Project\english-ai-mobile-fix-01
npx tsc --noEmit
npm run build
npm run start
Không cần npm ci cho PATCH vì package/lock không đổi.
4. Mở http://localhost:3000/teacher/classroom, Ctrl+F5, xác nhận FIX 43.3.17.

KIỂM THỬ
- Mở Session đã có kết quả, bấm Tổng hợp; không cần phỏng vấn lại.
- Đọc số Q trong Hướng luyện tập và đối chiếu đúng dòng Q ở Điểm đã làm được.
- Minh chứng nhiều ý có thể chỉ hiện hai ý tiêu biểu ở bảng; bấm Đã hoàn thành 3 câu để xem minh chứng đầy đủ khi cần đối chiếu.
- Khi đã có kỹ năng/đóng góp ở Q3, hướng dẫn phát triển từ ý đó; khi có ưu tiên Q2, vẫn hiện Q2.
- Câu chưa đủ minh chứng dùng diễn đạt trung tính; không tự chuyển thành đạt hoặc kết luận thiếu nội dung.
- Bấm Đã hoàn thành 3 câu vẫn mở/đóng đúng chi tiết. Nhãn đạt/ghi nhận, transcript, dữ liệu và số sinh viên không thay đổi.
- Thử một lượt hai sinh viên đổi vai trước khi dùng tại lớp.

DÙNG FULL
Giải nén FULL vào thư mục mới. Sao chép .env.local từ bản hiện tại. Chạy npm ci, rồi tsc/build/start ở thư mục có package.json. Không chép đè .env.local bằng file từ nơi khác.

QUAY LẠI
Dừng app, khôi phục bản sao lưu 43.3.16, build/start. Không xóa Session, localStorage hoặc Supabase.

GIỚI HẠN
Chưa có JSON/transcript đầy đủ của các sinh viên trên ảnh, nên chưa thể xác nhận lại từng ý của từng em. Bản này cải thiện cách chọn và diễn đạt hướng luyện tập; không sửa nhận dạng giọng nói hay tự bổ sung minh chứng bị thiếu.
Chưa cập nhật Internet. Chỉ hướng dẫn GitHub/Vercel sau khi tsc và build trên máy thầy đều PASS.

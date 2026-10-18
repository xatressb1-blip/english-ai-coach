FIX 43.3.7 — Stable recruiter presentation and evidence-based teacher coaching
BASE: FIX 43.3.6 (production commit 547fe20).

CÀI BẢN PATCH
1. Dừng server đang chạy bằng Ctrl+C. Sao lưu toàn bộ thư mục dự án hiện tại.
2. Giải nén PATCH vào C:\AI_Project\english-ai-mobile-fix-01
   (thư mục có package.json), chấp nhận thay đúng các file bên dưới.
3. Giữ nguyên .env.local. Không cần npm ci khi áp PATCH trên FIX 43.3.6 đã có node_modules.
4. CMD:
   cd /d C:\AI_Project\english-ai-mobile-fix-01
   npx tsc --noEmit
   npm run build
   npm run start
5. Mở http://localhost:3000 và /teacher/classroom.
   Nếu đang có tiến trình chiếm port 3000, dừng tiến trình cũ trước.

FILE CODE (5):
components/classroom/TeacherClassroomDashboard.tsx
components/classroom/TeacherLessonSynthesis.tsx
components/interview/RecruiterStage.tsx
components/interview/RecruiterAvatar.tsx
services/teacherPracticeOverview.ts

FULL ZIP
Dùng cho một thư mục mới; giải nén sao cho package.json nằm ngay trong thư mục dự án.
Tự chép .env.local từ bản đang chạy vào bản mới, KHÔNG gửi khóa cho người khác.
Chạy npm ci, npx tsc --noEmit, npm run build, npm run start.
Không chứa .env.local, node_modules, .next hoặc .git.
Không giải nén FULL chồng lên dự án hiện tại; dùng PATCH để cập nhật dự án đang chạy.

THAY ĐỔI
- Chân dung Emma cố định, kích thước riêng cho sân khấu; các màn khác giữ kích thước cũ.
- Không hoán đổi ảnh, không chuyển động khẩu hình, không waveform mô phỏng trên sân khấu.
- Phân biệt Your turn / Recording your answer / Preparing transcript / Answer captured.
  Chỉ đọc SpeechContext sẵn có; không điều khiển hoặc sửa bộ ghi âm.
- ASKING hiển thị Interview question vì trạng thái luồng không chứng minh âm thanh thực sự phát.
- Bỏ phần trăm hoàn thành gây hiểu lầm khi Q3 còn chưa trả lời; hiển thị Question 3 / 3.
- Bảng 4 sinh viên thêm một điểm có trích dẫn rõ theo tiêu chí đã lưu.
- Chi tiết thay nhãn câu tốt nhất/kém nhất dựa trên chỉ số cấu trúc ước lượng bằng
  một điểm có minh chứng và một ưu tiên luyện tiếp cụ thể.
  Ưu tiên phần đã biết nhưng chưa nhận diện, sau đó phần cần làm rõ; theo thứ tự Q1–Q3.
  Đây là lựa chọn việc cần luyện, không phải xếp hạng câu trả lời hoặc sinh viên.
- Không thêm gọi Gemini, không đổi điểm, schema, API, package, Q1→Q2→Q3→Closing.
- Chưa triển khai luyện lại Q2/so sánh hai lần.

KIỂM THỬ TRÊN MÁY GIÁO VIÊN
1. Kiểm tra giao diện ở độ phân giải màn hình trình chiếu và zoom 100%.
   Bảng vẫn hiển thị 4 sinh viên; màn nhỏ có thể cần cuộn ngang.
2. Bắt đầu phiên mới, nghe Q1. Chưa nhấn Start Recording: phải là Your turn.
3. Nhấn Start Recording, cấp quyền micro: xuất hiện Recording your answer.
   Dừng: thấy Answer captured khi có transcript; audio-upload có thể qua Preparing transcript.
   Khi lỗi/chưa có transcript, không được nhầm Answer captured.
4. Hoàn thành Q1/Q2/Q3 và Closing; kiểm tra chân dung không đổi và âm thanh như bản trước.
5. Hai sinh viên đổi vai trên mỗi máy, tổng 4 tên khác nhau, đồng bộ về cùng phiên.
6. Giáo viên bấm Tổng hợp: đủ 4 dòng, đúng tên, evaluation mode giữ nguyên.
   Đối chiếu trích dẫn điểm mạnh với transcript trong Xem chi tiết.
   Trường hợp thiếu minh chứng phải ghi chưa đủ, không tự tạo nhận xét tích cực.
7. Kiểm tra ngữ pháp/từ vựng đã lưu; Backup không tự có điểm ngôn ngữ độc lập.
8. Kiểm tra lưu kết luận giáo viên; chức năng này vẫn chỉ lưu trên trình duyệt hiện tại.
9. Chỉ cập nhật GitHub/Vercel sau khi tsc và build trên máy thầy đều PASS và chạy thử ổn.

GIỚI HẠN
Đã chạy tsc, build và kiểm tra fixture/static rendering trong môi trường tạo bản.
Chưa kiểm thử E2E micro/loa, Supabase thực, bố cục bằng trình duyệt hoặc thiết bị hội giảng.
Các quy tắc nhận diện và mức đạt của FIX 43.3.6 được giữ nguyên: có thể bỏ sót cách diễn đạt khác.
Nhận diện lời nói có thể sai. Giáo viên xác minh trước khi kết luận.

QUAY LẠI
Khôi phục 4 file đã thay từ bản sao FIX 43.3.6 (2 file classroom + 2 file interview),
xóa services/teacherPracticeOverview.ts; chạy lại tsc/build.
Dữ liệu và .env.local không thay đổi bởi bản PATCH.

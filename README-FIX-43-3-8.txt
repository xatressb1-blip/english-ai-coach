FIX 43.3.8 — Stable portrait + optional audio visual
Cumulative PATCH: applies directly on FIX 43.3.6 OR FIX 43.3.7.
Includes the teacher coaching/presentation updates from FIX 43.3.7.

CÀI ĐẶT TRÊN MÁY CHÍNH
1. Dừng server bằng Ctrl+C. Sao lưu toàn bộ dự án trước khi thay file.
2. Dùng PATCH, giải nén vào C:\AI_Project\english-ai-mobile-fix-01
   (nơi có package.json), chấp nhận thay các file trong danh sách bên dưới.
   Không cần cài PATCH 43.3.7 trước. Giữ nguyên .env.local.
3. CMD:
   cd /d C:\AI_Project\english-ai-mobile-fix-01
   npx tsc --noEmit
   npm run build
   npm run start
4. Mở http://localhost:3000. Nếu port đang bận, dừng server cũ trước.
Không nâng package. PATCH trên bản đã có node_modules không cần npm ci.
FULL ZIP dùng cho thư mục mới: giải nén, tự chép .env.local của dự án đang chạy,
chạy npm ci rồi tsc/build/start như trên. Không giải nén FULL chồng lên dự án hiện tại.

FILE CODE (8):
components/classroom/TeacherClassroomDashboard.tsx
components/classroom/TeacherLessonSynthesis.tsx
components/interview/RecruiterStage.tsx
components/interview/RecruiterAvatar.tsx
services/teacherPracticeOverview.ts
components/SpeechRecorder.tsx
components/interview/InterviewAudioVisual.tsx
services/recordingVisualStream.ts

HIỆU ỨNG EMMA
- Một chân dung cố định; không đổi ảnh/khẩu hình.
- Sóng minh họa chậm, không đo biên độ giọng Emma.
- Chỉ chạy trong lượt ASKING và khi speechSynthesis báo đang nói, không paused.
  Kiểm tra trạng thái mỗi 150 ms; không sửa speech queue hoặc lịch phát câu hỏi.
  Nếu trình duyệt không cung cấp trạng thái phát chính xác, hiệu ứng có thể không chạy.
- Không tạo thêm âm thanh hoặc gọi AI để có hiệu ứng.

PHÍA SINH VIÊN — GIỚI HẠN CẦN BIẾT
- MediaRecorder/audio-upload (ví dụ fallback Safari): đọc đúng luồng micro đã mở,
  hiển thị thanh biên độ theo RMS, khoảng 20 lần/giây. Tiếng ồn cũng làm thanh thay đổi.
- Chrome/Web Speech: cơ chế hiện tại không bàn giao MediaStream cho giao diện.
  Bản này giữ nguyên cơ chế đó, không mở thêm micro, không ép đổi sang audio-upload.
  Vì vậy hiển thị chỉ báo tĩnh và dòng:
  Recording · microphone level unavailable in live recognition
  KHÔNG có sóng thật theo giọng ở chế độ này.
- Nếu Web Audio không hoạt động: hiện Recording · level display unavailable.
  Ghi âm/transcript vẫn dùng cơ chế cũ.
- Các thanh là chỉ báo mức âm, không chấm phát âm, tự tin, ngữ pháp hoặc chất lượng câu trả lời.
- Hide audio visual chỉ ẩn hiệu ứng và đóng bộ phân tích riêng; KHÔNG dừng micro ghi âm.
  Show audio visual bật lại. Lựa chọn chỉ tồn tại trong màn phỏng vấn hiện tại.
- Không phát tín hiệu micro ra loa, không lưu thêm âm thanh, không đổi schema.
- Tôn trọng prefers-reduced-motion: giảm chuyển động; khi bật cài đặt này thanh không nhảy.

KIỂM TRA TRƯỚC KHI ĐƯA LÊN INTERNET
1. Chạy tsc và build; chỉ tiếp tục khi cả hai PASS trên máy thầy.
2. Kiểm tra trên máy chính, zoom 100%, có chân dung cố định và chữ dễ đọc.
3. Nghe Emma đọc: sóng minh họa chạy nhẹ, dừng sau lượt đọc. Tắt loa không nhất thiết
   dừng hiệu ứng vì đây là trạng thái phát lời đọc, không đo âm thanh thực từ loa.
4. Chrome/Web Speech: ghi một câu, kiểm tra chỉ báo tĩnh, Stop/Submit vẫn hoạt động,
   transcript chính xác tương đương bản trước. Không mong đợi sóng âm thật ở chế độ này.
5. Nếu có thiết bị dùng audio-upload/MediaRecorder: nói nhỏ/to và im lặng,
   quan sát biên độ; nhấn Hide/Show khi đang ghi, dừng và kiểm tra transcript vẫn có đủ câu.
   Không thay cài đặt máy hội giảng chỉ để ép chạy fallback.
6. Thử từ chối quyền micro: vẫn thấy thông báo lỗi cũ, không hiện như đã ghi thành công.
7. Hoàn thành Q1→Q2→Q3→Closing; không thêm bước hoặc chờ hiệu ứng.
8. Sinh viên thứ hai đổi vai; sau 4 sinh viên kiểm tra Dashboard đủ 4/4 cùng session.
9. Bấm Tổng hợp: đối chiếu điểm đã có minh chứng, việc luyện tiếp và transcript.
   Kết quả thiếu dữ liệu phải được ghi rõ; Backup không có đánh giá ngôn ngữ độc lập giả.
10. Kiểm tra teacher judgment vẫn lưu cục bộ như trước.
11. Nếu micro/transcript có bất thường, dừng dùng bản thử và khôi phục bản sao ổn định.
    Gửi lại mô tả thiết bị/trình duyệt và lỗi, không gửi .env.local hoặc khóa bí mật.

GIỮ NGUYÊN
Q1→Q2→Q3→Professional Closing, đổi vai, chấm điểm, local→Supabase, schema, API,
package và số lần gọi Gemini. Chưa có luyện lại Q2/so sánh hai lần.
Synthesis vẫn deterministic từ các kết quả đã có.

KIỂM TRA TẠI MÔI TRƯỜNG TẠO BẢN
PASS: npx tsc --noEmit; npm run build; fixture/static rendering và mock lifecycle.
Chưa kiểm thử bằng trình duyệt thật: micro/loa, quyền micro, iOS, bố cục,
Supabase thực hoặc Vercel. Không coi mock/static checks là E2E.

QUAY LẠI
Ưu tiên khôi phục toàn bộ thư mục sao lưu trước cập nhật.
Nếu quay lại 43.3.6 bằng file: khôi phục 5 file có sẵn đã thay từ bản sao,
xóa services/teacherPracticeOverview.ts, services/recordingVisualStream.ts và
components/interview/InterviewAudioVisual.tsx; chạy lại tsc/build.
Không cần thay dữ liệu hoặc .env.local.

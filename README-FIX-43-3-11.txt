FIX 43.3.11 — Bảng tổng hợp chỉ xem và minh chứng có ngữ cảnh
PATCH áp dụng trên FIX 43.3.10.
Hướng dẫn này thay phần nhập/xác nhận/hiệu chỉnh của các README cũ.

MỤC TIÊU HỘI GIẢNG
Giáo viên xem phân tích ứng dụng, quan sát sinh viên và nhận xét bạn đồng hành,
rồi đưa ra nhận xét cuối bằng lời. Không cần nhập, đánh dấu hoặc xác nhận trên app.
Không tự gắn nhãn Đạt tốt toàn diện thay giáo viên.

CÀI ĐẶT
1. Dừng server (Ctrl+C), sao lưu toàn bộ thư mục dự án 43.3.10 đang chạy.
2. Giải nén PATCH vào C:\AI_Project\english-ai-mobile-fix-01,
   nơi có package.json; chấp nhận thay đúng file theo cây thư mục.
   Không xóa thư mục components/services cũ. Giữ nguyên .env.local.
3. CMD:
   cd /d C:\AI_Project\english-ai-mobile-fix-01
   npx tsc --noEmit
   npm run build
   npm run start
4. Mở http://localhost:3000/teacher/classroom, Ctrl+F5, đăng nhập PIN hiện có.
Không cần npm ci nếu chỉ áp PATCH trên 43.3.10 đã có node_modules.
Nếu dùng FULL: giải nén vào thư mục mới, tự chép .env.local từ bản đang chạy,
npm ci rồi tsc/build/start. Không chép FULL đè vào thư mục hiện tại.
Không áp riêng PATCH này trên bản cũ hơn 43.3.10.

FILE CODE THAY (3):
components/classroom/TeacherClassroomDashboard.tsx
components/classroom/TeacherLessonSynthesis.tsx
services/lessonAttainment.ts

BẢNG CHÍNH
Sinh viên | Q1 | Q2 | Q3 | Điểm đã làm được | Hướng luyện tiếp.
Mỗi câu có số ý/phần và nhận xét nội dung ngắn; giữ màu và chữ để dễ đọc.
Có Xem chi tiết, ngữ pháp/từ vựng, minh chứng, transcript và nguồn phân tích.
Không có checkbox, select hiệu chỉnh, ô nhập kết luận, yêu cầu giáo viên bấm xác nhận.
Không có điểm /10, Overall hoặc tỷ lệ đánh giá ngôn ngữ trên giao diện giáo viên.
Nguồn phân tích vẫn minh bạch trong chi tiết.
Bốn sinh viên giữ thứ tự kết quả, không xếp hạng. Màn nhỏ có thể cuộn ngang.
Không cam kết mọi kích thước màn hình/zoom đều vừa một trang.

LỖI A1 Q2 ĐÃ SỬA
AI lưu điểm mạnh covered với minh chứng một từ teamwork. Bản trước đòi ít nhất
ba từ trong trích dẫn nên bỏ sót dù transcript có cả câu nêu điểm mạnh.
Bản này đối chiếu minh chứng ngắn với câu chứa nó và đúng tiêu chí:
One of my biggest strength is teamwork. -> ghi nhận ý điểm mạnh.
Một từ teamwork đứng riêng, câu nói yếu điểm hoặc phủ định -> không tự tính đạt.
So khớp có chuẩn hóa chữ hoa/thường, dấu câu và khoảng trắng, theo ranh giới từ.
Cần trạng thái covered/partial đã lưu; không tự chấm lại toàn bộ transcript bằng AI.
Lỗi grammar strength/strengths được phân tích riêng, không tự xóa ý nội dung.
Tái hiện fixture từ ảnh A1: Q2 có đủ 5 phần, các tiêu chí partial vẫn cần làm rõ.
Đây là kiểm tra dữ liệu mẫu theo ảnh, chưa phải xác minh bản âm thanh thực tế.

Q1 VÀ Q3
Q1: nếu transcript chưa có giới thiệu/tên, không tự điền tên theo hồ sơ/câu mẫu.
Có 4/5 ý nhưng thiếu ý trọng tâm vẫn ghi cần bổ sung ý trọng tâm.
Q3: chỉ bổ sung ghi nhận phần phát triển khi CHÍNH transcript có phát biểu cá nhân
rõ như I ... grow as a software developer. Không lấy câu mẫu điền vào.
Quy tắc này giúp tránh bỏ sót khi phần đóng góp và phát triển cùng trong một câu.
Có nhãn nguồn đối chiếu transcript trong chi tiết, giữ phân tích gốc để so sánh.
Không phát triển thêm bộ hiểu ngữ nghĩa toàn diện; cách diễn đạt lạ vẫn có thể cần xác minh.

MỨC ĐẠT
Ngưỡng giữ nguyên từ 50%: Q1 3/5, Q2 3/5, Q3 2/4, có ý trọng tâm.
Đủ phần không tự chứng minh mọi phần rõ, đúng grammar hoặc từ vựng phù hợp.
Hoàn thành 3 câu chỉ là có ba bản ghi trả lời, không tự đồng nghĩa đạt mục tiêu.
Chưa đủ minh chứng có thể do dữ liệu/nhận diện; không tự quy là sinh viên chưa nói ý đó.
Giáo viên kết luận bằng lời, kết hợp quan sát và phiếu bạn đồng hành.

DỮ LIỆU VÀ PHẠM VI
Không đọc hoặc ghi dữ liệu xác nhận/hiệu chỉnh giáo viên cũ trong bảng mới.
KHÔNG xóa dữ liệu đó: khôi phục bản cũ vẫn còn dữ liệu trình duyệt trước đây.
Transcript, tiêu chí gốc, điểm và JSON Supabase giữ nguyên.
Không đổi Q1→Q2→Q3→Closing, ghi âm/Web Speech, giọng Emma, sóng âm, đổi vai,
API, schema, package, chấm gốc, sync local→Supabase hoặc số lần gọi Gemini.
Tổng hợp deterministic từ kết quả đã lưu. Không gọi Gemini thêm khi bấm Tổng hợp.
Báo cáo cá nhân/History vẫn có thể hiện điểm như trước; phạm vi ẩn điểm là giáo viên.
Chưa thêm nghe lại âm thanh, luyện lại Q2 hoặc so sánh hai lần.

KIỂM THỬ TRÊN MÁY THẦY
1. Cả tsc và build đều PASS; chưa hướng dẫn GitHub/Vercel trước điều kiện này.
2. Mở session có kết quả A1, bấm Tổng hợp. Thấy FIX 43.3.11, sáu cột và không có ô nhập.
3. Xem chi tiết Q2 A1: nếu transcript và JSON đúng như ảnh đã gửi,
   ý điểm mạnh phải được ghi nhận; minh chứng có cả câu chứa teamwork.
4. Q1 không có tên/giới thiệu trong transcript: không tự cho đạt chỉ vì có 4 phần khác.
5. Q3 phần phát triển chỉ được ghi nhận thêm nếu transcript thực có câu thể hiện rõ.
6. Ngữ pháp/từ vựng xem riêng, Backup không có đánh giá ngôn ngữ độc lập giả.
7. Dữ liệu cũ thiếu minh chứng: thông báo cần đối chiếu, không tự tạo nội dung.
8. Tải lại trang, mở sinh viên khác, kiểm tra chi tiết đúng tên và đúng session.
9. Một session MỚI: hai sinh viên/máy đổi vai, Q1→Q2→Q3→Closing, kiểm tra sync 4/4.
10. Thử đúng độ phân giải, trình duyệt, micro/loa dùng hội giảng; không kết luận chỉ từ build.

KIỂM TRA TẠI ĐÂY
PASS: tsc, build, fixture A1 Q2, phủ định/từ đứng riêng/ranh giới từ/trùng tiêu chí,
minh chứng ngắn Q1, phát biểu phát triển Q3, ngưỡng 50% và ý trọng tâm,
completion tách attainment, kết xuất tĩnh bảng 4 sinh viên và chi tiết không nhập liệu/điểm.
Không có Chromium để chạy trình duyệt tự động. Chưa kiểm thử browser thật,
micro/loa, Supabase E2E, bố cục máy hội giảng hoặc Vercel.
Đã đọc ảnh bổ sung Q1/Q2 và transcript Q3 đầy đủ; có fixture chép từ ảnh để đối chiếu.
Các fixture không thay thế việc kiểm tra JSON phiên thật và bản âm thanh thực tế.
ZIP kiểm CRC, byte, chỉ 3 file source khác 43.3.10; PATCH áp lên nền bằng FULL.

QUAY LẠI
Dừng server, khôi phục đúng ba file trên từ bản sao 43.3.10 rồi tsc/build/start.
Giữ nguyên .env.local và Supabase; không xóa dữ liệu trình duyệt.

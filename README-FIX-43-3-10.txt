FIX 43.3.10 — Hoàn thành hoạt động và kết luận giáo viên
BẢN PATCH NÀY ÁP DỤNG TRÊN FIX 43.3.9.

MỤC TIÊU
Ổn định phần tổng hợp cho hội giảng: ghi nhận hoàn thành nhưng không tự coi mọi
câu trả lời là đạt yêu cầu nội dung. Không đổi luồng phỏng vấn.

CÀI PATCH
1. Dừng server bằng Ctrl+C. Sao lưu toàn bộ thư mục dự án hiện tại.
2. Giải nén PATCH vào C:\AI_Project\english-ai-mobile-fix-01,
   đúng nơi có package.json. Chép đè các file theo cấu trúc thư mục.
   Không xóa thư mục components hoặc services cũ. Giữ nguyên .env.local.
3. CMD:
   cd /d C:\AI_Project\english-ai-mobile-fix-01
   npx tsc --noEmit
   npm run build
   npm run start
4. Mở http://localhost:3000/teacher/classroom, Ctrl+F5, đăng nhập PIN đang dùng.
Không cần npm ci cho PATCH trên bản đã có node_modules. Không nâng package.
Nếu đang dùng bản trước 43.3.9, không áp riêng PATCH này. Dùng FULL trong thư mục
mới, tự chép .env.local, npm ci rồi tsc/build/start; hoặc cập nhật đúng bản nền trước.
FULL không chứa .env.local, .git, node_modules, .next. Không chép FULL đè lên thư mục cũ.

FILE CODE THAY (3)
components/classroom/TeacherClassroomDashboard.tsx
components/classroom/TeacherLessonSynthesis.tsx
services/lessonAttainment.ts

THAY ĐỔI GIAO DIỆN GIÁO VIÊN
- Bỏ hai ô tổng hợp tỷ lệ cả lớp ở đầu bảng. Tiêu chí dài chuyển vào mục có thể mở.
- Mỗi em có nhãn Đã hoàn thành hoạt động phỏng vấn nếu có transcript của cả 3 câu.
  Đây là xác nhận bản ghi câu trả lời, KHÔNG phải xác nhận đạt mục tiêu bài học.
- Giữ số ý/phần của từng câu và số câu đủ ngưỡng, không xếp hạng, không điểm /10.
- Nguồn AI trực tiếp / kết hợp / tiêu chí dự phòng được Việt hóa, xem trong chi tiết.
- Đã thể hiện một phần nội dung: ghi nhận điều có, kèm hướng bổ sung.
  Nếu chưa ghi nhận ý nào, ghi Đã có câu trả lời — cần bổ sung nội dung,
  không tự khẳng định đã thể hiện nội dung trọng tâm.
- Thiếu trích dẫn/JSON hoặc dữ liệu mâu thuẫn: cần xác minh transcript hoặc minh chứng.
  Không tự quy là lỗi của sinh viên, cũng không tự khẳng định lỗi micro/mạng.

TIÊU CHÍ GIỮ NGUYÊN
Từ 50% trở lên: Q1 ít nhất 3/5 ý; Q2 ít nhất 3/5 phần; Q3 ít nhất 2/4 phần.
Có ý trọng tâm: Q1 giới thiệu, Q2 điểm mạnh, Q3 lý do muốn vào công ty.
Nội dung phải hiểu được và được giáo viên xác nhận.
Đạt tốt: đủ 5/5,5/5,4/4 và giáo viên xác nhận nội dung, cấu trúc, từ vựng.
Không dùng số câu/độ dài làm bằng chứng tự động cho cấu trúc phù hợp.
Quy tắc tự động vẫn thận trọng; sửa một lỗi loại phủ định not only/not just.
Không thêm AI để chấm lại khi tổng hợp; chưa có bộ hiểu ngữ nghĩa mới hoàn chỉnh.

KHI GIÁO VIÊN THẤY APP BỎ SÓT Ý
1. Xem chi tiết của sinh viên; đối chiếu transcript, lời nói thực tế và phiếu bạn quan sát.
2. Mở Hiệu chỉnh ý theo quan sát và phiếu bạn học trong khối Giáo viên xác nhận.
3. Nhập căn cứ cụ thể trước. Ví dụ: Tôi nghe em nói mục tiêu Network Technician;
   transcript bỏ sót câu cuối; đã đối chiếu phiếu bạn quan sát.
4. Ở từng ý Q1/Q2/Q3, chọn một trong:
   Theo phân tích gốc / Đã thể hiện theo quan sát / Chưa thể hiện theo quan sát /
   Cần xác minh thêm. Chỉ hiệu chỉnh ý giáo viên có căn cứ, không chọn hàng loạt để tạo đạt.
5. Bảng ghi Có hiệu chỉnh của giáo viên; phân tích gốc và transcript không đổi.
   Phần máy phân tích và phần giáo viên xác nhận được giữ riêng để đối chiếu.
6. Sau hiệu chỉnh, xác nhận lại nội dung. Nếu đủ ý và cấu trúc/từ vựng phù hợp,
   chọn đủ ba ô để hiện Đạt tốt ... giáo viên xác nhận.
7. Có thể trở về Theo phân tích gốc để rút hiệu chỉnh. Xóa căn cứ thì hiệu chỉnh
   không được áp dụng. Kết quả câu trả lời/phân tích thay đổi: xác nhận cũ không áp dụng.

KHI BẢN NHẬN DIỆN SAI HOẶC THIẾU
- Giáo viên đánh dấu Bản nhận diện câu này sai hoặc thiếu.
- App chưa dùng nhận xét ngôn ngữ tự động của câu đó để quy thành lỗi sinh viên.
- Các ý máy đếm của câu bị đánh dấu không được dùng để tự kết luận đạt.
- Giáo viên đối chiếu thực tế và xác minh từng ý có căn cứ. Nếu còn ý chưa xác minh,
  câu và kết luận chung tiếp tục ghi cần xác minh bản nhận diện.
- Giữ transcript gốc, không lấy câu mẫu/Word điền vào phần chưa thu được.
- Đây không phải tính năng phục hồi âm thanh; không đảm bảo nhận diện giọng nói hết lỗi.

LƯU Ý VỀ LƯU TRỮ
Hiệu chỉnh, căn cứ và kết luận của giáo viên chỉ lưu trên trình duyệt này,
chưa đồng bộ Supabase. Không tự mang sang thiết bị/trình duyệt khác.
Vẫn giữ khóa lưu kết luận và xác nhận cũ để đọc dữ liệu 43.3.9.
Đổi dữ liệu câu trả lời/phân tích làm xác nhận cũ không còn hiệu lực.
Nếu lưu cục bộ thất bại, sao chép căn cứ/kết luận trước khi đóng trang.

KHÔNG THAY ĐỔI SO VỚI 43.3.9
Q1→Q2→Q3→Professional Closing, đổi vai, lời đọc Emma, ghi âm/Web Speech,
sóng âm, API, schema, package, chấm gốc, local→Supabase, số lần gọi Gemini.
Báo cáo cá nhân/History vẫn có thể hiển thị điểm; phạm vi ẩn điểm là giao diện giáo viên.
Không thêm lưu/nghe lại âm thanh, luyện lại Q2 hoặc so sánh hai lần.

KIỂM THỬ TRÊN MÁY THẦY
1. tsc và build đều PASS; chưa cập nhật GitHub/Vercel trước điều kiện này.
2. Mở session cũ; Tổng hợp không còn hai ô tỷ lệ cả lớp. Nguồn phân tích ở chi tiết.
3. Em có đủ ba bản ghi nhưng ít ý: hiện hoàn thành, không tự hiện đạt cơ bản.
4. Đủ ngưỡng + ý trọng tâm: chờ giáo viên xác nhận; đủ ý chưa tự Đạt tốt.
5. Thử hiệu chỉnh một ý có căn cứ; kiểm tra bảng cập nhật và nhãn nguồn giáo viên.
6. Thử đánh dấu transcript sai; kiểm tra không dùng nhận xét ngôn ngữ của câu đó.
7. Tải lại cùng trình duyệt: xác nhận giữ nguyên nếu dữ liệu không đổi.
8. Bỏ hiệu chỉnh, chọn lại Theo phân tích gốc: không được lưu nhầm mức đạt cũ.
9. Chạy một session MỚI, hai sinh viên/máy đổi vai, tổng 4 tên; kiểm tra đủ kết quả.
10. Kiểm tra đúng máy/trình duyệt/micro dự định dùng hội giảng và toàn bộ luồng.

KIỂM TRA TẠI ĐÂY
PASS TypeScript, build, kiểm tra tình huống bằng fixture/static rendering và hook harness.
Hook harness mô phỏng chọn/đánh dấu, lưu/tải và dữ liệu thay đổi; KHÔNG phải browser E2E.
Không chạy được trình duyệt tự động vì thiếu Chromium executable.
Chưa xác nhận bố cục bằng browser thật, micro/loa, Supabase thực hoặc Vercel.
ZIP được kiểm tra CRC, từng byte và đối chiếu thay đổi chỉ trong 3 file.

QUAY LẠI
Khôi phục ba file code bên trên từ bản sao 43.3.9, chạy lại tsc/build.
Khuyến nghị sao lưu toàn bộ thư mục trước cài. Không cần đổi Supabase hay .env.local.

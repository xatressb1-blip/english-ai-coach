FIX 43.3.9 — Lesson content attainment and teacher final judgment
Cumulative PATCH for FIX 43.3.6 / 43.3.7 / 43.3.8.
Includes the portrait/audio visual work in FIX 43.3.7–43.3.8.

MỤC TIÊU VÀ PHẠM VI
Ẩn điểm Q1/Q2/Q3, Overall, điểm ngữ pháp/từ vựng và các chỉ số phần trăm
đánh giá khỏi Teacher Dashboard + Tổng hợp + Xem chi tiết giáo viên.
Vẫn hiển thị số ý/phần và số câu đủ ngưỡng nội dung để đo kết quả hoạt động.
KHÔNG thay điểm lưu trong JSON/Supabase; KHÔNG thay báo cáo cá nhân của sinh viên.
Báo cáo cá nhân/History vẫn có thể hiển thị điểm như trước. Phạm vi ẩn điểm là giao diện giáo viên.
Không sửa Q1→Q2→Q3→Closing, API, schema, package, bộ ghi âm, lời đọc hoặc sync so với 43.3.8.
Không gọi thêm Gemini khi tổng hợp; không tự đánh giá phát âm/hành vi từ transcript.

CÀI ĐẶT (PATCH)
1. Dừng server bằng Ctrl+C. Sao lưu toàn bộ thư mục dự án đang chạy.
2. Giải nén PATCH vào C:\AI_Project\english-ai-mobile-fix-01
   (thư mục có package.json); chấp nhận thay file theo đúng cây thư mục.
   Không cần cài 43.3.7 hoặc 43.3.8 trước. Giữ nguyên .env.local.
3. CMD:
   cd /d C:\AI_Project\english-ai-mobile-fix-01
   npx tsc --noEmit
   npm run build
   npm run start
4. Mở http://localhost:3000/teacher/classroom và tải lại trang.
Không cần npm ci khi áp PATCH trên dự án đã có node_modules.
FULL ZIP: dùng thư mục mới, tự chép .env.local từ bản đang chạy; npm ci rồi
chạy tsc/build/start. Không giải nén FULL chồng lên thư mục dự án hiện tại.
Các ZIP không chứa .env.local, node_modules, .next hay .git.

NGƯỠNG NỘI DUNG ĐÃ THỐNG NHẤT (TỪ 50% TRỞ LÊN)
Q1: ít nhất 3/5 ý, có giới thiệu bản thân.
Q2: ít nhất 3/5 phần, có nêu điểm mạnh.
Q3: ít nhất 2/4 phần, có lý do/điều hấp dẫn khiến muốn vào công ty.
Thông tin tìm hiểu công ty đơn thuần không thay thế lý do chọn công ty.
Ngưỡng là về nội dung, không tự suy ra đạt ngữ pháp, từ vựng, phát âm hoặc mọi mục tiêu.

ĐẾM Ý MINH BẠCH
Giữ khung bài học 5/5/4; không lấy rubric chi tiết 6/7/7 làm tổng bắt buộc.
Mỗi phần cần tiêu chí đã lưu (covered hoặc partial) và trích dẫn khớp transcript,
không phải placeholder/từ khóa đơn lẻ. Cụm trích dẫn tối thiểu 3 từ; có phủ định
thì giữ thận trọng để giáo viên xác minh. Phần gộp cần minh chứng cho các tiêu chí con.
Partial có minh chứng được tính vào mức cơ bản, nhưng vẫn có thể cần làm rõ.
Các quy tắc này chỉ kiểm tra minh chứng đã lưu, không hiểu ngữ nghĩa hoàn hảo.
Không thể tự chứng minh mọi câu đều hiểu được: giáo viên cần đối chiếu thực tế.
Không có tiêu chí/trích dẫn: chưa đủ minh chứng, không tự cho đạt bằng từ khóa.
Nếu còn phần chưa biết nhưng số phần có minh chứng đã đủ ngưỡng và có ý trọng tâm,
vẫn đề xuất đạt cơ bản; số đếm ghi Ít nhất. Chưa biết không bị quy thành sai.
Kết quả cũ không đủ JSON có thể cần giáo viên đọc transcript và ghi kết luận cuối,
không tự gọi AI để chấm lại. Không sửa transcript gốc.

CÁCH GIÁO VIÊN TỔNG HỢP
1. Bấm TỔNG HỢP KẾT QUẢ: có bảng 4 sinh viên, Q1/Q2/Q3 với số ý/phần và hướng luyện.
2. Chỉ số chung: X/4 đủ ngưỡng nội dung cả ba câu theo phân tích; Y/4 giáo viên đã xác nhận.
   Đây không phải bảng xếp hạng hay bằng chứng mức tăng từ Activity 1.
3. Xem chi tiết từng em: đối chiếu trích dẫn, ngữ pháp/từ vựng đã lưu, transcript.
4. Ba ô giáo viên xác nhận, KHÔNG tự chọn sẵn:
   - Nội dung đúng trọng tâm, hiểu được, xác nhận các ý đã đếm.
   - Cấu trúc và trình tự phù hợp ở cả ba câu.
   - Từ vựng phù hợp ở cả ba câu.
5. Đạt tốt yêu cầu thực hành Activity 2 chỉ khi đủ 5/5, 5/5, 4/4 có minh chứng và
   giáo viên chọn cả ba xác nhận. Đủ ý một mình chưa phải đạt tốt.
   Nếu cả ba câu đủ ngưỡng nhưng chưa đủ toàn bộ ý, xác nhận nội dung cho mức đạt cơ bản.
   Không dùng structureScore ước lượng từ số câu để tự kết luận đúng cấu trúc.
6. Phần kết luận cuối: kết hợp AI, phiếu bạn quan sát khi đổi vai và quan sát giáo viên.
   Ngữ pháp xem riêng; hợp tác, chủ động và sử dụng AI để sửa bài cần quan sát/sản phẩm.
7. Xác nhận + kết luận chỉ lưu trên trình duyệt hiện tại, chưa đồng bộ Supabase.
   Đổi máy/trình duyệt không mang theo các xác nhận này. Kết quả câu trả lời/phân tích thay
   đổi sẽ làm xác nhận cũ không còn áp dụng; giáo viên cần xem lại.
8. Có thể bỏ chọn để rút lại xác nhận. Không có điểm yếu rõ thì dùng Hướng phát triển tiếp theo.

CODE THAY ĐỔI MỚI SO VỚI 43.3.8 (3 FILE):
components/classroom/TeacherClassroomDashboard.tsx
components/classroom/TeacherLessonSynthesis.tsx
services/lessonAttainment.ts
PATCH tích lũy còn có các file đã thay ở 43.3.7–43.3.8; xem README tương ứng.

KIỂM THỬ TRÊN MÁY THẦY
- tsc và build đều phải PASS trước khi cập nhật GitHub/Vercel.
- Mở phiên có 4 kết quả. Kiểm tra không còn điểm /10 hoặc Overall ở cả Live results,
  Tổng hợp và Xem chi tiết. Transcript gốc/lời giáo viên tự nhập vẫn giữ nguyên.
- Q1/Q2 có 3/5 phần và ý trọng tâm -> đề xuất cơ bản; Q3 có 2/4 và lý do chọn công ty
  -> đề xuất cơ bản. Thiếu ý trọng tâm không tự đạt dù đủ số lượng phần khác.
- Trường hợp 5/5,5/5,4/4: trước xác nhận chỉ ghi đủ ý/chờ giáo viên. Chọn cả ba ô:
  đạt tốt; bỏ một ô cấu trúc/từ vựng: trở về mức cơ bản nếu nội dung vẫn xác nhận.
- Thử tải lại trang cùng trình duyệt: giữ xác nhận. Dữ liệu câu trả lời thay đổi:
  xác nhận trước không được dùng cho kết quả mới.
- Backup: không hiển thị điểm/ngôn ngữ độc lập giả. Thiếu JSON phải nói chưa đủ minh chứng.
- Thực hiện một lượt phỏng vấn mới Q1→Q2→Q3→Closing, đổi vai, kiểm tra 4/4 sync.
- Kiểm tra micro/loa và sóng âm theo hướng dẫn 43.3.8 (Chrome Web Speech vẫn chỉ báo tĩnh).

KIỂM TRA TẠI ĐÂY
PASS tsc, build, fixture/static rendering, mock audio lifecycle và kiểm tra ZIP.
Chưa kiểm thử browser thật, thao tác checkbox/storage E2E, micro/loa, Supabase thật,
thiết bị hội giảng hoặc Vercel. Fixture kiểm tra điều kiện/kết xuất, không thay E2E.

QUAY LẠI
Tốt nhất khôi phục toàn bộ thư mục sao lưu trước cập nhật.
Nếu đã ở 43.3.8: khôi phục hai component classroom từ bản sao 43.3.8,
xóa services/lessonAttainment.ts rồi chạy lại tsc/build.
Nếu đang ở 43.3.6, dùng bản sao đầy đủ 43.3.6 vì PATCH này có thay đổi tích lũy.
Giữ nguyên dữ liệu/Supabase và .env.local.

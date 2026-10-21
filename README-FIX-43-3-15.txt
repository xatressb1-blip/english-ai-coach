FIX 43.3.15 — Kết nối trang chủ, tự luyện và khu vực giáo viên
PATCH chỉ dùng trên FIX 43.3.14. File trong PATCH là file hoàn chỉnh.

THAY ĐỔI
- Trang chủ có nút TỰ LUYỆN PHỎNG VẤN dẫn tới /interview không kèm mã Session, sử dụng luồng cá nhân đã có.
- Có nút Học theo hướng dẫn và Dành cho giáo viên. Sửa vị trí đích learning-path để nút hướng dẫn cuộn đúng phần câu hỏi.
- Thanh điều hướng phân biệt Tự luyện / Thống kê cá nhân / Lịch sử / Giáo viên. Dashboard cũ vẫn còn, chỉ đổi nhãn để không nhầm với bảng kết quả lớp.
- Trang giáo viên dùng chung thanh điều hướng và logo, có lối quay lại Trang chủ; Teacher PIN vẫn bắt buộc.
- Thay nhãn Beta 0.9 bằng mô tả ứng dụng. Nhãn tĩnh AI Ready được đổi thành Luyện tập cùng AI vì trước đây không kiểm tra trạng thái dịch vụ.
- Menu thu gọn trên màn hình nhỏ hơn để dành chỗ cho các liên kết.
- Hai component kết quả lớp chỉ cập nhật nhãn FIX 43.3.15; logic tổng hợp và tiêu chí không đổi.

PHẠM VI GIỮ ỔN ĐỊNH HỘI GIẢNG
Không sửa InterviewEngine, CandidateProfile, context, recorder, micro, Emma, Q1-Q2-Q3-Closing, đổi vai, API, Supabase, schema, rubric, bộ đối chiếu minh chứng hoặc package/lock.
Luồng Session vẫn qua /interview?session=MA-PHIEN do giáo viên cung cấp. Nút tự luyện không tự đưa người học vào Session.
Luồng cá nhân đã có báo cáo và lịch sử trên trình duyệt. Bản này chỉ thêm nút truy cập, chưa làm báo cáo tự học mới, tài khoản, đồng bộ lịch sử nhiều thiết bị hoặc so sánh lần luyện. Không coi báo cáo cá nhân hiện có là đã được nâng cấp tương đương bảng Session.

SÁU FILE CẦN THAY
components/Hero.tsx
components/Navbar.tsx
app/page.tsx
app/teacher/classroom/page.tsx
components/classroom/TeacherClassroomDashboard.tsx (chỉ nhãn phiên bản)
components/classroom/TeacherLessonSynthesis.tsx (chỉ nhãn phiên bản)

CÀI PATCH TRÊN WINDOWS
1. Dừng app bằng Ctrl+C. Sao chép nguyên thư mục dự án sang english-ai-backup-43-3-14; giữ .env.local.
2. Giải nén PATCH vào thư mục tạm. Chép hai thư mục app và components vào C:\AI_Project\english-ai-mobile-fix-01, chọn Replace files. Có thể chép README và VALIDATION vào gốc để lưu hướng dẫn.
3. Mở CMD tại thư mục có package.json:
cd /d C:\AI_Project\english-ai-mobile-fix-01
npx tsc --noEmit
npm run build
npm run start
PATCH không cần npm ci vì dependencies không đổi.
4. Mở http://localhost:3000 rồi Ctrl+F5. Vào Giáo viên và xác nhận FIX 43.3.15.

DÙNG FULL
Giải nén FULL vào thư mục mới, sao chép .env.local từ bản hiện tại, chạy npm ci rồi tsc/build/start tại thư mục có package.json. Giữ thư mục cũ để quay lại.

KIỂM THỬ
- Trang chủ: nút TỰ LUYỆN PHỎNG VẤN mở /interview không có ?session. Nhập tên, tiếp tục: không hiển thị mã Session; kết quả cá nhân không được gửi vào phiên lớp.
- Học theo hướng dẫn cuộn đúng mục câu hỏi.
- Dành cho giáo viên mở /teacher/classroom, có cùng thanh điều hướng và ô Teacher PIN; không hiển thị dữ liệu lớp khi chưa xác thực.
- Trang chủ từ thanh điều hướng giáo viên quay đúng /. Menu điện thoại mở/đóng và chọn được các liên kết.
- Giữ thử một phiên mã mới: hai nhóm, hai sinh viên/máy đổi vai; Q1-Q2-Q3-Closing, đủ 4/4 Synced; bảng tổng hợp có cùng tiêu chí/nhận xét như 43.3.14.
- Thử chuyển từ luồng Session sang Trang chủ rồi Tự luyện để đối chiếu không còn gắn mã phiên cũ.
- Mở phiên cũ trong Dashboard để xác nhận kết quả không bị thay đổi.
- Chỉ hướng dẫn GitHub/Vercel sau khi tsc và build trên máy thầy đều PASS.

TÊN MIỀN
Bản code dùng đường dẫn nội bộ tương đối, không gắn cứng trolyaoai.vercel.app và không thay cấu hình Vercel. Chưa xác nhận tên này còn khả dụng.
Nếu chuyển sang địa chỉ mới, cần kiểm tra Student Link trên Dashboard: NEXT_PUBLIC_CLASSROOM_BASE_URL hoặc địa chỉ lưu trên trình duyệt có thể vẫn trỏ địa chỉ cũ.
Dữ liệu lịch sử và bộ đếm lưu trên trình duyệt thuộc từng địa chỉ website; không tự chuyển sang địa chỉ mới. Kết quả đã đồng bộ Supabase vẫn ở cùng project nếu cấu hình server không đổi. Cần kiểm tra mã Session và liên kết tham gia trên tên miền mới trước khi dùng hội giảng.
Không đổi tên project hoặc xóa địa chỉ cũ chỉ để thử tên mới; chưa có thay đổi tên miền nào được thực hiện trong bản này.

QUAY LẠI
Dừng app, khôi phục thư mục sao lưu 43.3.14 rồi build/start lại. Không xóa dữ liệu trình duyệt hoặc Supabase.

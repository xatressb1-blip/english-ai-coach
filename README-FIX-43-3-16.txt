FIX 43.3.16 — Mở chi tiết từ dòng trạng thái sinh viên
PATCH chỉ áp dụng trên FIX 43.3.15. Các file code trong ZIP là file hoàn chỉnh.

THAY ĐỔI
- Bỏ nút xanh Xem chi tiết riêng khỏi cột Sinh viên.
- Bấm Đã hoàn thành 3 câu để mở chi tiết đúng sinh viên; bấm lại cùng dòng để đóng.
- Với kết quả chưa đủ ba câu, dòng x/3 câu có bản ghi cũng mở được chi tiết.
- Dòng trạng thái giữ kiểu chữ nhẹ, gạch chân chấm để nhận biết có thể bấm; khi mở đổi sang màu xanh nhẹ. Không có nền nút xanh.
- Hỗ trợ nút bàn phím Tab, Enter/Space, mô tả cho trình đọc màn hình và hiển thị focus.
- Nút Đóng ở phần chi tiết phía dưới vẫn giữ để thuận tiện.
- Không đổi nhận xét, tiêu chí, dữ liệu, API, interview, recorder, Session hoặc Supabase.

FILE CẦN THAY
components/classroom/TeacherLessonSynthesis.tsx
components/classroom/TeacherClassroomDashboard.tsx (chỉ nhãn phiên bản)

CÀI PATCH
1. Ctrl+C để dừng app, sao lưu nguyên thư mục hiện tại sang english-ai-backup-43-3-15. Giữ .env.local và dữ liệu trình duyệt.
2. Giải nén PATCH vào thư mục tạm, chép thư mục components vào C:\AI_Project\english-ai-mobile-fix-01, chọn Replace files. Hai tài liệu có thể chép vào gốc để lưu.
3. Mở CMD tại thư mục có package.json và chạy:
cd /d C:\AI_Project\english-ai-mobile-fix-01
npx tsc --noEmit
npm run build
npm run start
Không cần npm ci cho PATCH vì package/lock không đổi.
4. Mở http://localhost:3000/teacher/classroom rồi Ctrl+F5; xác nhận FIX 43.3.16.

DÙNG FULL
Giải nén vào thư mục mới, sao chép .env.local từ bản hiện tại, chạy npm ci rồi tsc/build/start tại thư mục có package.json. Giữ bản cũ để quay lại.

KIỂM THỬ TRÊN MÁY THẦY
- Mở phiên cũ có kết quả, bấm Tổng hợp. Không cần phỏng vấn lại.
- Không còn nút xanh Xem chi tiết dưới tên sinh viên.
- Bấm Đã hoàn thành 3 câu: mở đúng tên, đúng Q1-Q3. Bấm lại: đóng.
- Bấm dòng của sinh viên khác: chuyển đúng chi tiết, không lẫn dữ liệu.
- Nút Đóng ở vùng chi tiết vẫn hoạt động.
- Tab tới dòng trạng thái rồi Enter hoặc Space để thử mở/đóng; có viền focus.
- Đổi Session: không giữ lựa chọn sinh viên phiên trước.
- Trang chủ, nút tự luyện và các lối vào của 43.3.15 vẫn giữ nguyên.

KIỂM TRA VÀ GIỚI HẠN
Đã kiểm tra TypeScript, build và eslint component sửa. Chưa thao tác trên trình duyệt thật/micro/Supabase thật. Không có thay đổi phiên bản thư viện.
Bản này chưa được đưa lên Internet. Chỉ hướng dẫn GitHub/Vercel sau khi tsc và build trên máy thầy PASS.
Quay lại bằng cách dừng app, khôi phục thư mục sao lưu 43.3.15, build/start. Không xóa localStorage hoặc Supabase.

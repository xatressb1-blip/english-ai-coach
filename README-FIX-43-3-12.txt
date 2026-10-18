FIX 43.3.12 — Bảng tổng hợp hỗ trợ nhận xét nhanh
BASE PATCH: FIX 43.3.11. Nếu khác phiên bản, không chép PATCH chồng lên.

THAY ĐỔI
- Bảng chính: Sinh viên / Q1 / Q2 / Q3 / Điểm đã làm được / Hướng luyện tiếp.
- Q1–Q3 ghi Trả lời đúng trọng tâm khi bộ đối chiếu hiện có ghi nhận đủ ngưỡng nội dung cùng ý cốt lõi. Không sửa ngưỡng để làm đẹp kết quả.
- Có transcript nhưng chưa đủ bằng chứng: Đã ghi nhận câu trả lời. Không transcript: Chưa có bản ghi câu trả lời.
- Không hiện số ý, điểm số hay xếp loại trên bảng chính. Mỗi sinh viên có điểm đã làm được cho từng Q theo bằng chứng, ưu tiên tối đa hai ý/câu.
- Một hướng luyện tiếp: ưu tiên nội dung thiếu có căn cứ, rồi nội dung mới đề cập. Dữ liệu không rõ dùng gợi ý luyện tập trung tính, không khẳng định sinh viên đã nói thiếu.
- Xem chi tiết giữ nguyên số ý, tiêu chí, transcript, ngữ pháp/từ vựng và nguồn đánh giá.
- Bảng Candidate status phía trên dùng cùng nhãn với bảng tổng hợp.
- Không nhập nhận xét của giáo viên trong giờ. Giáo viên kết hợp quan sát và bạn đồng hành để kết luận.
- Không gọi thêm Gemini khi tổng hợp. Không đổi schema, dependencies, interview, mic, Emma hoặc cloud sync.
- CHƯA thêm xóa Session hoặc đặt lại lượt hai bạn. Dùng mã phiên mới cho mỗi lần luyện để tránh lẫn lượt cũ.

CÀI PATCH TRÊN WINDOWS
1. Ctrl+C để dừng app. Sao chép cả thư mục dự án sang thư mục sao lưu trước khi chép đè.
2. Giải nén PATCH vào thư mục tạm. Chép components và services vào C:\AI_Project\english-ai-mobile-fix-01, chọn Replace files. Các file trong ZIP là file hoàn chỉnh.
3. Chép README/VALIDATION vào gốc dự án nếu muốn lưu hướng dẫn. Giữ .env.local.
4. Trong CMD chạy:
cd /d C:\AI_Project\english-ai-mobile-fix-01
npx tsc --noEmit
npm run build
npm run start
Không cần npm ci khi dùng PATCH vì package không đổi.
5. Mở http://localhost:3000/teacher/classroom rồi Ctrl+F5. Bản hiển thị phải là FIX 43.3.12.

DÙNG FULL
Giải nén FULL vào thư mục mới, sao chép .env.local từ bản đang chạy; mở CMD tại thư mục có package.json, chạy npm ci rồi ba lệnh kiểm tra/chạy như trên. Không xóa thư mục cũ.

KIỂM THỬ TRƯỚC INTERNET
- Mở phiên cũ có bốn kết quả, bấm TỔNG HỢP KẾT QUẢ. Không cần phỏng vấn lại để xem cách trình bày mới.
- Bảng chính không có 0/5, 0/4, mức Đạt/Tốt/Rất tốt; không xếp hạng. Nhãn tích cực chỉ khi có bằng chứng.
- Kiểm tra các nhận xét Q1/Q2/Q3 riêng của từng em; Xem chi tiết còn đủ nội dung; Đóng chi tiết hoạt động.
- Chuyển phiên không giữ chi tiết sinh viên phiên trước.
- Thử thêm một phiên mới: hai nhóm, hai sinh viên mỗi máy, đổi vai, Q1→Q2→Q3→Closing; Dashboard đủ 4/4 và Synced.
- Nguồn Live AI / Mixed / Backup nằm trong Xem nguồn và chi tiết.
- Chỉ cập nhật GitHub/Vercel sau khi tsc và build trên máy thầy PASS. Bản ZIP này chưa được đẩy Internet.

ROLLBACK
Dừng app, khôi phục thư mục sao lưu 43.3.11, giữ .env.local, build lại rồi start. Không xóa dữ liệu trình duyệt. Bản này không ghi lại kết quả hay thay schema.

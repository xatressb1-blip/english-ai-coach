FIX 43.3.13 — Ghi nhận yêu cầu thực hành bước đầu của Activity 2
Nền PATCH: FIX 43.3.12. Không chép PATCH này lên phiên bản khác.

TIÊU CHÍ ĐÃ THỐNG NHẤT
Áp dụng riêng cho từng câu Q1, Q2, Q3:
- Có ít nhất một ý phù hợp, có minh chứng đối chiếu được trong transcript đã lưu: Đạt yêu cầu thực hành.
- Có transcript nhưng chưa xác định được ý có minh chứng: Đã ghi nhận câu trả lời.
- Không có transcript: Chưa có bản ghi.
Không phân mức tốt/rất tốt, không xếp hạng và không hiển thị số điểm hoặc số ý trên bảng chính.
Giáo viên kết hợp dữ liệu ứng dụng, quan sát thực tế và nhận xét của bạn đồng hành để nhận xét cuối cùng.

CÁCH GHI NHẬN
- Tiêu chí covered/partial đã lưu được đối chiếu với chính transcript. Một từ khóa đứng riêng không đủ.
- Một ý trong nhóm cũng được ghi nhận ở mức thực hành: ví dụ cụ thể Q2 không bắt buộc kèm đầy đủ hành động; kỹ năng bản thân Q3 không bắt buộc kèm đủ liên hệ vị trí.
- Nội dung một phần có minh chứng vẫn có thể đạt yêu cầu bước đầu; nhãn này không chứng nhận toàn bộ câu trả lời chính xác về ngữ pháp hoặc phát âm.
- Tiêu chí không có minh chứng, minh chứng không nằm trong transcript, tiêu chí trùng mâu thuẫn hoặc source unavailable không tự tạo kết quả Đạt.
- Không tự sửa/phục hồi lời nói chưa được ghi nhận; không chèn đáp án mẫu.
- Bằng chứng từ Backup được đối chiếu cùng quy tắc; nguồn phân tích vẫn được giữ trong Chi tiết/Xem nguồn.
- Khung đầy đủ 5/5/4 và góp ý ngôn ngữ vẫn giữ trong Chi tiết để luyện dài hạn. Ngưỡng 50% của bản trước không dùng để kết luận yêu cầu thực hành buổi này.
- Bảng chính giữ sáu cột. Mỗi em có điểm đã làm được theo Q1-Q3 và một hướng tiếp tục luyện tập.
- Không gọi thêm Gemini khi tổng hợp; không thay kết quả Supabase/local, schema, package hoặc luồng phỏng vấn.

FILE HOÀN CHỈNH CẦN THAY
components/classroom/TeacherClassroomDashboard.tsx
components/classroom/TeacherLessonSynthesis.tsx
services/lessonAttainment.ts
services/lessonPresentation.ts
README và VALIDATION đặt ở gốc dự án để lưu hướng dẫn.

CÀI PATCH TRÊN WINDOWS
1. Dừng app bằng Ctrl+C trong cửa sổ đang chạy.
2. Sao chép toàn bộ thư mục english-ai-mobile-fix-01 sang một thư mục sao lưu, ví dụ english-ai-backup-43-3-12. Giữ nguyên .env.local và dữ liệu trình duyệt.
3. Giải nén PATCH vào thư mục tạm. Chép components và services vào C:\AI_Project\english-ai-mobile-fix-01, chọn Replace. Chép tài liệu vào gốc nếu muốn lưu.
4. Mở CMD tại gốc có package.json, chạy:
cd /d C:\AI_Project\english-ai-mobile-fix-01
npx tsc --noEmit
npm run build
npm run start
PATCH không cần npm ci vì package/lock không đổi.
5. Mở http://localhost:3000/teacher/classroom, Ctrl+F5. Phải thấy FIX 43.3.13.

DÙNG FULL
Giải nén FULL vào thư mục mới, sao chép .env.local từ bản đang chạy. Tại thư mục có package.json chạy npm ci rồi ba lệnh kiểm tra/chạy bên trên. Không xóa bản cũ.

KIỂM THỬ
- Mở lại phiên có kết quả đã lưu và bấm TỔNG HỢP KẾT QUẢ: không cần phỏng vấn lại để thử tiêu chí mới, không gọi lại AI.
- Một ý ngành học Q1 có minh chứng, một ý điểm mạnh Q2 hoặc một ý kỹ năng Q3 có minh chứng phải được ghi Đạt yêu cầu thực hành.
- Nhiều ý hơn vẫn cùng nhãn, không có tốt/rất tốt hoặc xếp hạng.
- Thiếu minh chứng: Đã ghi nhận câu trả lời. Không có transcript: Chưa có bản ghi.
- Bảng Candidate status và bảng tổng hợp phải cùng nhãn.
- Xem chi tiết: nhãn thực hành và minh chứng của nhãn nằm phía trên. Khung đầy đủ 5/5/4 là tham khảo luyện tiếp, không dùng ngưỡng 50% để phủ định nhãn thực hành.
- Điểm đã làm được có nguồn bằng chứng; Hướng luyện tiếp có một việc cụ thể. Giáo viên không cần nhập nhận xét hoặc chấm lại trên app.
- Thử phiên mã mới với hai nhóm, mỗi máy hai em đổi vai; Q1→Q2→Q3→Closing; kiểm tra 4/4 và Synced.
- Thử một transcript ngắn chỉ có từ khóa hoặc không liên quan: không được tự ghi Đạt.

GIỚI HẠN VÀ PHẠM VI
Việc đổi mục tiêu thực hành chưa giải quyết lỗi nhận dạng giọng nói hoặc AI bỏ sót/diễn giải minh chứng. Trường hợp bạn IELTS 8.5 vẫn cần transcript và tiêu chí gốc để xác định nguyên nhân riêng.
Không thêm nút xóa toàn bộ Session/đặt lại lượt trong bản này. Tạo mã phiên mới cho từng đợt luyện.
Bản ZIP chưa được push hoặc triển khai Vercel. Chỉ hướng dẫn cập nhật Internet sau khi npx tsc --noEmit và npm run build trên máy thầy đều PASS.

QUAY LẠI 43.3.12
Dừng app, khôi phục thư mục sao lưu 43.3.12 rồi build/start lại. Không xóa localStorage hoặc dữ liệu Supabase. Bản 43.3.13 chỉ tính lại cách tổng hợp từ kết quả đã lưu, không ghi đè chúng.

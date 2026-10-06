FIX 43.3.2 — English AI Interview Coach

CÀI PATCH (khuyến nghị)
1. Sao lưu C:\AI_Project\english-ai-mobile-fix-01 trước khi thay.
2. Giải nén PATCH ZIP vào chính thư mục trên, chấp nhận ghi đè.
3. PATCH có 4 file:
   components/classroom/TeacherClassroomDashboard.tsx (thay)
   components/classroom/TeacherLessonSynthesis.tsx (mới)
   services/teacherLessonSynthesis.ts (mới)
   README-FIX-43.3.2.txt (mới)
Không đổi package/package-lock, schema, interview flow hoặc đồng bộ results.
Không cần chạy SQL mới. Giữ nguyên .env.local hiện tại.

FULL ZIP
Giải nén vào thư mục mới nếu cần cài toàn bộ source. ZIP không chứa node_modules,
.next, .git hoặc .env.local thật. Sao chép .env.local từ dự án đang hoạt động
vào thư mục mới trước khi chạy. Không đưa file chứa API key lên GitHub.

KIỂM TRA TRÊN MÁY THẦY (PowerShell)
cd C:\AI_Project\english-ai-mobile-fix-01
npm ci
npx tsc --noEmit
npm run build
Chỉ sau khi cả TypeScript và build trên máy thầy PASS mới tiến hành bước
GitHub/Vercel. Bản này không hướng dẫn triển khai trước khi nhận kết quả đó.
Nếu muốn kiểm tra production trên máy trước: npm run start
Mở http://localhost:3000/teacher/classroom. Đây chỉ là kiểm tra trước release.
Ngày hội giảng dùng URL Vercel hiện hành trên tất cả máy, không npm run dev.

KIỂM THỬ CHẤP NHẬN
1. Mở /teacher/classroom, nhập PIN hiện hành và tạo session mới 4 ứng viên.
2. Dùng link cùng session trên 2 máy; mỗi máy 2 sinh viên lần lượt đổi vai.
3. Xác nhận Q1 -> Q2 -> Q3 -> Professional Closing và local save/cloud sync
   vẫn hoạt động. Kiểm tra Dashboard nhận đủ 4/4, không xếp hạng.
4. Bấm TỔNG HỢP KẾT QUẢ: đủ 4 mục tiêu, overview, Q1/Q2/Q3, strengths,
   improvement, next practice, class priorities và teacher final judgment.
5. Mở View Details mỗi sinh viên: đối chiếu 3 điểm/criteria/transcript với JSON
   đã lưu; mode Live AI / Mixed AI + Backup / Backup Rubric hiện đúng.
6. Kết quả thiếu criteria: Insufficient evidence/No data, không thay bằng 0.
   Mode unavailable: không dùng các điểm/criteria đó để tính mức độ đạt.
7. DevTools > Network: bấm Tổng hợp không phát sinh request Gemini/evaluate.
   Poll GET /api/class-results/session mỗi 2.5 giây vẫn là hành vi hiện tại.
8. Nhập Teacher Final Judgment, Save, tải lại và bấm tổng hợp: chữ được khôi phục
   trên cùng browser/máy; session mới không dùng kết luận session cũ.
9. Sau release, lặp lại kiểm thử bằng URL Vercel trên 2 máy sinh viên và máy GV.

QUY TẮC PHÂN TÍCH
- Không gọi AI bổ sung; pure deterministic từ results API đã lấy ở Supabase.
- Coverage/structure/evidence theo thang 0–100. Mức độ đạt Q lấy tiêu chí thấp
  nhất trong 3 tiêu chí; thiếu một tiêu chí -> Insufficient evidence.
  >=70 meets practice target, 50–69 developing, <50 needs focused practice.
  Đây là ngưỡng tham khảo công khai, không phải quyết định đánh giá cuối cùng.
- Chỉ tính dữ liệu hợp lệ; công khai số answers có dữ liệu. Không suy ra điểm
  của câu thiếu, không suy ra teamwork/AI revision từ completion hoặc mode.
- JSON hiện tại không có criterion-level quotations/full grammar analysis.
  Giữ mapping hiện tại, không tạo chứng cứ giả. Transcript được xem riêng.
- Lọc bỏ cả nhận xét chứa behavioral/audio/confidence claims; bộ lọc bảo thủ
  có thể loại cả một câu có ý hữu ích. GV cần xem transcript/peer notes.
- Không hiển thị confidence/pronunciation/fluency từ score_breakdown như
  kết luận. Eye contact/posture và hành vi trực tiếp thuộc quan sát con người.
- Teacher Judgment do GV viết, lưu localStorage theo session id, không Supabase.
  Nút Tổng hợp dùng bản results mới nhất đã poll; dữ liệu vẫn cập nhật khi poll.

KIỂM CHỨNG MÔI TRƯỜNG BÀN GIAO
Xem VALIDATION-FIX-43.3.2.txt trong FULL ZIP. Không tuyên bố kiểm thử thực tế
Supabase/Gemini/Vercel hoặc browser hoàn chỉnh khi chưa thực hiện.

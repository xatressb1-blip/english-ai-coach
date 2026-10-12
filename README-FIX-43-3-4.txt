FIX 43.3.4 — EVALUATION FORM (AI) + Emma default

Nguon: ZIP english-ai-mobile-fix-01(20261012-164822).zip, FIX 43.3.3.

CAI DAT PATCH (khuyen nghi)
1. Dung server cu: Ctrl+C trong CMD. Sao luu thu muc du an.
2. Giai nen PATCH truc tiep vao C:\AI_Project\english-ai-mobile-fix-01
   (thu muc co package.json), chon Replace cho cac file trung ten.
3. Chay:
   cd /d C:\AI_Project\english-ai-mobile-fix-01
   npx tsc --noEmit
   npm run build
   npm run start
4. Mo http://localhost:3000/teacher/classroom
   Dang nhap PIN trong .env.local cua may cuc bo.
Khong can npm ci khi dung PATCH vi package va lockfile khong thay.
FULL ZIP: source day du, khong kem .env.local, node_modules, .next, .git.
Neu dung thu muc FULL moi: giu .env.local cua thay va chay npm ci truoc.

7 FILE CODE TRONG PATCH
components/classroom/TeacherClassroomDashboard.tsx
components/classroom/TeacherLessonSynthesis.tsx
components/interview/VirtualInterviewLobby.tsx
components/interview/InterviewEngine.tsx
services/classroomResultUtils.ts
services/teacherEvaluationForm.ts (moi)
types/classroomResults.ts

THAY DOI
- Nut TONG HOP KET QUA hien EVALUATION FORM (AI), 1 dong/sinh vien.
- Grammar, Vocabulary: mot nhan xet uu tien va so cau co danh gia doc lap.
- Relevance & Structure: muc thuc hanh Q1/Q2/Q3, khong xep hang SV.
- Strengths va Priority Improvement: 1 nhan xet ngan co nhan Q.
- Xem chi tiet: Q1-Q3, nhan xet ngon ngu, minh chung, transcript.
- Muc tieu bai hoc thu gon; Teacher Final Judgment van luu tren trinh duyet,
  giu khoa cu de khong mat ket luan da luu tren cung trinh duyet.
- Emma chon san o Lobby. Van cho phep chon recruiter khac.
- Them grammar/vocabulary/criteria vao JSON q1/q2/q3 hien co.
- Khong doi schema SQL, package, API routes, prompt hay rubric 6/7/8.
- Nut tong hop KHONG goi Gemini. Nhan xet la du lieu danh gia da co.
- Luong Q1 -> Q2 -> Q3 -> Professional Closing va doi vai giu nguyen;
  InterviewEngine chi thay prop preselected recruiter.

DU LIEU CU
- Phien cu khong co Grammar/Vocabulary chi tiet: ghi chua co danh gia.
- Backup khong dung diem ngon ngu quy doi lam bang chung doc lap.
- Phien moi tren ban nay se luu nhan xet live AI va criteria vao Supabase.
- Khong tu cham lai hay cap nhat cac phien cu. Neu ca 3 cau cung diem hoac
  khac nguon/missing criteria, khong tu chon cau noi bat/yeu nhat.
- Muc thuc hanh giu quy tac min Coverage/Structure/Evidence (>=70,50-69,<50).
- Khong phan tich giong noi/eye contact/posture tu transcript.

KIEM THU CUC BO
A. Mo BUO1 bang MO PHIEN DA LUU. Tong hop 4 sinh vien; du lieu cu doc duoc.
B. Bam Xem chi tiet tung em: Q1-Q3, transcript, nguon; dong/mo khong mat ket qua.
C. Tao phien MOI voi 4 ten khac nhau; 2 SV/may, 2 nhom doi vai.
   Khi thu cuc bo tren 1 may, dung link localhost:3000/interview?session=MA_PHIEN.
   Khong dung link Vercel cu de thu ban moi chua deploy.
   Neu thu 2 may sinh vien qua LAN, micro tren HTTP IP co the bi browser chan;
   can moi truong HTTPS da duoc kiem thu, khong tu coi la loi rubric.
D. Xac nhan Lobby chon Emma san, co nut Enter Interview Room; recruiter khac van chon duoc.
E. Hoan thanh Q1-Q3/Closing, doi vai, cloud Synced; dashboard du 4/4.
F. Live AI: xem nhan xet grammar/vocabulary theo Q va minh chung da luu.
   Backup: hien ro thieu danh gia ngon ngu doc lap.
G. Trong DevTools Network, bam Tong hop: khong co /api/evaluate/AI request moi.
H. Luu ket luan, tai lai trang/phien tren cung trinh duyet, ket luan van con.

GIOI HAN VA BUOC SAU
Chua them luyen lai rieng Q2 hay bang so sanh lan 1/lan 2 trong ban nay.
Chua chay live browser/micro/Gemini/Supabase end-to-end trong moi truong tao ZIP.
Chi huong dan GitHub/Vercel sau khi tsc/build tren may thay PASS.

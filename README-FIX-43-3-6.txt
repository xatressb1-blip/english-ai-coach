FIX 43.3.6 — Dashboard 4 sinh vien x Q1-Q3
Nguon chuan: FIX43.3.5 da xac nhan khong thay doi.

CAI DAT PATCH TREN 43.3.5
1. Dung server cu Ctrl+C, sao luu du an.
2. Giai nen PATCH vao C:\AI_Project\english-ai-mobile-fix-01
   (noi co package.json), chon Replace cho 2 components; service moi duoc them.
3. Chay:
   cd /d C:\AI_Project\english-ai-mobile-fix-01
   npx tsc --noEmit
   npm run build
   npm run start
4. Mo http://localhost:3000/teacher/classroom. Dang nhap, mo phien da luu.
5. Bam TONG HOP KET QUA.
Khong can npm ci cho PATCH. FULL neu giai nen sang thu muc moi can .env.local
cua thay va npm ci. FULL khong kem secrets/dependencies/build/git.

3 FILE CODE
components/classroom/TeacherClassroomDashboard.tsx
components/classroom/TeacherLessonSynthesis.tsx
services/lessonAnswerOverview.ts (moi)

THIET KE
- Bang chinh 4 cot: sinh vien / Q1 / Q2 / Q3. Giu thu tu, khong xep hang.
- Moi o: muc dap ung theo du lieu, so y da de cap + so y co minh chung ro,
  mot hanh dong luyen tiep.
- Khung bai hoc: Q1 5 y; Q2 5 phan; Q3 4 phan. Anh xa tu rubric cu 6/7/7.
- Q1 professional-growth la mo rong, khong tru vao khung 5 y.
- Q2 specific-example + action gom mot phan; evidence la chi tiet mo rong.
- Q3 relevant-skills + role-fit gom mot phan; contribution + growth-alignment
  gom mot phan. Co mot y trong phan khong co nghia da lam ro ca phan.
- Du lieu tieu chi da luu + cues transcript deterministic chi nhan dien de cap.
  Cues khong tu nang len 'co minh chung ro'.
- 'Co minh chung ro' can moi tieu chi con covered, co doan trich nguyen van;
  Q1 muc tieu/ dong gop chung chung van can lam ro. Day la chi bao thuc hanh,
  giao vien kiem chung, khong phai diem thi hay xac nhan su that.
- Xanh ngoc: du y, tat ca phan co minh chung ro theo quy tac tren.
  Ho phach: can bo sung/lam ro. Xam: du lieu chua du.
- Khong noi ca 4 em dung trong tam neu du lieu khong ho tro.
- Du lieu cu thieu criteria van doc; co the nhan dien 'de cap' tu transcript,
  nhung khong tu sinh nhan xet ngon ngu hay minh chung danh gia chuyen sau.
- Nhan xet chung khong mac dinh dua theo kich ban mau.
- Trang thai/ link sinh vien thu gon khi tong hop; co the mo lai.
- Xem chi tiet: 5/5/4 y, grammar/vocabulary, criteria goc, transcript.
- Teacher judgment va Lesson Objective thu gon de man hinh chinh ngan.
  Khoa localStorage cu giu nguyen, co the mo va luu ket luan nhu truoc.
- Mobile: bang co thanh cuon ngang. Desktop can kiem thu tren man hinh/may chieu
  thuc te; khong cam ket vua moi do phan giai hoac muc zoom.

KIEM THU
A. Mo phien cu 4/4, Tong hop: 4 dong sinh vien, 3 o moi dong; khong co ranking.
B. Xem chi tiet, mo Grammar/Vocabulary/transcript; giu dung ten va Q.
C. LONG Q1 mau co 5 y nhung muc tieu technician/dong gop chung chung:
   phai phan biet 5/5 de cap voi so y lam ro; khong tu ket luan tat ca tot.
D. Du lieu missing/unavailable: xam, khong tinh diem 0 cho thieu du lieu.
E. Q2 gom vi du + hanh dong, Q3 gom ky nang/phu hop va dong gop/phat trien;
   dem so phan de cap, khong dem trung.
F. Mo Teacher Final Judgment, luu, tai lai cung trinh duyet va phien: con noi dung.
G. Thu phien moi 2 nhom x 2 SV: Emma -> Q1-Q3 -> Closing -> doi vai -> Synced4/4.
H. Network: Tong hop khong goi /api/evaluate hoac Gemini them.

GIOI HAN
Khong doi rubric diem 6/7/8, engine evaluation hay JSON da luu. Bang la anh xa
khung bai hoc, khong cham lai phien cu. Nhan dien bang quy tac co the bo sot
cach dien dat tuong duong; giao vien doi chieu transcript/loi noi thuc te.
Chua them luyen lai Q2 va so sanh 2 lan.
Chua sua nguyen nhan AI fallback hoac loi nhan dien giong noi.
UI browser test chua chay: moi truong thieu Chromium; production server
cung gap loi he thong networkInterfaces. Build/TypeScript PASS.
Chua kiem thu Gemini/micro/Supabase that trong moi truong tao ZIP.
Chi cap nhat GitHub/Vercel sau khi tsc va build tren may thay PASS.

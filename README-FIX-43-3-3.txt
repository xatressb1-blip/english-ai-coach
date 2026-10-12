FIX 43.3.3 — Teacher Dashboard clarity + reopen saved session

CAI DAT PATCH (khuyen nghi):
1. Sao luu thu muc C:\AI_Project\english-ai-mobile-fix-01.
2. Giai nen PATCH vao thu muc tren, noi co package.json. Chon Replace khi duoc hoi.
3. Ba file code duoc thay:
   components/classroom/TeacherClassroomDashboard.tsx
   components/classroom/TeacherLessonSynthesis.tsx
   services/teacherLessonSynthesis.ts
4. Khong thay .env.local, package/package-lock, schema Supabase, interview flow.
5. Chay trong CMD:
   cd /d C:\AI_Project\english-ai-mobile-fix-01
   npx tsc --noEmit
   npm run build
   npm run start
6. Mo http://localhost:3000/teacher/classroom de kiem thu truoc release.

FULL ZIP: source day du; khong kem .env.local, node_modules, .next hay .git.
Neu dung FULL trong thu muc moi, giu .env.local cua thay va chay npm ci truoc.

KIEM THU:
- Dang nhap bang Teacher PIN. Nhap ma phien cu (BUO1 theo anh) vao
  Mo lai phien da luu va bam MO PHIEN DA LUU.
- Phien 4/4 phai hien 4 sinh vien, transcript va evaluation mode da luu.
- Ma khong ton tai/PIN sai: hien loi, khong tao phien, khong xoa ket qua.
- Phien closed van mo xem duoc; khong tu mo lai status, khong bat polling.
- Bam TONG HOP KET QUA: so hoan thanh tach khoi so dat tieu chi.
- Strengths khong hien Needs improvement; Backup/Mixed khong hien diem
  Grammar/Vocabulary tong hop nhu bang chung danh gia doc lap.
- Thu 1 phien moi: Q1 -> Q2 -> Q3 -> Professional Closing, doi vai,
  luu local va dong bo Supabase nhu truoc.
- Network: nut tong hop khong goi /api/evaluate hoac Gemini.
- Teacher judgment van luu rieng tren trinh duyet theo session ID.

GIOI HAN:
- Khong thay rubric 6/7/8, khong cham lai du lieu cu.
- Khong thay prompt Gemini/phan tich am thanh trong ban nay.
- Nhan xet ngu phap chi tiet chua duoc luu trong cloud result hien tai.
- Rule dat tieu chi (min Coverage/Structure/Evidence) giu nguyen, co giai thich.
- Chua kiem thu trinh duyet/Supabase that trong moi truong tao ZIP.
- Chi huong dan GitHub/Vercel sau khi thay xac nhan tsc va build ban moi PASS.

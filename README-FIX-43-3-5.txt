FIX 43.3.5 — Evidence-based coaching clarity
Ap dung tren FIX 43.3.4. Dung server cu Ctrl+C, sao luu du an, giai nen PATCH
vao C:\AI_Project\english-ai-mobile-fix-01 (noi co package.json), chon Replace.

LENH CHAY
cd /d C:\AI_Project\english-ai-mobile-fix-01
npx tsc --noEmit
npm run build
npm run start
Mo http://localhost:3000/teacher/classroom
Khong can npm ci cho PATCH. FULL moi can npm ci va .env.local rieng cua thay.

THAY DOI
- Backup luu doan trich thuc tu transcript thay cho minh chung chung.
- Tieu chi covered khong tu lap mo ta yeu cau nhu mot loi can sua.
- Bang chinh noi ro so y da nhan dien va y can xem lai; khong ket luan
  ca cau yeu chi vi min indicator thap.
- Strengths co trich dan neu co; neu khong ghi ro can co xac minh.
- Next Practice theo uu tien trong ket qua Live AI; Backup theo y thieu/mot phan.
- Structure ghi ro uoc luong tu so cau, khong coi la bang chung dung trinh tu.
- Transcript goc giu nguyen; nhac co doi chieu loi noi thuc te truoc khi
  quy thanh loi ngon ngu.
- Them evaluationNotice vao JSON hien co cho ket qua moi: ly do Backup duoc
  phan loai ngan, khong luu nguyen van thong bao loi nhay cam.

FILE CODE
components/classroom/TeacherClassroomDashboard.tsx
components/classroom/TeacherLessonSynthesis.tsx
services/backupRubricEvaluation.ts
services/classroomResultUtils.ts
services/focusAnalyzer.ts
services/teacherEvaluationForm.ts
types/classroomResults.ts
services/teacherCoaching.ts

KIEM THU
1. Mo phien cu A1/A2, bam Tong hop. Relevance & Structure hien so y da ghi nhan.
2. Mo chi tiet Q2 A2: minh chung chung cu khong hien nhu mot trich dan;
   tieu chi covered khong co goi y lap lai yeu cau.
3. Next Practice phai bam uu tien; Backup Q2 thieu vi du -> bo sung tinh huong,
   hanh dong va ket qua.
4. Tao phien moi, noi cau day du; kiem tra transcript co khop loi noi thuc te.
5. Minh chung Backup moi phai la doan trong transcript; khong tu sinh cau.
6. Kiem tra Q1-Q3 -> Closing -> doi vai -> local save -> Supabase Synced 4/4.
7. Nut Tong hop khong goi them Gemini. Live/Backup/mixed hien ro.
8. Neu Backup tiep tuc, gui thong bao CMD/Network cua /api/evaluate;
   khong gui .env.local, PIN, API key. Ban nay chua sua nguyen nhan ket noi AI.

GIOI HAN
Khong tu sua transcript, khong cham lai phien cu; rubric Backup van la
nhan dien theo quy tac, co the bo sot/nhan sai y. Co kiem chung ket qua.
Khong doi package, SQL schema, flow, Emma default. Khong them luyen lai Q2.
Chua kiem thu browser/micro/Gemini/Supabase that trong moi truong tao ZIP.
GitHub/Vercel chi cap nhat sau khi kiem thu may thay PASS.

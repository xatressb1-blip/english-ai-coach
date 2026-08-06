FIX 38.2.1 - QUOTA-AWARE PRESENTATION SAFETY
=============================================

Muc tieu
--------
- Khong hien JSON/URL/stack trace cua Gemini tren man chieu.
- Phan biet loi 503, 429 rate limit, 429 daily quota, timeout va mat mang.
- Khong tu retry khi quota ngay da het.
- Luon giu transcript va cho phep Continue with Teacher Review.
- Khong tinh cau thieu AI thanh 0 trong Teacher Summary.
- Ho tro model fallback co kiem soat cho loi 503 neu duoc cau hinh.

File moi
--------
services/aiError.ts
README-FIX-38-2-1.txt

File sua
--------
app/api/evaluate/route.ts
components/interview/MockInterviewEvaluation.tsx
context/EvaluationContext.tsx
hooks/useEvaluation.ts
services/evaluationService.ts
services/geminiClient.ts

Cau hinh model
--------------
Fix khong ghi de .env.local.

GEMINI_MODEL la model chinh dang su dung.
GEMINI_FALLBACK_MODEL la model du phong tuy chon, chi duoc goi khi model chinh tra 503.

Vi du:
GEMINI_API_KEY=...
GEMINI_MODEL=models/<stable-fast-model>
GEMINI_FALLBACK_MODEL=models/<stable-fallback-model>

Khong dat hai model neu chua kiem thu bang trang /evaluation-test.
Khong dua .env.local len GitHub.

Hanh vi loi
-----------
503 / high demand:
- Server co the thu model fallback neu da cau hinh.
- Client chi retry toi da mot lan.
- Sau do cho phep Teacher Review.

429 rate limit tam thoi:
- Hien thong bao ngan gon.
- Retry chi khi API danh dau retryable.
- Khong de nguoi dung bam lien tuc.

429 daily quota / free tier requests:
- Dung retry ngay.
- An nut Try AI Evaluation Again.
- Chi hien Continue with Teacher Review.
- Khong hien JSON ky thuat.

Timeout / mat mang:
- Giu transcript.
- Cho retry mot lan hoac Teacher Review.

Kiem tra
--------
cd C:\AI_Project\english-ai-mobile-fix-01
npx tsc --noEmit
npm run build

Chi commit khi ca hai lenh thanh cong.

Kiem thu 1 - Hoat dong binh thuong
----------------------------------
1. Hoan thanh ghi am.
2. Bam Submit Answer.
3. AI tra ket qua va chuyen cau binh thuong.

Kiem thu 2 - Het quota ngay
---------------------------
1. Dung project/key dang het quota hoac cho den khi API tra 429 daily quota.
2. Giao dien chi hien thong bao than thien.
3. Khong duoc hien JSON, URL quota hay stack trace.
4. Khong co nut Try AI Evaluation Again.
5. Bam Continue with Teacher Review.
6. Hoan thanh interview va mo Teacher Summary.
7. Cau do phai hien Unavailable/Teacher review, khong bi tinh 0.

Kiem thu 3 - Loi 503
--------------------
1. Neu GEMINI_FALLBACK_MODEL da cau hinh, kiem tra server thu model fallback mot lan.
2. Neu van that bai, UI hien thong bao ngan gon va van cho Teacher Review.

Kiem thu 4 - Mat mang
---------------------
1. Ghi am xong, tat mang va bam Submit.
2. Transcript van con.
3. UI co Try AI Evaluation Again va Continue with Teacher Review.

Luu y hoi giang
---------------
- Nen dung project Paid Tier.
- Kiem tra API mot lan truoc gio thi, khong thu qua nhieu lan.
- Chuan bi hotspot va mot bao cao AI mau da luu.
- AI la nguon tham khao; observer va teacher assessment van la phuong an chinh khi API loi.

FIX 41.1 - AUTO LAN + LOCAL QR + CLASSROOM SESSION RELIABILITY
===============================================================

Purpose
-------
1. Do not require the teacher to replace localhost manually in the observer URL.
2. Re-detect the laptop private IPv4 address when the app is started at another venue/network.
3. Generate the classroom QR code locally with no external QR website and no Internet dependency.
4. Prevent LAN development-mode hydration problems from making the Create Classroom Session button appear clickable but do nothing.
5. Add clearer classroom API readiness/error feedback.
6. Provide a production launcher for the teaching demonstration.

Changed / new files
-------------------
- components/classroom/ClassroomRapidInterview.tsx
- components/classroom/LocalQrCode.tsx
- services/localQrCode.ts
- app/api/network-info/route.ts
- app/api/classroom-session/route.ts
- next.config.ts
- START-CLASSROOM-PRODUCTION.bat
- README-FIX-41-1.txt

Why Create Classroom Session could fail when using a LAN IP in npm run dev
-------------------------------------------------------------------------
Next.js development mode protects dev-only assets/endpoints from unapproved cross-origin LAN hosts.
The page can appear on screen while React hydration/HMR is blocked, which can make client-side buttons appear normal but not execute their onClick handler.

Fix 41.1 allows trusted private LAN ranges in development mode:
- 10.x.x.x
- 192.168.x.x
- 172.16.x.x through 172.31.x.x

For the actual teaching demonstration, production mode is still strongly recommended because it has no dev HMR/origin dependency.

Recommended day-of-demonstration startup
----------------------------------------
A. Build ONCE before the demonstration:

  cd C:\AI_Project\english-ai-mobile-fix-01
  npx tsc --noEmit
  npm run build

B. On demonstration day, double-click:

  START-CLASSROOM-PRODUCTION.bat

The launcher runs:

  npm run start -- --hostname 0.0.0.0

and opens:

  http://localhost:3000/classroom

Fix 41.1 then detects the current private LAN IPv4 and creates the observer URL/QR automatically.

Venue / IP changes
------------------
Changing venue is expected and supported. For example:

Home Wi-Fi:
  192.168.1.6

Competition Wi-Fi:
  192.168.0.24

Windows Mobile Hotspot:
  often 192.168.137.1

The app discovers the current private IPv4 every time it starts. No code/config edit should be required.
If multiple private adapters are active (Wi-Fi, Ethernet, VPN, hotspot), the waiting screen shows a network-address selector. Choose the address reachable by the student phones.

Recommended network for reliability
-----------------------------------
Prefer a network you control rather than relying on venue Wi-Fi client-to-client access.
A strong setup is:
- Teacher laptop connected to Internet.
- Enable Windows Mobile Hotspot on the teacher laptop.
- Connect the observer phones to that hotspot.
- Keep Gemini Internet access through the laptop's shared connection.

Always test the exact hotspot/router beforehand. Some venue Wi-Fi networks enable AP/client isolation and prevent phones from reaching the laptop even though all devices show the same Wi-Fi name.

Local QR
--------
The QR code is now generated completely inside the app.
No call to api.qrserver.com is made.
Therefore QR generation works even when the Internet is temporarily unavailable.
Internet is still needed for Live AI/Gemini; Backup Rubric and classroom LAN features remain available without Live AI.

Quick test
----------
1. Start app in production mode or dev mode with --hostname 0.0.0.0.
2. Open /classroom.
3. Confirm the setup screen shows "Classroom session service ready".
4. Enter four names and click Create Classroom Session.
5. Confirm session code and QR appear.
6. Confirm the displayed Phone join URL contains a private IPv4, not localhost.
7. Scan QR with one phone camera/Google Lens.
8. Confirm phone opens /classroom-observer?session=XXXXXX.
9. Join as a student and confirm teacher screen changes from Waiting to Connected.
10. Repeat with remaining phones.

If Create Classroom Session does not work
-----------------------------------------
- Use START-CLASSROOM-PRODUCTION.bat instead of npm run dev.
- Confirm "Classroom session service ready" on the setup screen.
- Keep the server Command Prompt window open.
- Check Windows Defender Firewall and allow Node.js on Private networks.
- If using venue Wi-Fi, test whether client isolation blocks device-to-device traffic.

Validation performed when packaging
------------------------------------
- npx tsc --noEmit: PASS in packaging source tree.
- Local QR algorithm decoded successfully against the generated classroom observer URL in an automated QR decoder test.
- Full next build must still be validated on the user's Windows machine because the packaging environment does not contain the matching Windows SWC runtime.

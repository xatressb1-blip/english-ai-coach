FIX 30 - COMPANY AND JOB SELECTION
==================================

Purpose
-------
Make Mock Interview feel closer to a real corporate recruitment session by adding a simulated employer and job application context.

Changes
-------
1. Adds three simulated companies and six fresh-graduate positions.
2. Adds a mobile-first Company & Position setup screen after level selection.
3. Keeps Guided Practice unchanged.
4. Shows the selected company and position in the recruiter lobby, Ready screen, and live interview room.
5. Sends company, position, department, industry, and recruiter context to the Final Recruiter Report.
6. Saves company and position metadata in History while remaining compatible with older reports.
7. Keeps all 10 approved questions unchanged.

Main test
---------
- Select a company and a position.
- Continue to recruiter selection.
- Confirm the same company and position appear in the lobby, Ready screen, live interview, final report, and History.
- Test at 360-430px width for no horizontal overflow.

FIX 38 - TEACHER PROJECTION SUMMARY & THREE-OBSERVER RUBRICS
=============================================================

Purpose
-------
This fix supports a 45-minute teaching demonstration with four students:
- 1 student is the candidate.
- 3 students are observers.
- Each observer has a different rubric.
- After the candidate completes three questions, the teacher opens one concise projection summary to compare human observations with AI evidence.

New button
----------
The Final Recruiter Report now contains:
Teacher Summary · Trình chiếu & đối chiếu

The button is shown only when at least three interview attempts are available.

Observer scoring scale
----------------------
2 = Achieved
1 = Partly achieved
0 = Not yet achieved
Each observer has 5 criteria, maximum 10 points.

Observer 1 - Content & Structure
1. Answers the three questions directly and stays on topic.
2. Q1 includes background, education/major, career goal, contribution.
3. Q2 includes strength, reason, example/action/result.
4. Q3 includes company research, role fit, contribution, growth.
5. Ideas are logically organized, concise, and easy to follow.

Observer 2 - English Language
1. Understandable and mostly accurate grammar.
2. Suitable professional/job-interview vocabulary.
3. Appropriate linking words.
4. Fluent delivery with limited fillers/repetition.
5. Understandable pronunciation and spoken clarity.

Observer 3 - Professional Performance
1. Appropriate posture and eye contact.
2. Audible voice and appropriate pace.
3. Confidence and calmness.
4. Polite, positive, professional attitude.
5. Careful listening and natural response without reading the whole answer.

AI projection evidence
----------------------
- Overall score and readiness
- Average coverage, evidence, relevance
- Question-by-question coverage, evidence, structure, and speech metrics
- AI strengths and priority improvements
- Explicit reminder that eye contact/posture must be judged by humans

Files
-----
New:
components/interview/TeacherProjectionSummary.tsx
README-FIX-38.txt

Modified:
components/interview/FinalRecruiterReport.tsx
services/evaluationService.ts (includes the already-approved Fix 37 hotfix)

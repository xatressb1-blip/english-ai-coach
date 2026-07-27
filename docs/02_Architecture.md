# ============================================================
# English AI Coach
# ------------------------------------------------------------
# Software Architecture
# ============================================================

Version:
1.0

Status:
Development

Last Updated:
2026-07-26

Technical Leader:
ChatGPT

---

# 1. Architecture Overview

English AI Coach follows a layered architecture.

The system separates User Interface, Business Logic,
Services and Artificial Intelligence into independent modules.

This architecture keeps the project easy to maintain,
easy to test and easy to expand.

The architecture follows these principles.

• Single Responsibility Principle

• Separation of Concerns

• Low Coupling

• High Cohesion

• Module Freeze Policy

---

# 2. High-Level Architecture

                    User

                      │

                      ▼

               React Components

                      │

                      ▼

             React Context Layer

                      │

                      ▼

           Business Logic Layer

                      │

                      ▼

             Service Layer

                      │

                      ▼

          Google Gemini Platform

                      │

                      ▼

             Evaluation Result

                      │

                      ▼

               React Components

---

# 3. Application Layers

The application is divided into five layers.

Layer 1

Presentation Layer

Responsible for

• UI

• Buttons

• Cards

• Pages

• User Interaction

---

Layer 2

State Management Layer

Responsible for

• React Context

• Shared State

• Flow State

• Recording Status

---

Layer 3

Business Logic Layer

Responsible for

• Interview Flow

• Recording Control

• Navigation

• AI Trigger

---

Layer 4

Service Layer

Responsible for

• Speech Recognition

• Speech Queue

• Gemini Client

• Evaluation Service

---

Layer 5

Artificial Intelligence

Responsible for

• Interview Evaluation

• Grammar Analysis

• Vocabulary Analysis

• Suggestions

• Improved Answer

---

End of Part 1
# ============================================================
# 4. Project Folder Structure
# ============================================================

English AI Coach uses a feature-oriented folder structure.

Each folder has a single responsibility.

```
english-ai
│
├── app/
├── components/
├── context/
├── services/
├── types/
├── prompts/
├── data/
├── docs/
├── public/
├── package.json
└── tsconfig.json
```

---

# 5. Folder Responsibilities

## app/

Responsible for

• Next.js Pages

• API Routes

• Routing

Example

```
app/

home/

interview/

lesson/

api/

evaluate/
```

This folder NEVER contains business logic.

Business logic must be implemented inside Services.

---

## components/

Responsible for

Reusable UI Components.

Examples

```
Navbar

Hero

QuestionCard

LessonCard

SpeechRecorder

AIInterviewer

EvaluationPanel
```

Rules

Components

✔ Display data

✔ Receive user interaction

Components

❌ Must NOT call Gemini directly

❌ Must NOT control SpeechRecognition

❌ Must NOT contain business logic

---

## context/

Responsible for

Shared React State.

Examples

```
InterviewContext

SpeechContext
```

Rules

Context

✔ Store State

✔ Share State

Context

❌ Never implement business logic

❌ Never communicate directly with Gemini

❌ Never communicate directly with Browser APIs

---

## services/

Responsible for

Business Logic.

Examples

```
SpeechRecognitionService

SpeechController

SpeechQueueService

EvaluationService

GeminiClient

InterviewFlowService
```

Rules

Services

✔ Can call Browser APIs

✔ Can call Gemini

✔ Can communicate with other Services

Services

❌ Never render UI

---

End of Part 2
# ============================================================
# 6. Application Data Flow
# ============================================================

The entire application follows a one-directional data flow.

Data always moves from the User Interface to the Business Layer,
then to the Service Layer, and finally returns to the User Interface.

This design prevents circular dependencies.

---

# 7. Interview Flow

The interview process follows the sequence below.

```

User

↓

Interview Page

↓

InterviewContext

↓

InterviewFlowService

↓

AIInterviewer

↓

Speech Queue

↓

SpeechController

↓

SpeechRecognitionService

↓

Browser Speech API

↓

Transcript

↓

EvaluationService

↓

GeminiClient

↓

Google Gemini

↓

Evaluation Result

↓

Evaluation Panel

```

---

# 8. Speech Module Flow

The Speech Module is divided into four independent layers.

```

SpeechRecorder

↓

SpeechController

↓

SpeechRecognitionManager

↓

SpeechRecognitionService

↓

Browser Speech API

```

Responsibilities

SpeechRecorder

• UI only

SpeechController

• Business Logic

SpeechRecognitionManager

• Recognition Instance Management

SpeechRecognitionService

• Browser API Wrapper

---

# 9. AI Evaluation Flow

The evaluation process follows the sequence below.

```

Transcript

↓

EvaluationService

↓

GeminiClient

↓

Google Gemini

↓

JSON Result

↓

EvaluationResult

↓

Evaluation Panel

```

Rules

EvaluationService

✔ Builds evaluation request

✔ Validates AI response

✔ Converts AI response into EvaluationResult

GeminiClient

✔ Only communicates with Google Gemini

✔ Never contains UI logic

---

# 10. React Context Flow

InterviewContext

Responsible for

• Current Question

• Interview Flow

• Navigation

SpeechContext

Responsible for

• Transcript

• Recording Status

• Speech UI State

Rules

Contexts communicate with Components.

Contexts do NOT communicate directly with Gemini.

Contexts do NOT communicate directly with Browser APIs.

---

End of Part 3
# ============================================================
# 11. Module Dependency Rules
# ============================================================

To keep the architecture clean, every module must follow
strict dependency rules.

A lower layer must never depend on a higher layer.

------------------------------------------------------------

Allowed Dependencies

Component

↓

Context

↓

Business Logic

↓

Service

↓

External API

------------------------------------------------------------

Forbidden Dependencies

Service

×

Component

Context

×

Browser API

Component

×

Google Gemini

Component

×

SpeechRecognition API

------------------------------------------------------------

# 12. Component Responsibilities

Components are responsible only for rendering UI.

Examples

✓ Navbar

✓ Hero

✓ QuestionCard

✓ LessonCard

✓ SpeechRecorder

✓ AIInterviewer

✓ EvaluationPanel

Components MAY

• Receive Props

• Display Data

• Handle Click Events

Components MUST NOT

• Call Gemini

• Call Browser Speech API

• Implement Business Logic

------------------------------------------------------------

# 13. Context Responsibilities

Contexts are responsible for shared application state.

InterviewContext

Stores

• Current Question

• Current Flow

• Progress

SpeechContext

Stores

• Transcript

• Recording Status

• UI State

Contexts MAY

• Share State

• Update State

Contexts MUST NOT

• Execute Business Logic

• Call Gemini

• Call Browser APIs

------------------------------------------------------------

# 14. Business Logic Responsibilities

Business Logic controls application behaviour.

Examples

InterviewFlowService

SpeechController

EvaluationService

Business Logic MAY

• Coordinate Services

• Make Decisions

• Validate Workflow

Business Logic MUST NOT

• Render UI

------------------------------------------------------------

# 15. Service Responsibilities

Services communicate with external systems.

Examples

SpeechRecognitionService

SpeechQueueService

GeminiClient

Services MAY

• Use Browser APIs

• Use Google Gemini

• Parse JSON

• Handle Errors

Services MUST NOT

• Store React State

• Render Components

------------------------------------------------------------

End of Part 4
# ============================================================
# 16. Module Lifecycle
# ============================================================

Every module in English AI Coach follows the same lifecycle.

------------------------------------------------------------

Planning

↓

Architecture Review

↓

Implementation

↓

Build

↓

Testing

↓

Bug Fix

↓

Freeze

↓

Maintenance

------------------------------------------------------------

Each stage must be completed before moving to the next stage.

No module is allowed to skip a stage.

------------------------------------------------------------

# 17. Freeze Policy

A module can be marked as Frozen only when all of the following
conditions are satisfied.

✓ Architecture is approved.

✓ TypeScript Build passes.

✓ No ESLint errors.

✓ Manual testing completed.

✓ Integration testing completed.

✓ Technical Leader approves the module.

Only then can the module status become

FROZEN

------------------------------------------------------------

# 18. Frozen Module Rules

Frozen modules are considered stable.

Examples

SpeechRecognitionService

SpeechController

SpeechRecorder

GeminiClient

Frozen modules

MUST NOT

• Receive feature changes.

• Receive architecture changes.

• Receive unnecessary refactoring.

Frozen modules

MAY

• Receive critical bug fixes.

• Receive security fixes.

• Receive browser compatibility fixes.

------------------------------------------------------------

# 19. Change Request

If a Frozen module must be modified,
the following process is required.

Problem

↓

Technical Review

↓

Architecture Review

↓

Implementation

↓

Regression Testing

↓

Freeze Again

No Frozen module should be modified directly.

------------------------------------------------------------

# 20. Regression Testing

Whenever a core module changes,
all dependent modules must be tested again.

Example

SpeechRecognitionService changes

↓

SpeechController

↓

SpeechRecorder

↓

Interview Flow

↓

Evaluation

↓

Complete Test

------------------------------------------------------------

End of Part 5
# ============================================================
# 21. Module Communication Diagram
# ============================================================

The following diagram illustrates how every module communicates
inside English AI Coach.

Only downward communication is allowed.

------------------------------------------------------------

User

↓

React Components

↓

React Context

↓

Business Logic

↓

Service Layer

↓

Google Gemini

------------------------------------------------------------

# 22. Interview Module

Interview Page

↓

InterviewContext

↓

InterviewFlowService

↓

AIInterviewer

↓

Speech Queue

↓

SpeechController

↓

SpeechRecognitionManager

↓

SpeechRecognitionService

↓

Browser Speech API

------------------------------------------------------------

# 23. Speech Module

SpeechRecorder

↓

SpeechController

↓

SpeechRecognitionManager

↓

SpeechRecognitionService

↓

Browser Speech API

SpeechRecorder NEVER communicates directly
with Browser Speech API.

------------------------------------------------------------

# 24. Evaluation Module

EvaluationPanel

↓

EvaluationService

↓

GeminiClient

↓

Google Gemini

↓

EvaluationResult

↓

EvaluationPanel

EvaluationPanel NEVER communicates directly
with Google Gemini.

------------------------------------------------------------

# 25. Context Communication

InterviewContext

communicates with

• Interview Components

• InterviewFlowService

SpeechContext

communicates with

• SpeechRecorder

• Evaluation Panel

Contexts NEVER communicate directly
with Browser APIs.

Contexts NEVER communicate directly
with Google Gemini.

------------------------------------------------------------

# 26. Service Communication

InterviewFlowService

↓

SpeechController

↓

EvaluationService

↓

GeminiClient

Services may communicate with other services.

Components may NOT communicate with services
outside their responsibility.

------------------------------------------------------------

# 27. Communication Principles

Allowed

Component

↓

Context

↓

Business Logic

↓

Service

↓

External API

Forbidden

External API

↓

Component

Google Gemini

↓

SpeechRecorder

Browser API

↓

QuestionCard

SpeechRecognition

↓

EvaluationPanel

------------------------------------------------------------

End of Part 6
# ============================================================
# 28. Module Dependency Matrix
# ============================================================

The following matrix defines which modules are allowed
to communicate with each other.

------------------------------------------------------------

Legend

✓ Allowed

✗ Forbidden

------------------------------------------------------------

| Module                     | Component | Context | Business | Service | Browser API | Gemini |
|----------------------------|-----------|----------|-----------|----------|-------------|---------|
| Components                 | ✓         | ✓        | ✓         | ✗        | ✗           | ✗       |
| Context                    | ✓         | ✓        | ✓         | ✗        | ✗           | ✗       |
| Business Logic             | ✗         | ✓        | ✓         | ✓        | ✗           | ✗       |
| Services                   | ✗         | ✗        | ✓         | ✓        | ✓           | ✓       |
| Browser Speech API         | ✗         | ✗        | ✗         | ✓        | ✓           | ✗       |
| Google Gemini              | ✗         | ✗        | ✗         | ✓        | ✗           | ✓       |

------------------------------------------------------------

# 29. Current Frozen Modules

The following modules are currently considered stable.

Speech Module

Status

FROZEN

Includes

✓ SpeechRecorder

✓ SpeechController

✓ SpeechRecognitionManager

✓ SpeechRecognitionService

------------------------------------------------------------

Gemini Module

Status

FROZEN

Includes

✓ GeminiClient

------------------------------------------------------------

Interview Module

Status

ACTIVE

Includes

InterviewContext

InterviewFlowService

AIInterviewer

------------------------------------------------------------

Evaluation Module

Status

DEVELOPMENT

Includes

EvaluationService

Evaluation Panel

Grammar Analyzer

Focus Analyzer

Question Coach

------------------------------------------------------------

# 30. Architecture Validation Checklist

Before a module can be Frozen, verify:

□ No circular dependency

□ No duplicated responsibility

□ No direct Browser API calls from Components

□ No direct Gemini calls from Components

□ Business Logic separated from UI

□ Build passes

□ Manual test passes

□ Integration test passes

□ Technical Leader approves

------------------------------------------------------------

# 31. Technical Debt Policy

Technical debt should be documented.

Do not hide technical debt inside source code.

Every known issue must be recorded.

Technical debt should be fixed during planned
maintenance sprints.

------------------------------------------------------------

End of Part 7
# ============================================================
# 32. Future Architecture Roadmap
# ============================================================

The architecture is designed to support long-term expansion.

Future modules will follow the same layered architecture.

Planned modules include

✓ Dashboard

✓ Learning Analytics

✓ User Profile

✓ Achievement System

✓ Vocabulary Trainer

✓ Pronunciation Trainer

✓ IELTS Speaking

✓ TOEIC Speaking

✓ AI Conversation

✓ Teacher Portal

✓ Administrator Portal

Every new module must comply with the existing
architecture principles.

------------------------------------------------------------

# 33. Versioning Strategy

The project follows Semantic Versioning.

Format

MAJOR.MINOR.PATCH

Examples

1.0.0

1.1.0

1.1.3

Rules

MAJOR

Breaking architecture changes.

MINOR

New features.

PATCH

Bug fixes.

------------------------------------------------------------

# 34. Architecture Review Policy

Architecture is reviewed before implementation.

Every new feature must answer the following questions.

1.

Which layer does this feature belong to?

2.

Does this feature introduce a new dependency?

3.

Can an existing service be reused?

4.

Will this feature break a Frozen module?

If any answer is unclear,

implementation must stop until the architecture
has been reviewed.

------------------------------------------------------------

# 35. Long-Term Maintenance

The project is expected to continue growing for
multiple years.

Therefore,

maintainability is considered more important
than short-term coding speed.

Every module should be

• Readable

• Testable

• Replaceable

• Independent

------------------------------------------------------------

# 36. Architecture Principles Summary

English AI Coach is built around the following principles.

✓ Separation of Concerns

✓ Single Responsibility

✓ Layered Architecture

✓ One-way Data Flow

✓ Module Freeze

✓ Documentation First

✓ Architecture Before Coding

✓ Long-term Maintainability

------------------------------------------------------------

# End of Architecture

Architecture Status

FROZEN

Version

1.0

Approved By

Technical Leader

ChatGPT

------------------------------------------------------------

# ============================================================
# English AI Coach
# ------------------------------------------------------------
# Coding Convention
# ============================================================

Version

1.0

Status

Development

Last Updated

2026-07-26

Technical Leader

ChatGPT

------------------------------------------------------------

# 1. Purpose

This document defines the coding standards used
throughout English AI Coach.

Every source file must follow these conventions.

The goal is

• Readable code

• Maintainable code

• Consistent code

• Easy collaboration

------------------------------------------------------------

# 2. Development Philosophy

The project follows these principles.

Code is written for humans first.

The compiler is secondary.

Readable code is always preferred over clever code.

Simple solutions are preferred over complex solutions.

Consistency is more important than personal preference.

------------------------------------------------------------

# 3. Official Language

All source code

must use

English.

Examples

Variable names

Function names

Interfaces

Enums

Types

Comments inside code

Folder names

File names

must all be English.

Documentation

may use Vietnamese.

------------------------------------------------------------

# 4. File Header

Every source file must begin with a standard header.

Example

/**
 * ============================================================
 * English AI Coach
 * ------------------------------------------------------------
 * Module:
 *
 * File:
 *
 * Version:
 *
 * Status:
 *
 * Description:
 * ============================================================
 */

No file should omit this header.

------------------------------------------------------------

# End of Part 1
# ============================================================
# 5. Naming Convention
# ============================================================

Every identifier inside the project must follow a
consistent naming convention.

Consistency is more important than personal preference.

------------------------------------------------------------

# 6. Folder Naming

Folders use

lowercase

Examples

app

components

context

services

types

hooks

prompts

docs

assets

Never use

App

Components

Services

Contexts

------------------------------------------------------------

# 7. File Naming

React Components

PascalCase

Examples

SpeechRecorder.tsx

QuestionCard.tsx

LessonCard.tsx

EvaluationPanel.tsx

------------------------------------------------------------

Services

camelCase

Examples

speechController.ts

speechQueueService.ts

evaluationService.ts

geminiClient.ts

------------------------------------------------------------

Contexts

PascalCase

Examples

SpeechContext.tsx

InterviewContext.tsx

------------------------------------------------------------

Types

lowercase

Examples

evaluation.ts

question.ts

lesson.ts

------------------------------------------------------------

# 8. Variable Naming

Variables use

camelCase

Examples

currentQuestion

recordingStatus

speechQueue

grammarScore

focusAnalysis

Never use

CurrentQuestion

recording_status

speech_queue

------------------------------------------------------------

# 9. Constant Naming

Constants use

UPPER_SNAKE_CASE

Examples

DEFAULT_MODEL

MAX_RECORDING_TIME

DEFAULT_LANGUAGE

DEFAULT_STATUS

------------------------------------------------------------

# End of Part 2
# ============================================================
# 10. Function Naming
# ============================================================

Functions use

camelCase

Examples

startRecording()

stopRecording()

toggleRecording()

generateEvaluation()

calculateOverall()

analyzeFocus()

coachQuestion()

Never use

StartRecording()

START_RECORDING()

start_recording()

------------------------------------------------------------

# 11. Interface Naming

Interfaces use

PascalCase

Every interface should begin with a meaningful name.

Examples

SpeechRecognitionCallbacks

EvaluationResult

Question

Lesson

BrowserSpeechRecognition

InterviewFlow

Never use

speechRecognitionCallbacks

evaluation_result

IQuestion

ILesson

------------------------------------------------------------

# 12. Type Naming

Types use

PascalCase

Examples

SpeechStatus

InterviewState

GrammarScore

QuestionLevel

Never use

speechStatus

grammar_score

------------------------------------------------------------

# 13. Enum Naming

Enums use

PascalCase

Members use

UPPER_CASE

Example

enum InterviewState {

    READY,

    ASKING,

    LISTENING,

    EVALUATING,

    FINISHED

}

------------------------------------------------------------

# 14. React Hook Naming

Every custom hook must begin with

use

Examples

useSpeechContext()

useInterviewContext()

useEvaluation()

Never use

speechContext()

interviewContext()

------------------------------------------------------------

# 15. Boolean Naming

Boolean variables should answer a question.

Examples

isRecording

isFinished

isLoading

hasPermission

canEvaluate

Never use

recordingFlag

finishStatus

loadingState

------------------------------------------------------------

# End of Part 3
# ============================================================
# 16. Comment Convention
# ============================================================

Every source file should contain meaningful comments.

Comments explain

WHY

instead of

WHAT

The code itself should explain WHAT.

------------------------------------------------------------

Good Example

// Wait until AI finishes speaking before
// starting Speech Recognition.

Bad Example

// Call startRecording()

------------------------------------------------------------

Block comments use

/** */

Example

/**
 * Initialize Speech Recognition
 */

------------------------------------------------------------

Section comments use

/* ============================================================
 * Section Name
 * ============================================================
 */

Examples

State

Hooks

Effects

Event Handlers

UI

------------------------------------------------------------

# 17. Import Convention

Imports must follow the same order.

1.

React

2.

Third-party libraries

3.

Project aliases

4.

Relative imports

------------------------------------------------------------

Example

import {

  useEffect,

  useState,

} from "react";

import {

  GoogleGenAI,

} from "@google/genai";

import {

  useSpeechContext,

} from "@/context/SpeechContext";

import {

  helper,

} from "../utils/helper";

------------------------------------------------------------

# 18. Export Convention

Prefer

Named Export

Examples

export function

export interface

export type

export const

Avoid unnecessary

Default Export

Default Export is allowed only for

React Components

Examples

export default function SpeechRecorder()

export default function QuestionCard()

Services should use

Named Export

------------------------------------------------------------

# 19. File Organization

Every source file follows the same structure.

Header

↓

Imports

↓

Types

↓

Constants

↓

State

↓

Functions

↓

Component

↓

Export

The order should remain consistent
throughout the project.

------------------------------------------------------------

# 20. File Length Policy

A single file should remain readable.

Recommended

200–300 lines

Maximum

500 lines

If a file becomes too large,

split it into

multiple services

or

multiple components.

------------------------------------------------------------

# End of Part 4
# ============================================================
# 21. Development Workflow
# ============================================================

English AI Coach follows a fixed development workflow.

Every feature must pass each stage before moving
to the next stage.

------------------------------------------------------------

Requirement

↓

Architecture Review

↓

Implementation

↓

Build

↓

Manual Test

↓

Bug Fix

↓

Freeze

↓

Documentation Update

------------------------------------------------------------

No stage may be skipped.

------------------------------------------------------------

# 22. Working Agreement

The project follows a Tech Lead / Developer model.

------------------------------------------------------------

Technical Leader

Responsible for

• Architecture

• Code Review

• Coding Convention

• Module Design

• Freeze Approval

• Documentation

------------------------------------------------------------

Developer

Responsible for

• Copy source code

• Build project

• Test features

• Report bugs

• Verify fixes

Developer should never modify architecture
without Technical Leader approval.

------------------------------------------------------------

# 23. Long File Policy

To support ChatGPT Free limitations,
large source files are divided into multiple parts.

Rules

Small File

↓

Complete File

Large File

↓

Part 1

↓

Part 2

↓

Part 3

↓

...

↓

Complete Source File

Every part must keep the original order.

No content should be skipped.

------------------------------------------------------------

# 24. Build Policy

After every completed file

Developer must

✓ Save

↓

✓ Build

↓

✓ Fix TypeScript errors

↓

✓ Test functionality

↓

✓ Confirm OK

Only after confirmation may the project continue.

------------------------------------------------------------

# 25. Bug Fix Policy

When a bug is discovered

Do NOT immediately patch the code.

Instead

Bug Report

↓

Root Cause Analysis

↓

Architecture Review

↓

Fix

↓

Regression Test

↓

Freeze Again

The objective is

Fix Once

Never Patch Forever

------------------------------------------------------------

# End of Part 5
# ============================================================
# 26. Module Status Rules
# ============================================================

Every module in English AI Coach must always have
one status.

------------------------------------------------------------

PLANNED

The module has been designed but development has
not started.

Examples

Dashboard

Teacher Portal

Learning Analytics

------------------------------------------------------------

DEVELOPMENT

The module is currently being implemented.

Changes are expected.

Architecture may still evolve.

------------------------------------------------------------

STABLE

The module has passed build and testing.

Minor improvements are still allowed.

Breaking architecture changes are NOT allowed.

------------------------------------------------------------

FROZEN

The module is considered complete.

Only critical bug fixes are permitted.

No feature development is allowed.

------------------------------------------------------------

# 27. Current Module Status

Speech Module

Status

FROZEN

------------------------------------------------------------

Gemini Client

Status

FROZEN

------------------------------------------------------------

Speech Queue

Status

FROZEN

------------------------------------------------------------

Evaluation Service

Status

DEVELOPMENT

------------------------------------------------------------

Dashboard

Status

PLANNED

------------------------------------------------------------

Learning Analytics

Status

PLANNED

------------------------------------------------------------

# 28. Code Review Checklist

Every source file must pass the following review.

Architecture

□ Correct Layer

□ Correct Responsibility

□ No Circular Dependency

Naming

□ File Name

□ Function Name

□ Variable Name

□ Interface Name

Formatting

□ Header Exists

□ Sections Organized

□ Comments Meaningful

Code Quality

□ No Dead Code

□ No Duplicate Code

□ No Magic Numbers

□ Readable Logic

Testing

□ Build Pass

□ Manual Test

□ Integration Test

Documentation

□ Updated if necessary

------------------------------------------------------------

# 29. Freeze Approval

Only the Technical Leader can approve a module
for Freeze.

Conditions

✓ Build Pass

✓ Review Pass

✓ Test Pass

✓ Documentation Updated

✓ Architecture Approved

------------------------------------------------------------

# End of Part 6
# ============================================================
# 30. Error Handling Rules
# ============================================================

Every module must handle errors consistently.

Errors must never be silently ignored.

------------------------------------------------------------

Allowed

try

↓

catch

↓

Meaningful Error Message

↓

Return Safe Result

------------------------------------------------------------

Avoid

try

↓

catch

↓

empty catch block

------------------------------------------------------------

Example

try {

    await generateEvaluation();

}

catch (error) {

    console.error(error);

    throw error;

}

------------------------------------------------------------

# 31. Logging Rules

Development

Use

console.log()

console.warn()

console.error()

only when necessary.

Before a module is Frozen,

remove unnecessary console.log() statements.

Keep only

• Critical Error

• Warning

• Important Lifecycle Logs

------------------------------------------------------------

# 32. Documentation Rules

Every module must be documented.

Documentation includes

• File Header

• Function Description

• Complex Logic Comments

• Project Bible Update

When architecture changes,

Project Bible must be updated first.

------------------------------------------------------------

# 33. Code Duplication Policy

Do not duplicate code.

If logic is reused more than once,

extract it into

• Helper

or

• Service

or

• Utility Function

Examples

Good

calculateOverall()

generateEvaluation()

analyzeFocus()

Bad

Copy the same logic into

multiple Components.

------------------------------------------------------------

# 34. Refactoring Policy

Refactoring is allowed only when

✓ Readability improves

✓ Maintainability improves

✓ Existing behaviour remains unchanged

Never refactor a Frozen module without approval.

------------------------------------------------------------

# 35. Regression Rule

After changing one module,

all dependent modules must be tested.

Example

SpeechRecognitionService

↓

SpeechController

↓

SpeechRecorder

↓

Interview Module

↓

Evaluation Module

↓

Manual Test

↓

Freeze

------------------------------------------------------------

# End of Part 7
# ============================================================
# 36. Project Standards Summary
# ============================================================

English AI Coach follows one unified development standard.

Every source file must comply with

✓ Architecture

✓ Coding Convention

✓ Module Status Rules

✓ Freeze Policy

✓ Documentation Policy

✓ Review Checklist

------------------------------------------------------------

# 37. Team Communication Rules

All development discussions should follow the same process.

Requirement

↓

Technical Analysis

↓

Architecture Decision

↓

Implementation

↓

Testing

↓

Review

↓

Freeze

No implementation should begin before
the architecture has been agreed.

------------------------------------------------------------

# 38. Version Control Rules

Every important milestone should increase
the project version.

Examples

Version 1.0

Project Bible completed

Version 1.1

Speech Module completed

Version 1.2

Gemini Integration completed

Version 1.3

Evaluation Service completed

Version 2.0

English AI Coach Official Release

------------------------------------------------------------

# 39. Project Quality Goals

The project aims to achieve

✓ High Readability

✓ High Maintainability

✓ Stable Architecture

✓ Consistent Coding Style

✓ Minimal Technical Debt

✓ Long-term Scalability

------------------------------------------------------------

# 40. Final Principles

Always remember

Architecture before Coding.

Documentation before Expansion.

Freeze before New Features.

Fix Root Cause instead of Symptoms.

Readable Code over Clever Code.

Consistency over Personal Style.

Long-term Maintainability over Short-term Speed.

------------------------------------------------------------

# Coding Convention Status

Version

1.0

Status

FROZEN

Approved By

Technical Leader

ChatGPT

------------------------------------------------------------

# End of File
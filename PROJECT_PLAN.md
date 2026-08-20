# ShalaSarathi — Product Specification & Technical Blueprint

## 1. Executive Summary

ShalaSarathi is a Gujarati-first, offline-first utility app for Primary School Teachers, Subject Teachers and Principals / HTAT in Gujarat (Grades 1–8).

**Core promise:** enter school information once → select a tool/template → enter only document-specific data → generate, save, print or export locally.

The product combines academic planning, assessment, administration, finance, school documentation and creative school-community tools.

### Product pillars
- Academic: lesson planner, teacher diary, timetable, question papers
- Assessment: SCE, examination sheets, cumulative results
- Finance: Rojmel and grant-wise expenses
- PM Poshan: daily/monthly calculations
- Administration: letters, certificates, notices, registers
- Creative: Aaj no Deepak, Aaj nu Gulab, assembly frames
- Documents: local PDF/image generation
- Offline-first: core workflows work without internet

---

## 2. Product Vision & UX Principles

### Vision
> **“એક વાર માહિતી भरो → રોજનું શિક્ષણ, પરીક્ષા, હિસાબ અને શાળાનું documentation સરળતાથી તૈયાર કરો.”**

### Zero/minimal typing
Prefer selection over repetitive typing:

`ધોરણ → વિષય → પાઠ → તારીખ`

and:

`School Profile → Letter/Patrak → Template → Student/Staff → Generate PDF`

### UX principles
- Gujarati-first UI and data
- Simple, trustworthy education-office visual language
- Large readable typography
- Minimum clicks for daily work
- Clear A4 preview
- Strong print/PDF workflow
- Responsive layouts
- Accessible validation

---

# 3. Architecture

```text
Flutter UI
   ↓
Feature / Application Layer
   ↓
Repository Layer
   ↓
Local SQLite + Drift
   ↓
Local PDF / Image Generation

Optional cloud services:
Firebase FCM / Remote Config / Crashlytics / Analytics
```

### Architecture rule
Firebase must never be required for core teacher workflows. If internet is unavailable, lesson planning, timetable, question papers, Rojmel, PM Poshan, SCE, PDF generation and image generation must continue to work.

### Recommended local database
**SQLite + Drift** is preferred over Hive/Isar because the product has relational entities, reporting, filtering, joins and audit-style records.

---

# 4. User Onboarding & Profiles

## First launch

1. Select role:
   - Teacher
   - Subject Teacher
   - Principal / HTAT
2. Create or load local profile
3. Configure school profile
4. Optional phone/OTP authentication
5. Enter academic year

### Role modes
- Class Teacher Mode
- Subject Teacher Mode
- Principal / HTAT Mode

The UI can expose different quick actions by role without duplicating the underlying data model.

## School Profile

The school profile is the single source of truth for reusable information.

Fields:
- School name
- Address
- Village / City
- Taluka
- District
- UDISE code
- School index number
- Acharya / Principal name
- Contact number
- Email
- Academic year
- Logo
- Acharya signature / seal
- Other configurable official details

Support Add, Edit, Save, Preview and logo/signature upload.

---

# 5. Core Modules

## 5.1 Dashboard

Recommended cards:
1. School Profile
2. Daily Lesson / Teacher Diary
3. Timetable
4. Letters
5. Patrak
6. Question Papers
7. Results / SCE
8. Rojmel
9. PM Poshan
10. Registers
11. Creative Tools
12. Recent Documents
13. Templates
14. Settings

Quick actions:
- Create Letter
- Create Patrak
- Create Question Paper
- Add Rojmel Entry
- PM Poshan Entry
- Generate Result

---

## 5.2 Daily Lesson Planner / Teacher Diary

Flow:

`ધોરણ → વિષય → પાઠ → Learning Outcome → Activity → Homework → Save`

Use bundled, versioned syllabus and learning-outcome data so most selections require no typing.

### Data
- Date
- Standard / division
- Subject
- Lesson/chapter
- Learning outcome
- Activity
- Homework
- Remarks
- Completion status

---

## 5.3 Smart Timetable

Inputs:
- Standards / divisions
- Teachers
- Subjects
- Periods
- Working days
- Multi-grade combinations

The timetable engine should detect teacher/standard conflicts and suggest valid slots.

Example conflict:

`Teacher A + Period 3 + Std 5 + Std 6 = conflict`

For multi-grade schools, allow configured combined classes where appropriate.

---

## 5.4 Question Paper & Answer Key Generator

Flow:

`Std → Subject → Chapters → Blueprint → Generate → Edit → Preview → PDF`

Question types:
- MCQ
- True/False
- Fill in the blank
- Very short
- Short
- Long
- Match the following

Blueprint should control count, marks, difficulty and chapter/learning-outcome coverage.

### Offline-first rule
The initial generator should use a local question bank and templates rather than requiring a cloud AI API. Optional online AI generation can be added later.

---

## 5.5 Rojmel — Digital Cash Book

Grant-wise accounts:
- Composite School Grant
- Sports
- Swachhata
- TLM
- Other configured heads

### Formula
`Closing Balance = Opening Balance + Total Receipts - Total Expenses`

Per grant:
`Grant Balance = Opening + Receipts - Expenses`

Prevent an expense from exceeding available balance unless an authorized adjustment workflow exists.

### Audit safety
Do not silently delete financial transactions. Use reversal/void records with reason, timestamp and user.

### Export
Generate audit-ready local PDF with opening balance, receipts, expenses, closing balance and transaction details.

---

## 5.6 PM Poshan / MDM Calculator

Daily fields:
- Date
- Eligible student count
- Primary count
- Upper-primary count
- Grain usage
- Cooking cost
- Remarks

### Formula
`Daily Grain = Eligible Students × Applicable Government Grain Rate`

Example only:
`100 students × 100g = 10,000g = 10kg`

The actual government rate must be configurable and versioned rather than hard-coded.

Create monthly abstract output from daily entries.

---

## 5.7 SCE / Examination / Results

Support:
- Patrak A
- Patrak B
- Patrak C
- Cumulative result cards
- Batch generation

Architecture should be template/data driven rather than hard-coded to one government format.

### Core formula
`Percentage = Obtained Marks / Maximum Marks × 100`

### Grade system
Store grading schemes and rules as configurable data. Do not hard-code a single grading scale because official assessment rules can change.

Batch flow:

`Select Class → Select Students → Select Assessment → Generate All → Preview → PDF Bundle`

---

## 5.8 Registers

Initial register modules:
- Dead Stock
- SMC
- Other school registers as templates

Registers should support entries, search, filters, history and PDF/print export.

---

## 5.9 Aaj no Deepak / Aaj nu Gulab

Instant offline graphic generator.

Flow:

`Student → Photo → Template → Achievement/Text → Generate → Save/Share`

Provide 4–5 configurable templates initially:
- Minimal
- Traditional school
- Modern
- Festival
- Achievement

Images should be generated locally.

---

## 5.10 Official School Letterhead Maker

One-time configuration:
- Logo
- School name
- Address
- UDISE
- Phone / email
- Acharya name
- Signature
- Seal

Flow:

`New Letter → Select Type → Enter Body → Preview → PDF / Print`

This is also the foundation for the broader Letter & Patrak Generator system.

---

## 5.11 Daily Assembly Frame

Generate an offline school frame containing configurable:
- Suvichar / Quote
- Din Vishesh
- Tithi
- Date
- Birthday / student highlight

Date-sensitive content can optionally refresh when internet is available.

---

# 6. Screen-by-Screen Flow

## Splash

`ShalaSarathi → Gujarati tagline → Load local data`

## Onboarding

`Role → Profile → School → Academic Year → Dashboard`

## Home

Bottom navigation:

`Home | Academic | Admin | Create | More`

## Academic

- Teacher Diary
- Timetable
- Question Papers
- Results / SCE

## Admin

- Rojmel
- PM Poshan
- Registers
- School Profile
- Letters / Patrak

## Create

- Letter
- Patrak
- Question Paper
- Certificate
- Creative Frame

## Documents

Searchable list with:
- Document type
- Template
- Date
- Academic year
- Reference number
- Creator
- Status

Actions:
- View
- Edit
- Duplicate
- PDF
- Print
- Share

---

# 7. Database Schema

## `schools`

```text
id UUID
schoolName TEXT
village TEXT
taluka TEXT
district TEXT
udiseCode TEXT
schoolIndexNo TEXT
address TEXT
phone TEXT
email TEXT
logoPath TEXT
signaturePath TEXT
academicYear TEXT
createdAt DATETIME
updatedAt DATETIME
```

## `users`

```text
id UUID
schoolId FK
name TEXT
mobile TEXT
role ENUM
profilePhoto TEXT
isPrincipal BOOLEAN
createdAt DATETIME
```

Roles:
`teacher`, `subjectTeacher`, `principal`, `admin`

## `students`

```text
id UUID
schoolId FK
studentId TEXT
fullName TEXT
gender TEXT
dateOfBirth DATE
standard TEXT
division TEXT
rollNo INTEGER
parentName TEXT
mobile TEXT
category TEXT
medium TEXT
isActive BOOLEAN
```

## `subjects`

```text
id UUID
name TEXT
standard TEXT
medium TEXT
code TEXT
```

## `syllabus_units`

```text
id UUID
standard TEXT
subjectId FK
unitNo INTEGER
chapterNo INTEGER
chapterName TEXT
lessonName TEXT
learningOutcomes TEXT
competencies TEXT
estimatedPeriods INTEGER
curriculumVersion TEXT
academicYear TEXT
source TEXT
```

## `lesson_plans`

```text
id UUID
teacherId FK
schoolId FK
date DATE
standard TEXT
division TEXT
subjectId FK
lessonId FK
learningOutcome TEXT
activity TEXT
homework TEXT
remarks TEXT
status TEXT
createdAt DATETIME
```

## `timetable_entries`

```text
id UUID
schoolId FK
dayOfWeek INTEGER
periodNo INTEGER
startTime TEXT
endTime TEXT
standard TEXT
division TEXT
subjectId FK
teacherId FK
room TEXT
```

## `question_papers`

```text
id UUID
schoolId FK
teacherId FK
standard TEXT
subjectId FK
examName TEXT
totalMarks INTEGER
durationMinutes INTEGER
blueprintId TEXT
createdAt DATETIME
```

## `questions`

```text
id UUID
questionPaperId FK
type TEXT
questionText TEXT
marks INTEGER
difficulty TEXT
chapter TEXT
learningOutcome TEXT
answer TEXT
sequence INTEGER
```

## `exams`

```text
id UUID
schoolId FK
name TEXT
standard TEXT
academicYear TEXT
date DATE
totalMarks INTEGER
passingMarks INTEGER
```

## `student_results`

```text
id UUID
examId FK
studentId FK
subjectId FK
marksObtained REAL
grade TEXT
remarks TEXT
```

## `rojmel_accounts`

```text
id UUID
schoolId FK
grantType TEXT
openingBalance REAL
currentBalance REAL
```

## `rojmel_transactions`

```text
id UUID
accountId FK
date DATE
voucherNo TEXT
description TEXT
income REAL
expense REAL
head TEXT
paymentMode TEXT
referenceNo TEXT
remarks TEXT
createdBy FK
status TEXT
voidReason TEXT
```

## `pm_poshan_daily`

```text
id UUID
schoolId FK
date DATE
studentCount INTEGER
primaryCount INTEGER
upperPrimaryCount INTEGER
grainRate REAL
grainUsed REAL
cookingCostRate REAL
cookingCost REAL
remarks TEXT
```

## `documents`

```text
id UUID
schoolId FK
createdBy FK
documentType TEXT
templateId FK
title TEXT
filePath TEXT
createdAt DATETIME
updatedAt DATETIME
```

## `templates`

```text
id UUID
templateType TEXT
name TEXT
version TEXT
language TEXT
contentJson TEXT
isPremium BOOLEAN
isActive BOOLEAN
```

## `media_assets`

```text
id UUID
schoolId FK
type TEXT
localPath TEXT
thumbnailPath TEXT
createdAt DATETIME
```

## `subscriptions`

```text
id UUID
userId FK
plan TEXT
startDate DATETIME
expiryDate DATETIME
status TEXT
purchaseToken TEXT
```

---

# 8. Template Engine

Templates must be data-driven rather than hard-coded wherever practical.

Reusable placeholders:

```text
{{school_name}}
{{school_address}}
{{acharya_name}}
{{udise_code}}
{{academic_year}}
{{date}}
{{reference_no}}
{{student_name}}
{{standard}}
```

Each template defines:
- Unique ID
- Name
- Category
- Description
- Required fields
- Auto-filled fields
- Optional fields
- Table definitions
- Header/footer configuration
- A4 print settings
- Version
- Premium/free status

This allows new letters and patraks to be added without redesigning the application.

---

# 9. Document Preview & PDF

A4 preview should contain:
- School logo/header
- School and Acharya details
- Document title
- Reference/date
- Main content/table
- Signature/seal
- Footer

Actions:
- Edit
- Save
- Download PDF
- Print
- Duplicate
- Share

All core PDF generation must happen locally.

---

# 10. Tech Stack

## Frontend
- Flutter
- Dart
- Material 3
- Riverpod

## Database
- SQLite
- Drift
- SQLite migrations

## PDF / documents
- `pdf`
- `printing`

## Images/files
- `image`
- `flutter_image_compress`
- `path_provider`
- `open_filex`
- `share_plus`

## Firebase
Use only for optional cloud services:
- Firebase Cloud Messaging
- Firebase Remote Config
- Firebase Crashlytics
- Firebase Analytics

Firebase must not be the primary application database.

## Monetization
- Google Mobile Ads / AdMob
- Google Play subscription billing

---

# 11. Flutter Folder Structure

```text
lib/
├── app/
│   ├── app.dart
│   ├── router.dart
│   └── theme/
├── core/
│   ├── constants/
│   ├── errors/
│   ├── extensions/
│   ├── utils/
│   └── services/
├── database/
│   ├── database.dart
│   ├── tables/
│   ├── daos/
│   └── migrations/
├── features/
│   ├── onboarding/
│   ├── dashboard/
│   ├── school_profile/
│   ├── teacher_diary/
│   ├── timetable/
│   ├── question_paper/
│   ├── results/
│   ├── rojmel/
│   ├── pm_poshan/
│   ├── sce/
│   ├── registers/
│   ├── letterhead/
│   ├── creative/
│   ├── assembly/
│   ├── documents/
│   ├── templates/
│   └── settings/
├── shared/
│   ├── widgets/
│   ├── models/
│   └── components/
└── main.dart
```

---

# 12. Offline-First Rules

1. No core workflow should fail because Firebase is unavailable.
2. Important user actions write locally first.
3. Generated PDFs/images remain on-device.
4. Cloud operations are optional enhancements.
5. Provide backup export/import.
6. Protect sensitive student data and minimize unnecessary cloud transfer.
7. Use database migrations for every schema change.

Flow:

`User Action → Validate → SQLite → UI Update → Optional Cloud Operation`

---

# 13. Monetization Strategy

## Free tier

- School Profile
- Teacher Diary
- Timetable
- Basic letters
- Basic PM Poshan
- Basic Rojmel
- Basic PDF

## Premium annual pass

Potential premium features:
- Batch result generation
- Advanced question-paper generator
- Advanced template library
- Full Patrak library
- Audit-ready Rojmel export
- Premium graphic templates
- Bulk PDF generation
- Ad-free experience

### Ads
Use ads carefully:
- Banner on low-friction screens
- Interstitial only at natural transitions
- Rewarded ads as an optional one-time unlock

Never interrupt data entry or critical school workflows with aggressive ads.

---

# 14. ROI Model

Illustrative scenario only:

`10,000 active users × 5% conversion = 500 subscribers`

At an example annual price of ₹499:

`500 × ₹499 = ₹2,49,500 gross annual revenue`

At 25,000 users:

`25,000 × 5% = 1,250 subscribers`

`1,250 × ₹499 = ₹6,23,750 gross annual revenue`

Actual net revenue depends on Play fees, taxes, refunds, acquisition cost and retention.

The strongest business opportunity is likely recurring teacher/school adoption and retention rather than advertising alone.

---

# 15. Four-Phase Development Roadmap

## Phase 1 — Foundation

Build:
1. Flutter architecture
2. Gujarati design system
3. Onboarding
4. Local user profile
5. School profile
6. SQLite/Drift
7. Dashboard
8. Teacher diary
9. Basic timetable
10. PDF engine
11. Backup/export

**Milestone:** a teacher can configure a school and create useful documents completely offline.

## Phase 2 — Academic Engine

Build:
- Curriculum structure
- Learning outcomes
- Smart timetable
- Question bank
- Question paper generator
- Answer key
- Student database
- Exam module
- SCE
- Results
- Batch PDF

**Milestone:** complete offline academic assessment workflow.

## Phase 3 — Administration & Creative Tools

Build:
- Rojmel
- Grant heads
- PM Poshan
- Dead Stock
- SMC register
- Letterhead
- Certificates
- Aaj no Deepak
- Aaj nu Gulab
- Assembly generator
- Document history

**Milestone:** ShalaSarathi becomes an everyday school-office utility.

## Phase 4 — Commercial Release

Build:
- Premium subscriptions
- AdMob
- Remote Config
- FCM
- Crashlytics
- Analytics
- Template update system
- Backup/restore
- Performance optimization
- Security review
- Play Store compliance
- Beta testing

Release sequence:

`Internal Alpha → 10–20 Teachers → 50–100 Beta Users → District Pilot → Public Release`

---

# 16. Critical Product Decisions

Before production coding, lock these decisions:

### Official formats
GSEB/GCERT/Education Department formats must be treated as versioned templates and verified against applicable official material.

### Gujarati content
Curriculum, learning outcomes, question banks and official formats must be versioned by academic year/curriculum version.

### Government calculations
PM Poshan rates, grading rules and other government-controlled values must be configurable and effective-date based.

### Privacy
Student information is sensitive. Minimize collection, protect local data and never upload student data unless the feature explicitly requires it and the user has appropriate consent/authority.

### Backup
Offline-first must not mean data-loss-first. Provide encrypted backup export/import as an early reliability feature.

---

# 17. Recommended MVP

Do not start by building every module.

First production MVP:

`Login/Profile → School Profile → Dashboard → Teacher Diary → 1 Letter → 1 Patrak → A4 Preview → PDF → Print`

Then expand:

`Question Paper → Results/SCE → Rojmel → PM Poshan → Registers → Creative Tools`

This creates a stable architecture and validates the core user journey before the product becomes large.

---

# 18. First Build Checklist

### Foundation
- [ ] Flutter project
- [ ] Gujarati font and typography system
- [ ] Theme / design tokens
- [ ] Navigation
- [ ] Drift database
- [ ] Migration system
- [ ] Local profile

### First usable flow
- [ ] School Profile
- [ ] Dashboard
- [ ] Teacher Diary
- [ ] Letter template
- [ ] Patrak template
- [ ] A4 preview
- [ ] PDF generation
- [ ] Print/share

### Quality
- [ ] Offline test with airplane mode
- [ ] PDF print test
- [ ] Gujarati rendering test
- [ ] Database migration test
- [ ] Backup/restore test
- [ ] Large student-list performance test

---

# 19. Product Positioning

**ShalaSarathi = Teacher's Offline Digital Toolkit for Gujarat Schools.**

The primary competitive advantage is not one calculator or one PDF generator. It is the combination of:

**Gujarati-first UX + zero-typing workflows + configurable official-format documents + offline reliability.**

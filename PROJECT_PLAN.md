# ShalaSarathi — Teacher Community & School Work Assistant

> **Core mission:** શિક્ષકને paperworkમાંથી મુક્ત કરીને શિક્ષણ માટે વધુ સમય આપવો.

## 1. Product Vision

ShalaSarathi is a Gujarati-first platform for Gujarat school teachers, subject teachers and Principals / HTAT. It is **not primarily a question-paper app**. The primary identity is a **Teacher Community**, supported by free school-work utilities that reduce repetitive paperwork.

### Core positioning

> **ShalaSarathi — શિક્ષકોનું પોતાનું Community**
>
> **“શિક્ષકનું કામ સરળ બનાવવાનું, શિક્ષણ માટે સમય બચાવવાનું.”**

The product has three layers:

1. **Teacher Community** — teachers share and discover useful material.
2. **School Work Assistant** — simplify Patrak, Rojmel, grants, purchases, letters, certificates, registers and reports.
3. **Teaching Tools** — question papers, worksheets, lesson planning, activities and related resources.

### Product philosophy

**Basic teacher utility should be free.** The product should not make a teacher pay merely to complete ordinary school paperwork.

Premium, if introduced later, should focus on optional advanced convenience/features rather than blocking essential teacher work.

---

# 2. Core Community

Every teacher has an individual account and community profile.

### Teacher profile
- Name
- Profile photo
- School name
- District
- Taluka
- Standards taught
- Subjects
- Role
- Experience (optional)
- Contributions
- Saved resources

### Community content
Teachers can publish:
- Question papers
- Question-bank questions
- Worksheets
- Lesson plans
- Teaching activities
- Useful PDFs
- Patrak / forms
- Paripatra / circular references
- School formats
- Letters
- Certificates
- Teaching ideas
- Best practices

### Community actions
- View
- Like
- Save
- Download
- Copy to My Resources
- Share
- Report
- Follow teacher (later phase)

### Community loop
`Teacher joins → finds useful resource → uses it → creates/shares own resource → other teachers use it → community grows.`

The community is the primary reason to return to the app.

---

# 3. Individual Teacher Accounts

Each teacher gets a separate account even when multiple teachers belong to the same school.

`School → Teacher A / Teacher B / Teacher C / Principal`

School information is shared/configurable at school level, while personal activity remains tied to the individual teacher.

### Authentication
- Phone + OTP
- Local profile for offline-first use
- Optional account linking when online

The app must not force an internet connection for core local work after onboarding.

---

# 4. Teacher Work Assistant — Main Utility Mission

The utility layer exists to remove repetitive school work.

## 4.1 Patrak Automation

Goal: **do not make teachers type the same student/school information repeatedly.**

`Select Patrak → Select Class/Data → Auto-fill → Review → Generate PDF/Print`

A student database should populate repeated fields automatically.

Patrak should be data-driven and versioned so formats can be updated without rewriting the application.

## 4.2 Rojmel

Digital cash book for applicable grant/financial heads.

Examples:
- Composite School Grant
- Sports
- Swachhata
- TLM
- Other applicable heads

`Closing Balance = Opening Balance + Receipts - Expenses`

`Grant Balance = Opening + Receipts - Expenses`

Expenses should be linked to purchase/expense records where practical.

### Audit-safe behavior
Never silently delete a financial transaction. Use reversal/void records with reason, timestamp and user.

Generate local audit-oriented PDF containing opening balance, receipts, expenses, grant head, voucher/reference number, closing balance and transaction details.

## 4.3 Grant Management

Show current balance, total spending and transaction history by grant.

Example:

```text
Composite Grant   ₹29,500
Sports             ₹8,200
Swachhata          ₹4,750
TLM                ₹6,300
```

## 4.4 Stationery / Purchase Management

Record:
- Date
- Item
- Quantity
- Rate
- Total
- Grant head
- Vendor
- Bill number
- Remarks

`Total = Quantity × Rate`

A purchase can automatically create/link the corresponding expense entry and update grant/Rojmel balance.

## 4.5 Bill / Voucher Generation

Generate printable support containing school name, date, item, amount, grant head, vendor, bill/reference number and signature/seal.

## 4.6 Letter & Certificate Tools

School profile information automatically populates official letterhead, letters, certificates, notices, orders and reports.

## 4.7 Registers

Initial utility set:
- Dead Stock
- SMC
- Other applicable school registers

## 4.8 PM Poshan

Daily/monthly calculations with configurable effective-date government rates.

`Daily Grain = Eligible Students × Applicable Government Grain Rate`

Government-controlled rates must not be permanently hard-coded.

---

# 5. Teaching Tools

Teaching tools support the larger Teacher Community mission.

## 5.1 Question Paper Generator

A major utility, not the product identity.

`Standard → Subject → Medium → Exam → Chapters → Blueprint → Generate → Edit → Preview → PDF`

Types:
- MCQ
- True/False
- Fill in the blank
- Very short
- Short
- Long
- Match the following

Initial generation should use an offline question bank/templates. Optional online AI can be considered later.

## 5.2 Community Question Bank

Questions contain standard, subject, chapter, topic, learning outcome, type, difficulty, marks, answer, language and creator.

`Community Question → Copy to My Question Bank → Edit → Use in Paper`

## 5.3 Shared Question Papers

Teachers can publish papers with standard, subject, exam type, marks, duration, academic year, medium and creator.

Actions: View, Download PDF, Use this paper, Copy to editor, Save, Report.

## 5.4 Teacher Diary / Lesson Planning

`Standard → Subject → Lesson → Learning Outcome → Activity → Homework → Save`

Use bundled, versioned curriculum data to minimize typing.

## 5.5 Worksheets & Activities

Teachers can create and share worksheets and classroom activities through the community.

---

# 6. Community Resource Library

### Teaching
Question papers, question bank, worksheets, lesson plans, activities, teaching aids.

### School Work
Patrak, forms, registers, letters, certificates, notices.

### Information
Paripatra, circular references, legally shareable government/department documents and useful guidelines.

### School Management
Rojmel formats, purchase formats, grant-related templates and SMC resources.

### Search and filters
- Standard
- Subject
- District
- Taluka
- Content type
- Exam
- Language/medium
- Newest
- Most downloaded
- Most liked

Community moderation and reporting are required before broad public release.

---

# 7. Community Moderation & Trust

Because teachers can upload public content, the platform needs moderation.

Each upload should support basic validation, duplicate detection where practical, reporting, hide/remove workflow, admin review and copyright/inappropriate-content reporting.

Potential badges later:
- Helpful Teacher
- Top Contributor
- Question Creator
- Verified Teacher

Likes/downloads must not be the only measure of educational quality.

---

# 8. Main Navigation

Recommended bottom navigation:

`Home | Community | Create | My Work | Profile`

## Home
Welcome/profile, community highlights, quick school-work actions, recent work and pending tasks.

## Community
Feed, search, categories and filters.

## Create
Question Paper, Question, Worksheet, Patrak, Letter, Certificate, Resource/Post, Creative Frame.

## My Work
My Question Bank, My Papers, Saved Resources, Patrak history, Rojmel, Purchases, Generated Documents.

## Profile
Teacher profile, School profile, Contributions, Settings and Backup.

---

# 9. Dashboard Concept

```text
┌────────────────────────────────────┐
│ નમસ્તે, શિક્ષકજી 👋               │
│ ShalaSarathi                       │
├────────────────────────────────────┤
│ 👥 Teacher Community               │
│ નવી પોસ્ટ • નવા પ્રશ્નપત્ર •       │
│ નવા ઉપયોગી દસ્તાવેજો              │
├────────────────────────────────────┤
│ આજે શું કરવું છે?                  │
│ 📋 Patrak ભરવું                    │
│ 💰 Rojmel Entry                    │
│ 🏫 Grant નો હિસાબ                  │
│ 🛒 Purchase Entry                  │
│ 📄 Letter બનાવવું                  │
│ 📝 Question Paper                  │
├────────────────────────────────────┤
│ Community Updates                  │
│ 👨‍🏫 Teacher A                     │
│ 📄 ધોરણ 6 Worksheet                │
└────────────────────────────────────┘
```

The Community should be visually primary; Question Paper must not dominate the home screen.

---

# 10. School + Teacher Data Model

```text
School
 ├── School Profile
 ├── Teachers
 ├── Students
 └── School Documents

Teacher
 ├── Personal Profile
 ├── My Questions
 ├── My Papers
 ├── My Resources
 ├── Saved Resources
 └── Community Activity
```

One school can have many independent teacher accounts.

---

# 11. Database Schema

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
role TEXT
profilePhoto TEXT
standardsTaught TEXT
subjectsTaught TEXT
experienceYears INTEGER
createdAt DATETIME
updatedAt DATETIME
```

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

## `community_posts`
```text
id UUID
creatorUserId FK
type TEXT
title TEXT
description TEXT
standard TEXT
subject TEXT
medium TEXT
filePath TEXT
thumbnailPath TEXT
status TEXT
createdAt DATETIME
updatedAt DATETIME
```

Types: `question`, `questionPaper`, `worksheet`, `lessonPlan`, `activity`, `patrak`, `paripatra`, `letter`, `certificate`, `resource`, `discussion`

## `community_interactions`
```text
id UUID
postId FK
userId FK
type TEXT
createdAt DATETIME
```

Types: `like`, `save`, `download`, `report`, `share`

## `teacher_follows`
```text
followerUserId FK
followingUserId FK
createdAt DATETIME
```

## `questions`
```text
id UUID
creatorUserId FK
standard TEXT
subject TEXT
chapter TEXT
topic TEXT
learningOutcome TEXT
type TEXT
difficulty TEXT
marks INTEGER
questionText TEXT
answer TEXT
medium TEXT
sourceType TEXT
isCommunityPublished BOOLEAN
createdAt DATETIME
```

## `question_papers`
```text
id UUID
creatorUserId FK
schoolId FK
standard TEXT
subject TEXT
medium TEXT
examName TEXT
totalMarks INTEGER
durationMinutes INTEGER
blueprintJson TEXT
isCommunityPublished BOOLEAN
createdAt DATETIME
```

## `question_paper_items`
```text
id UUID
questionPaperId FK
questionId FK
sequence INTEGER
marks INTEGER
```

## `syllabus_units`
```text
id UUID
standard TEXT
subject TEXT
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
subject TEXT
lessonId FK
learningOutcome TEXT
activity TEXT
homework TEXT
remarks TEXT
status TEXT
createdAt DATETIME
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

## `purchases`
```text
id UUID
schoolId FK
createdBy FK
date DATE
itemName TEXT
quantity REAL
rate REAL
total REAL
grantHead TEXT
vendorName TEXT
billNo TEXT
remarks TEXT
rojmelTransactionId FK
createdAt DATETIME
```

Formula: `total = quantity × rate`

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

## `media_assets`
```text
id UUID
schoolId FK
ownerUserId FK
type TEXT
localPath TEXT
thumbnailPath TEXT
createdAt DATETIME
```

## `reports`
```text
id UUID
reporterUserId FK
postId FK
reason TEXT
status TEXT
createdAt DATETIME
resolvedAt DATETIME
```

---

# 12. Template & Document Engine

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

Templates define unique ID, name, category, description, required fields, auto-filled fields, optional fields, tables, header/footer, A4 settings, version and free/premium status.

Official formats must be versioned so updates do not require rewriting the app.

---

# 13. Offline-First + Community Architecture

The **school-work utility layer is offline-first**.

Offline-capable workflows:
- School profile
- Student data
- Patrak generation
- Rojmel
- Purchases
- Grant calculations
- PM Poshan
- Lesson planning
- Question paper generation
- PDF/image generation

The **Community layer requires internet for sync/discovery**, but the app remains useful offline.

Recommended pattern:

```text
Local-first data
      ↓
Outbox / Sync Queue
      ↓
Internet available
      ↓
Community API / Cloud backend
```

Firebase should remain useful for FCM, Remote Config, Crashlytics and Analytics. The community backend should have a clean API boundary so it can scale independently if required.

---

# 14. Privacy & Trust

- Collect only necessary data.
- Keep school/student records local by default.
- Do not upload student data merely to use community features.
- Separate public community content from private school records.
- Allow appropriate deletion of user content.
- Provide reporting and moderation.
- Protect local backups.

A community post must never automatically expose private student information.

---

# 15. Monetization Philosophy

## Core principle

**Do not charge teachers for essential paperwork relief.**

Free should include essential teacher work assistance:
- Basic Patrak generation
- Rojmel basics
- Grant tracking basics
- Purchase records
- Basic letters/certificates
- Basic question papers
- Community participation
- Reasonable resource discovery/download

## Optional future premium

Premium should focus on convenience/scale:
- Bulk generation
- Advanced analytics
- Large-scale batch exports
- Advanced template packs
- Optional ad-free mode
- Advanced backup/sync
- Professional school-level reporting

## Ads

If AdMob is used:
- Keep ads away from data entry.
- Avoid aggressive interstitials.
- Never block critical school records behind ads.
- Rewarded ads may unlock optional convenience, not essential work.

---

# 16. Product Growth Strategy

The growth engine is the community, not paid advertising alone.

`Teacher joins → discovers useful resource → solves a real problem → creates/shares resource → other teachers benefit → more teachers join.`

Before public launch, seed the platform with useful, legally shareable resources and templates so new teachers do not see an empty feed.

Local discovery filters should include district, taluka, standard, subject and medium.

---

# 17. Tech Stack

## Frontend
- Flutter
- Dart
- Material 3
- Riverpod

## Local database
- SQLite
- Drift
- Database migrations

## PDF / images
- `pdf`
- `printing`
- `image`
- `flutter_image_compress`

## Files
- `path_provider`
- `open_filex`
- `share_plus`

## Firebase
- Firebase Cloud Messaging
- Firebase Remote Config
- Firebase Crashlytics
- Firebase Analytics

Firebase is not the primary database for private school records.

## Community backend

Design an API boundary from day one for authentication, teacher profiles, community posts, search, likes/saves, downloads and moderation. Choose the backend provider during implementation based on scale and cost.

## Monetization
- Google Mobile Ads / AdMob
- Google Play Billing if premium is introduced

---

# 18. Flutter Folder Structure

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
│   ├── auth/
│   ├── onboarding/
│   ├── dashboard/
│   ├── teacher_profile/
│   ├── community/
│   ├── question_bank/
│   ├── question_paper/
│   ├── teacher_diary/
│   ├── school_profile/
│   ├── patrak/
│   ├── rojmel/
│   ├── grants/
│   ├── purchases/
│   ├── pm_poshan/
│   ├── registers/
│   ├── letterhead/
│   ├── certificates/
│   ├── creative/
│   ├── documents/
│   └── settings/
├── shared/
│   ├── widgets/
│   ├── models/
│   └── components/
└── main.dart
```

---

# 19. Four-Phase Development Roadmap

## Phase 1 — Community Foundation + Core Work Assistant

Build:
1. Flutter architecture
2. Gujarati design system
3. Teacher registration/login
4. Teacher profile
5. School profile
6. Local SQLite/Drift
7. Dashboard
8. Community feed
9. Community post/upload
10. Search basics
11. Basic Patrak engine
12. Letterhead
13. Local PDF generation
14. Backup/export

**Milestone:** teacher can join the community and solve at least one real school paperwork task offline.

## Phase 2 — Question Paper & Shared Resources

Build:
- Question bank
- Question paper generator
- Answer key
- Shared question papers
- Worksheets
- Lesson plans
- Community save/download/copy
- Resource categories
- Better search and filters
- Moderation/reporting

**Milestone:** community becomes useful enough for teachers to return regularly.

## Phase 3 — Teacher Work-Freeing Suite

Build:
- Rojmel
- Grant tracking
- Purchase/stationery management
- Voucher generation
- PM Poshan
- Dead Stock
- SMC registers
- Results/SCE
- Batch Patrak
- Letters/certificates
- Creative tools

**Milestone:** ShalaSarathi replaces multiple repetitive notebooks/files/tools for everyday school work.

## Phase 4 — Scale & Sustainability

Build:
- Follow system
- Teacher reputation/badges
- Advanced community discovery
- Notifications
- Content moderation dashboard
- Optional sync/backup
- Crashlytics/analytics
- Remote Config
- AdMob if appropriate
- Optional premium convenience features
- Performance/security hardening
- Play Store release process

**Release:** `Internal Alpha → 10–20 Teachers → 50–100 Beta Users → District Pilot → Public Release`

---

# 20. MVP Definition

## P0 — Must have
- Individual teacher login/profile
- School profile
- Teacher Community
- Community post/resource upload
- Search
- Question bank
- Basic question paper generation
- Patrak templates
- Basic Patrak generation
- Letterhead
- Local PDF generation
- My Work / Saved Resources

## P1
- Rojmel
- Grant tracking
- Purchase/stationery
- PM Poshan
- Results/SCE
- Batch generation
- Moderation dashboard

## P2
- Follow teachers
- Badges
- Advanced discovery
- Notifications
- Optional sync/backup
- Advanced reporting

---

# 21. Success Metrics

The main KPI is **teacher usefulness and retention**, not number of generated question papers.

Track:
- Weekly active teachers
- Resources uploaded
- Resources downloaded
- Search-to-use rate
- Repeat contributors
- Community retention
- Patrak generated
- Rojmel entries completed
- Purchase records created
- Documents generated
- Estimated typing/time saved
- Crash-free sessions
- Offline workflow success
- PDF generation success
- Backup restore success

### North-star metric

> **Weekly Active Teachers who successfully complete at least one useful community or school-work action.**

---

# 22. Critical Product Rules

1. **Teacher Community is the product identity.**
2. Question Paper Generator is a major tool, not the brand identity.
3. Essential teacher paperwork relief should remain free.
4. Private school/student data must remain separate from public community content.
5. School data should be entered once and reused everywhere.
6. Financial records must be auditable and never silently deleted.
7. Government-controlled rates/formats must be configurable and versioned.
8. Core school-work tools must function offline.
9. Community discovery/sync can require internet.
10. Community content requires moderation and reporting.
11. Do not build every module before validating the core teacher experience.
12. Prioritize time saved for teachers over feature count.

---

# 23. Product North Star

## ShalaSarathi

> ### **“શિક્ષકનું કામ સરળ બનાવવાનું, શિક્ષણ માટે સમય બચાવવાનું.”**

**Community + Work Assistant + Teaching Tools**

The long-term goal is for a Gujarat teacher to open ShalaSarathi whenever they think:

- “આ Patrak ક્યાંથી મળશે?”
- “Rojmelમાં આ entry કેવી રીતે રાખું?”
- “Grantનો balance કેટલો છે?”
- “Stationery purchaseનો હિસાબ ક્યાં રાખું?”
- “આ format જોઈએ.”
- “ધોરણ 6 માટે paper જોઈએ.”
- “બીજા teachers આ વિષય કેવી રીતે શીખવે છે?”

and get a practical answer or tool **without unnecessary typing, paperwork or cost**.

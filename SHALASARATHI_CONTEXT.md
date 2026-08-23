# ShalaSarathi — Project Context

> Persistent working context for the ShalaSarathi project. Read this file before making major changes.

## 1. Project Identity

**Project Name:** ShalaSarathi

**Target Users:**
- Government/private school teachers
- Schools
- School administrators
- Education community

**Core Vision:**

ShalaSarathi is intended to become a practical digital platform for teachers and schools, combining school management, teacher productivity tools, official/unofficial document templates, Patrak/document generation, AI-powered teaching tools, teacher-to-teacher networking, teaching resource sharing, community features, PDF/print workflows, cloud backup and synchronization, and mobile + desktop/web access.

The goal is to build on the existing approximately 70% completed product rather than restarting from zero.

## 2. Source of Truth

The current GitHub repository is the **primary source of truth for the actual codebase**.

Rules:
1. Do not recreate the application from scratch unless explicitly required.
2. Preserve existing working functionality.
3. Preserve the current UI wherever reasonably possible.
4. Improve backend, architecture, security and logic where necessary.
5. Make changes module-by-module.
6. Avoid large uncontrolled rewrites.
7. After every completed module: build, test, review changes, Git commit, GitHub push, and update this context file if project state changed.

## 3. Important Architecture Decision

Earlier there was confusion between Flutter and React.

### Current decision

If the existing Google AI Studio project is a **React/TypeScript project**, that project is the actual product foundation.

**Do NOT migrate to Flutter simply because Flutter was discussed earlier.**

The current React/TypeScript implementation should be preserved and developed further unless a future technical decision explicitly requires a different architecture.

## 4. Project Documentation

Maintain these files:

```text
PROJECT_PLAN.md
SHALASARATHI_CONTEXT.md
README.md
```

- `PROJECT_PLAN.md` = long-term product vision, roadmap and major phases.
- `SHALASARATHI_CONTEXT.md` = current state, decisions, business model, constraints, completed work, current work and next action.
- `README.md` = normal developer/project setup information.

## 5. Development Strategy

Do not develop the project as one giant AI-generated rewrite.

Preferred workflow:

```text
Audit
  ↓
Choose ONE module
  ↓
Understand existing implementation
  ↓
Implement
  ↓
Build
  ↓
Test
  ↓
Review diff
  ↓
Git commit
  ↓
GitHub push
  ↓
Update context
  ↓
Next module
```

AI tools can assist heavily, but generated code must be reviewed and tested.

## 6. Product Roadmap

### Phase 1 — Foundation

Priority:
1. Authentication
2. School account
3. Teacher account
4. Database persistence
5. Security
6. Backup
7. Cloud synchronization

### Phase 2 — Existing Modules

Make these production-ready:
1. Students
2. Rojmel
3. Grant
4. Purchase
5. PM POSHAN
6. Patrak
7. Letters / Certificates
8. Question Paper
9. Lesson Plan
10. Teacher Diary

Existing UI should be preserved where practical.

### Phase 3 — Teacher Community

Teacher networking:
- Search teachers
- View teacher profile
- Send connection request
- Accept/reject connection
- Connected teachers
- School membership
- Basic communication

Community:
- Real posts
- Upload resources
- Search
- Like
- Save
- Download
- Follow
- Groups
- Moderation
- Notifications

### Phase 4 — Template / PDF System

- Official samples
- Unofficial samples
- Template categorization
- Auto-fill
- School data integration
- Teacher data integration
- PDF generation
- Print
- Download
- Versioning

Clearly distinguish official government forms/templates from user-created, community and reference/sample documents.

## 7. Teacher-to-Teacher Strategy

Teacher networking is a **growth feature**, not a threat to monetization.

Basic networking can remain free:
- Search teacher
- Teacher profile
- Add/connect teacher
- Join school
- Basic resource sharing
- Basic communication

The purpose is to increase user retention, participation, resource sharing and user acquisition.

## 8. Monetization Strategy

Separate **free networking/basic functionality** from **paid productivity/advanced functionality**.

Potential premium features:
- AI Lesson Plan
- Advanced AI Question Paper
- Premium document/template packs
- Advanced school reports
- Extra cloud backup/storage
- Advanced School Management
- Premium teaching-resource collections
- Bulk PDF/document generation
- Advanced analytics
- Advanced school/team features
- Multi-device advanced synchronization

Teacher-to-teacher sharing should not automatically become a paid feature.

Example: Teacher A sharing a Patrak/resource with Teacher B can be free. School data → official-style template → auto-fill → professional PDF → one-click generation can be a premium productivity feature.

## 9. AI Features

Potential AI features:
- Lesson Plan generation
- Question Paper generation
- Worksheet generation
- Activity generation
- Teaching ideas
- Resource summaries
- Document assistance
- Report assistance

AI output must not automatically be treated as authoritative.

## 10. Google AI Studio Strategy

Google AI Studio can be used for:
- React/TypeScript UI development
- New screens
- Responsive UI
- Forms
- Teacher profile
- Teacher Connect UI
- School UI
- Dashboard
- Community UI
- Search/filter interfaces
- AI integrations
- Firebase integration code
- Data model assistance
- API/server code

Do not ask AI Studio to rewrite the entire existing application unless explicitly intended.

Preferred scope prompt:

```text
Audit the existing ShalaSarathi repository.
Do not rewrite or remove existing working modules.
Implement only [ONE FEATURE].
Preserve the existing UI and architecture wherever possible.
Show the files changed and explain the implementation.
Do not break existing functionality.
```

## 11. Antigravity Strategy

Use Antigravity for systematic repository-level development and verification:
- Repository audit
- Architecture analysis
- Code inspection
- Feature implementation
- Refactoring
- Build
- Test
- Debugging
- Browser verification
- Regression checking
- Git workflow

Use one feature/module at a time.

## 12. Database Direction

Exact database architecture must be determined from the current repository before implementation.

Potential logical entities include:

```text
User
Teacher
School
SchoolMember
Connection
ConnectionRequest
Post
Comment
Like
SavedResource
Resource
Group
Notification
Template
Document
Student
Rojmel
Grant
Purchase
PMPOSHAN
Patrak
Letter
Certificate
QuestionPaper
LessonPlan
TeacherDiary
```

Do not create all entities immediately. Implement only what the current module requires.

## 13. Security Principles

Phase 1 priority:
- Authentication
- Authorization
- Role-based access
- School-level data isolation
- Teacher-level permissions
- Secure database rules
- Input validation
- File upload validation
- Never expose sensitive credentials
- Never put secret API keys in client-side code
- Secure AI/API access
- Proper session handling

A logged-in teacher must not automatically be able to read another school's private data.

## 14. Backup and Sync

Long-term direction:

```text
Local / Client Data
       ↓
Sync Layer
       ↓
Cloud Database
       ↓
Backup
```

Offline support should be designed carefully rather than added as an afterthought.

## 15. Mobile + Desktop Strategy

The product should work well across mobile, tablet, desktop and web.

UI should be responsive. Existing UI should be preserved where possible. Avoid duplicate business logic implementations.

## 16. UI Preservation Rule

Preserve existing navigation, visual identity, useful screens, workflows and components where practical.

Change only when necessary for broken UX, missing functionality, security, architecture limitations, responsive problems, accessibility or production-readiness.

Avoid redesigning everything merely because an AI tool can generate a new design.

## 17. Official Patrak Strategy

Official school forms/patraks are an important feature area.

Before implementing an "official" template:
1. Verify the source.
2. Prefer official government/department sources.
3. Preserve important fields/layout where legally and technically appropriate.
4. Track source/version/date where possible.
5. Clearly label unofficial/community-created samples.

Do not blindly copy random internet templates and label them official.

## 18. Recommended Development Order

```text
1. Repository audit
2. Architecture confirmation
3. Authentication
4. Teacher account
5. School account
6. Database persistence
7. Security rules
8. Backup/sync
9. Students
10. Rojmel
11. Grant
12. Purchase
13. PM POSHAN
14. Patrak
15. Letters/Certificates
16. Question Paper
17. Lesson Plan
18. Teacher Diary
19. Teacher Connect
20. Community
21. Template/PDF system
22. Advanced AI features
23. Monetization
24. Production hardening
```

This order may change after repository audit.

## 19. Current Status

**Status:** Existing project approximately 70% developed.

**Important:** Do not assume the module list above accurately describes what is already implemented. Before implementing anything, inspect the repository, package/config files, routes/pages, components, backend/Firebase/database setup, authentication, existing modules, build status and test status. Compare implementation against `PROJECT_PLAN.md`.

## 20. Current Work Rule

At the start of a development session determine:

```text
CURRENT MODULE:
CURRENT IMPLEMENTATION:
CURRENT PROBLEM:
FILES INVOLVED:
EXPECTED RESULT:
TEST METHOD:
NEXT STEP:
```

Never assume a feature is missing without checking the repository.

## 21. AI Tool Handoff Protocol

When moving between ChatGPT, Google AI Studio and Antigravity:

1. Read `PROJECT_PLAN.md`.
2. Read `SHALASARATHI_CONTEXT.md`.
3. Inspect the actual code.
4. Make changes.
5. Build/test.
6. Update `SHALASARATHI_CONTEXT.md` with what changed, what was tested, what remains and the next recommended task.

## 22. Git Workflow

After a meaningful completed change:

```text
git status
↓
review diff
↓
build/test
↓
git add
↓
git commit
↓
git push
```

Use descriptive commit messages such as:

```text
feat: add teacher authentication
feat: add teacher connection requests
feat: implement school membership
fix: improve patrak validation
feat: add PDF generation
```

Do not use vague messages like `update`, `changes`, `final`, `new`, or `test`.

## 23. DON'Ts

Do NOT:
- Restart the project unnecessarily.
- Replace working code just for stylistic reasons.
- Migrate technologies without architectural justification.
- Delete existing modules without approval.
- Expose API secrets.
- Trust AI-generated security rules without review.
- Call unofficial documents official.
- Make all useful features paid.
- Make teacher networking unnecessarily restrictive.
- Implement the entire roadmap in one AI prompt.
- Push untested code.
- Change multiple unrelated modules in one step.

## 24. Current Session State

```text
LAST COMPLETED:
Initial project context file created in GitHub.

CURRENTLY WORKING ON:
Establishing persistent project context and preparing for systematic repository audit.

BLOCKERS:
No blocker identified yet.

FILES CHANGED:
SHALASARATHI_CONTEXT.md

TEST STATUS:
No application code changed in this context-file commit.

GIT COMMIT:
Created by GitHub Contents API.

GITHUB STATUS:
Context file added to the default `main` branch.

NEXT ACTION:
Audit the actual GitHub repository and compare the current implementation with PROJECT_PLAN.md before implementing Phase 1.
```

## 25. New ChatGPT Session Prompt

```text
We are continuing the ShalaSarathi project.

The GitHub repository is the source of truth.

First read:
- PROJECT_PLAN.md
- SHALASARATHI_CONTEXT.md

Then inspect the current repository state before suggesting changes.

Do not restart the project.
Do not migrate architecture without a specific reason.
Preserve existing working functionality and UI.

Tell me:
1. Current project state
2. What has already been implemented
3. What is currently incomplete
4. The safest next module to implement
5. The exact next action
```

## 26. New Antigravity Session Prompt

```text
You are working on the existing ShalaSarathi repository.

Before changing code, read:
- PROJECT_PLAN.md
- SHALASARATHI_CONTEXT.md

The GitHub repository is the source of truth.

Do not rebuild the project from scratch.
Do not migrate React/TypeScript to Flutter unless explicitly instructed.
Preserve existing working UI and functionality.

First audit the current implementation and compare it with the project plan.

Then identify the highest-priority incomplete Phase-1 item.

Implement only one focused module at a time.

After implementation:
1. Build the project.
2. Run relevant tests.
3. Check for regressions.
4. Review the changed files.
5. Report what changed.
6. Prepare a Git commit.
7. Push to GitHub only after verification.
8. Update SHALASARATHI_CONTEXT.md.
```

## 27. Golden Rule

> **Build on what already exists. Verify before changing. Change one module at a time. Test before committing. Keep GitHub as the source of truth.**

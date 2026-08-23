# ShalaSarathi — Product Discussion & Final Architecture Notes

## 1. Product Vision

ShalaSarathi is a Gujarati-first, offline-first digital platform for Gujarat primary school teachers, subject teachers and Principals/HTAT.

### Core positioning

> **ShalaSarathi — શિક્ષકોનું પોતાનું Community**

> **“શિક્ષકનું કામ સરળ બનાવવાનું, શિક્ષણ માટે સમય બચાવવાનું.”**

The product has three layers:

1. **Teacher Community** — teachers share and discover useful material.
2. **School Work Assistant** — reduce repetitive paperwork such as Patrak, Rojmel, grants, purchases, letters, certificates and registers.
3. **Teaching Tools** — question papers, question bank, worksheets, lesson planning and activities.

### Core mission

> **Teacherને paperworkમાંથી મુક્ત કરીને શિક્ષણ માટે વધુ સમય આપવો.**

Basic teacher utility should remain free wherever practical.

---

# 2. Teacher Community — Main Product

Every teacher gets an individual account.

Teachers can share:

- Question papers
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

Community actions:

- View
- Like
- Save
- Download
- Copy to My Resources
- Share
- Report

Community loop:

Teacher joins → finds useful resource → uses it → creates/shares resource → other teachers use it → community grows.

The community is the primary reason to return to the app.

---

# 3. Teacher Accounts & Roles

Each teacher has a separate login/account even when multiple teachers belong to the same school.

### Roles

- Teacher
- Principal / HTAT
- Moderator
- Admin
- Super Admin

### Teacher profile

- Name
- Profile photo
- School
- District
- Taluka
- Standards
- Subjects
- Role
- Experience (optional)
- Contributions

### School profile

Entered once:

- School Name
- UDISE Code
- Village
- Taluka
- District
- Address
- Principal/Acharya
- Logo
- Signature

This data should automatically populate:

- Patrak
- Letterhead
- Certificates
- Rojmel
- Reports
- School documents

---

# 4. Main Teacher Work Assistant

## Patrak

Goal:

> **Teacherએ એક જ માહિતી વારંવાર type ન કરવી પડે.**

Flow:

Patrak → Class → Student Data → Auto Fill → Review → PDF → Print/Share

Student information should be reusable across multiple Patrak and reports.

## Rojmel

Digital cash book.

Formula:

`Closing Balance = Opening Balance + Receipts - Expenses`

Grant-wise heads can include:

- Composite School Grant
- Sports
- Swachhata
- TLM
- Other applicable heads

Financial entries must be audit-friendly. Never silently delete a transaction; use reversal/void with reason.

## Grant Management

Dashboard example:

- Composite Grant
- Sports
- Swachhata
- TLM

Show:

- Opening balance
- Receipts
- Expenses
- Current balance
- Transaction history

## Purchase / Stationery

Fields:

- Date
- Item
- Quantity
- Rate
- Total
- Grant head
- Vendor
- Bill No.
- Remarks

Formula:

`Total = Quantity × Rate`

Purchase can be linked to Rojmel expense automatically.

## Bill / Voucher

Generate printable:

- School name
- Date
- Item
- Amount
- Grant head
- Vendor
- Bill/reference number
- Signature/seal

## Letters & Certificates

Use reusable templates and school profile placeholders.

## PM Poshan

Daily/monthly calculations with configurable, effective-date government rates.

Example:

`Daily Grain = Eligible Students × Applicable Government Grain Rate`

Government-controlled rates should not be hard-coded permanently.

## Registers

- Dead Stock
- SMC
- Other applicable registers

---

# 5. Teaching Tools

Question Paper Generator is a major tool, but NOT the brand identity.

Flow:

Standard → Subject → Medium → Exam → Chapters → Blueprint → Generate → Edit → Preview → PDF

Question types:

- MCQ
- True/False
- Fill in the blank
- Very short
- Short
- Long
- Match the following

Community Question Bank should allow teachers to reuse questions.

---

# 6. Admin-Driven Architecture

The complete app should be **Admin Driven**.

Admin Panel must control:

- Splash screen
- Home banners
- Cards
- Card order
- Card visibility
- Theme
- Colors
- Layout
- Advertisements
- Community categories
- Patrak templates
- Documents
- Paripatra
- Notifications
- Feature flags
- Free/Paid status
- Feature access
- Prices
- Packs
- Subscriptions
- User roles
- Permissions
- Limits
- Featured content
- Moderation

### Core principle

> **Change configuration/content without requiring a Flutter app update.**

---

# 7. Dynamic Home Cards

Admin should be able to configure:

- Title
- Gujarati title
- Icon
- Image
- Color
- Order
- Visibility
- Action
- Target screen
- Target role

Example cards:

- Community
- Patrak
- Rojmel
- Grant
- Question Paper
- PM Poshan
- Letters
- Certificates

Question Paper should not visually dominate the home screen because Community is the primary identity.

---

# 8. Dynamic Theme

Admin can configure:

- Primary color
- Secondary color
- Background
- Card color
- Text color
- Button style
- Border radius
- Font
- Dark mode

Theme changes should be remotely configurable.

---

# 9. Dynamic Banner

Admin fields:

- Banner name
- Image
- Title
- Description
- Button text
- Button action
- Start date
- End date
- Target screen
- Priority
- Active/inactive

---

# 10. Advertisement Manager

Admin controls:

- Ad type
- Banner
- Native
- Interstitial
- Promotional
- Position
- Frequency
- Start/end date
- Image
- Link
- Target screen
- Priority
- Enable/disable

Important product rule:

Ads should not interrupt critical teacher work unnecessarily.

Avoid aggressive ads during:

- Patrak entry
- Rojmel entry
- Student data entry
- PDF generation

Possible placements:

- Home banner
- Community native placement
- Optional rewarded convenience actions

---

# 11. Dynamic Splash Screen

Admin can manage:

- Splash logo
- Background
- Tagline
- Animation
- Duration
- Version
- Active dates

Example tagline:

> “શિક્ષકનું કામ સરળ બનાવવાનું, શિક્ષણ માટે સમય બચાવવાનું.”

---

# 12. Dynamic Patrak Template Engine

Admin can create/update Patrak templates without app updates.

Template fields:

- Template ID
- Name
- Category
- Description
- Required fields
- Auto-filled fields
- Optional fields
- Tables
- Header/footer
- A4 settings
- Version
- Free/Premium status

Placeholders:

`{{school_name}}`
`{{school_address}}`
`{{acharya_name}}`
`{{udise_code}}`
`{{academic_year}}`
`{{date}}`
`{{reference_no}}`
`{{student_name}}`
`{{standard}}`

---

# 13. Feature Flags

Admin can turn features ON/OFF.

Example:

- Teacher Community — ON
- Patrak — ON
- Rojmel — ON
- Grant — ON
- Question Paper — ON
- PM Poshan — OFF
- Creative Tools — ON
- Paripatra — ON

Features under development can remain hidden without app release.

---

# 14. Access Control — Free/Paid/Role/Permission

The system must NOT simply use `isPremium = true`.

Use a proper entitlement/permission system.

Four concepts:

1. **Visibility** — feature દેખાય કે નહીં
2. **Access** — user feature વાપરી શકે કે નહીં
3. **Plan** — Free / Feature Pack / Subscription / Custom
4. **Permission** — Teacher / Principal / Moderator / Admin

### Example

Basic Patrak:
- Free
- Teacher + Principal

Bulk Patrak:
- Premium
- Teacher + Principal

Advanced Rojmel:
- Premium
- Principal

Moderation:
- Moderator + Admin

---

# 15. Monetization — Final Decision

We will use BOTH:

## A. Feature-wise Packs

Teacher can purchase only the feature they need.

Examples:

- Patrak Pack
- Rojmel Pack
- Question Paper Pack
- Grant Pack
- Bulk Generation Pack
- Documents Pack

Each pack is fully configurable by Admin.

Admin can define:

- Price
- Duration unit: Days / Months / Years / Lifetime
- Duration value
- Usage limit
- Number of templates
- Number of generations
- Feature
- Roles
- Ads behavior
- Status

### Example

**₹199 → 1 Year → 50 Patrak Templates**

**₹299 → 2 Years → 100 Patrak Templates**

Important: We can define whether the limit means:
- Number of generations
- Number of templates
- Unlimited

Recommended for Patrak:

> **₹199 / 1 Year / 50 Templates = unlock 50 templates; do not unnecessarily deduct usage every time a teacher prints the unlocked template.**

Other examples:

- Question Paper: ₹199 → 1 Year → 50 Papers
- Advanced Rojmel: ₹149 → 1 Year
- Letter/Certificate Pro: ₹99 → 1 Year
- Bulk Patrak: ₹299 → 1 Year

## B. All-App Subscription

For teachers who want all premium features.

Example:

**ShalaSarathi Pro — ₹499/year**

Potential inclusions:

- Full Community
- All Patrak
- Advanced Rojmel
- Grant Management
- Purchase Management
- Question Paper Pro
- Letters
- Certificates
- Bulk Generation
- Creative Tools
- Ad-free experience
- Cloud backup
- Premium templates

Possible durations:

- Monthly
- Yearly
- Other Admin-configurable periods

Auto-renewal can be supported for subscription products.

---

# 16. User Can Have Multiple Entitlements

A user may have:

- Free access
- All-App subscription
- Feature Pack
- Lifetime Feature Pack
- Special Admin access

Example:

Teacher has:

`All-App Pro → expires 22 Aug 2027`

and also:

`Patrak Lifetime Pack`

When subscription expires, Patrak Lifetime access remains active.

Therefore access must be feature-level.

---

# 17. Special Access

Admin can grant a specific user:

- Free Pro access
- Lifetime feature
- Temporary access
- Beta access
- Ambassador access
- District pilot access
- Custom feature access

Example:

Teacher XYZ:

- Advanced Question Paper — Free until 31-12-2027
- Bulk Patrak — Lifetime
- Ads-free — 1 year

---

# 18. Coupons & Promotional Access

Future support:

- Coupons
- Referral codes
- Teacher Ambassador
- Beta Tester
- District Pilot
- School Pilot

Example:

`AHMEDABAD2027 → 6 months Pro`

---

# 19. Admin Monetization Panel

Recommended structure:

```text
MONETIZATION
├── All-App Subscriptions
│   ├── Monthly
│   ├── Yearly
│   └── Custom
├── Feature Packs
│   ├── Patrak
│   ├── Rojmel
│   ├── Question Paper
│   ├── Grant
│   ├── Documents
│   └── Other
├── Coupons
├── Free Access
├── User Entitlements
└── Transactions
```

---

# 20. Admin Panel Main Sections

```text
SHALASARTHI ADMIN
│
├── Dashboard
├── Teachers
├── Schools
├── Community
│   ├── Posts
│   ├── Reports
│   └── Moderation
├── Features
├── Permissions
├── Feature Packs
├── Subscriptions
├── Patrak
├── Question Papers
├── Rojmel
├── Grants
├── Banners
├── Advertisements
├── Themes
├── Notifications
├── Documents
├── Reports
└── Settings
```

---

# 21. Admin Dashboard

Show:

- Total Teachers
- Active Today
- Community Posts
- Documents
- Patrak Generated
- Papers Generated
- Recent Reports
- Recent Posts
- System Status

---

# 22. Cloud + Offline Architecture

Final decision:

> **Cloud-first + Offline-first**

Not 100% cloud-only.

## Cloud

Store:

- Teacher accounts
- Roles
- Permissions
- Community
- Community posts
- Likes/saves/reports
- Public resources
- Patrak templates
- Banners
- Themes
- Ads
- Feature flags
- Prices
- Packs
- Subscriptions
- Purchases
- Entitlements
- Documents
- Notifications

## Local on teacher device

Keep work data locally first:

- Students
- School information
- Rojmel
- Grant entries
- Purchase records
- Lesson plans
- Draft documents
- Generated PDFs

Internet available → sync/backup as configured.

Offline → teacher can still do core work.

---

# 23. VPS Decision

Final production infrastructure should be **VPS-based**, but not necessarily everything on one VPS.

Recommended:

```text
Internet
   │
   ├── Flutter App
   └── Admin Panel
          │
         API
          │
     VPS / Cloud Server
       ├── Backend/API
       ├── PostgreSQL
       ├── Redis/Cache
       └── Background Jobs
          │
          └── Object Storage
              ├── PDFs
              ├── Images
              ├── Banners
              └── Community files
```

### Why not one VPS for everything?

If users grow, separate:

- Database
- API servers
- Object storage
- Background workers

so scaling is easier.

Starting small, one good VPS can host:

- Backend
- Admin Panel
- PostgreSQL

Then scale later.

---

# 24. GitHub vs Cloud

GitHub stores **source code**.

Cloud/VPS stores **live application data**.

```text
GitHub
  ↓
Source Code

Cloud/VPS
  ↓
Users
Database
Community
Files
Payments
Settings

Flutter App
  ↓
Local DB + Cloud Sync
```

GitHub should NOT be used as the live database.

---

# 25. Recommended Tech Stack

## Mobile

- Flutter
- Dart
- Material 3
- Riverpod
- SQLite + Drift

## Admin

- Next.js
- TypeScript
- Tailwind
- shadcn/ui

## Backend

- API-based architecture
- PostgreSQL
- Redis/cache where useful

## Storage

- Object storage for PDFs/images/files

## Notifications / monitoring

- Firebase Cloud Messaging
- Firebase Crashlytics
- Firebase Analytics
- Firebase Remote Config where appropriate

## Payments

- Google Play Billing for Android purchases/subscriptions
- Backend webhook/verification system

---

# 26. Security

Production system must include:

- HTTPS/SSL
- Firewall
- SSH keys
- Private database access
- Automated backups
- Daily database backup
- Object-storage backup
- Admin 2FA
- Rate limiting
- API authentication
- Audit logs
- Payment verification
- Role-based permissions

Modified APKs must not be able to unlock paid features simply by changing local UI state.

Backend must verify:

`CanUserAccess(user, feature)`

before protected operations.

---

# 27. Data Privacy

Private school/student data must remain separate from public community data.

Principles:

- Collect only required information.
- Do not upload student data just to use Community.
- Do not automatically expose student information in community posts.
- Protect backups.
- Provide appropriate delete/export controls.
- Keep financial records auditable.

---

# 28. Final Product Navigation

Recommended bottom navigation:

`Home | Community | Create | My Work | Profile`

## Home

- Dynamic banner
- Dynamic cards
- Quick actions
- Community highlights
- Recent work

## Community

- Feed
- Search
- Categories
- Filters
- Featured content

## Create

- Question Paper
- Question
- Worksheet
- Patrak
- Letter
- Certificate
- Resource/Post

## My Work

- My Questions
- My Papers
- Saved Resources
- Patrak history
- Rojmel
- Purchases
- Generated Documents

## Profile

- Teacher profile
- School profile
- Contributions
- Purchases
- Subscriptions
- Settings

---

# 29. Development Order — Final

The development should NOT start by immediately coding every utility.

## Phase 0 — Platform Foundation

1. Repository structure
2. Backend architecture
3. Database schema
4. Admin authentication
5. Admin roles
6. Dynamic configuration
7. Theme engine
8. Dynamic cards
9. Banner engine
10. Advertisement manager
11. Feature flags
12. Permissions
13. Feature packs
14. Subscription/entitlement system

## Phase 1 — Teacher App Foundation

1. Flutter project
2. Gujarati design system
3. Splash
4. Login
5. Teacher profile
6. School profile
7. Local database
8. Dynamic Home
9. Sync layer

## Phase 2 — Teacher Community

1. Community feed
2. Post/resource creation
3. Search
4. Categories
5. Save
6. Download
7. Like
8. Report
9. Moderation
10. Featured posts

## Phase 3 — Teacher Work Assistant

1. Student database
2. Patrak
3. Letterhead
4. Certificates
5. Rojmel
6. Grant
7. Purchase/stationery
8. PM Poshan
9. Registers
10. PDF generation

## Phase 4 — Teaching Tools

1. Question Bank
2. Question Paper
3. Answer Key
4. Worksheets
5. Lesson planning
6. Activities

## Phase 5 — Scale

1. Notifications
2. Analytics
3. Crash monitoring
4. Payment production integration
5. Coupons
6. Advanced community
7. Backup/sync
8. Performance/security hardening
9. VPS scaling
10. Play Store release

---

# 30. Product Rules

1. Teacher Community is the product identity.
2. Question Paper Generator is a major tool, not the brand identity.
3. Basic teacher paperwork relief should remain free wherever practical.
4. Feature-wise paid packs are supported.
5. All-App subscription is also supported.
6. Lifetime access can exist for selected features.
7. User entitlements are feature-level.
8. Admin controls price, duration, limits, roles and access.
9. School/student data is separate from public community data.
10. Core work must remain offline-capable.
11. Cloud handles community, accounts, configuration and sync.
12. Financial records are auditable.
13. Government-controlled formats/rates must be versioned/configurable.
14. Ads should not disrupt essential teacher work.
15. Admin should be able to change content/configuration without requiring an app update wherever technically safe.
16. Backend must enforce paid access; hiding buttons in Flutter is not sufficient.
17. GitHub stores source code; VPS/cloud stores production data.
18. VPS-based production is preferred, with external object storage and future scalability.

---

# 31. North Star

> ## **“શિક્ષકનું કામ સરળ બનાવવાનું, શિક્ષણ માટે સમય બચાવવાનું.”**

ShalaSarathi should become the platform a Gujarat teacher opens when thinking:

- “આ Patrak ક્યાંથી મળશે?”
- “Rojmelમાં આ entry કેવી રીતે રાખું?”
- “Grantનો balance કેટલો છે?”
- “Stationeryનો હિસાબ ક્યાં રાખું?”
- “આ format જોઈએ.”
- “ધોરણ 6 માટે paper જોઈએ.”
- “બીજા teachers આ વિષય કેવી રીતે શીખવે છે?”

The desired experience:

> **Less typing + Less paperwork + More sharing + More teaching time.**

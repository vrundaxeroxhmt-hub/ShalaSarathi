# ShalaSarathi — School Letter & Patrak Generator

## 1. Project Vision

ShalaSarathi is a Gujarati-first school administration web app that lets a school enter its core information once and reuse that information across letters, orders, certificates, notices, and government/school patrak templates.

**Core promise:** enter school details once → select a document template → fill only the document-specific fields → preview → save → print/download PDF.

## 2. School Profile

The school profile is the single source of truth for reusable information.

### Auto-fill fields
- School name
- School address
- Village/City
- Taluka
- District
- UDISE code
- School index number (if applicable)
- Acharya/Principal name
- Contact number
- Email
- Academic year
- School logo
- Acharya signature/seal
- Other configurable official details

The profile must support Add, Edit, Save, Preview and Upload Logo/Signature.

## 3. Dashboard

Recommended dashboard cards:

1. School Profile
2. Letters
3. Patrak
4. Certificates
5. Notices / Orders
6. Templates
7. Recent Documents
8. Search Documents
9. Settings

Dashboard should show quick actions such as **Create Letter**, **Create Patrak**, **Create Certificate**, and **View Recent Documents**.

## 4. Letter Generator

Flow:

`Choose Letter → Fill Fields → Live Preview → Save → PDF / Print`

Each template uses reusable placeholders such as:

- `{{school_name}}`
- `{{school_address}}`
- `{{acharya_name}}`
- `{{udise_code}}`
- `{{academic_year}}`
- `{{date}}`
- `{{reference_no}}`
- document-specific fields

The system automatically replaces profile placeholders with saved school data.

## 5. Patrak Generator

Patrak should be organized by categories and searchable by name/keyword.

Potential categories:
- Student records
- Teacher / Staff records
- Attendance
- Enrollment
- Scholarship
- Result / Examination
- Infrastructure
- School information
- Administrative reports
- Government department reports

Every patrak should define its required fields, auto-filled fields, table columns, calculations (if any), print layout and PDF output.

## 6. Document Preview

Use an A4-style preview with:

- School header/logo
- School and Acharya details
- Document title
- Reference/date fields
- Main content or table
- Signature/seal area
- Footer where required

Actions:
- Edit
- Save
- Download PDF
- Print
- Duplicate

## 7. Document History

Store generated documents with:
- Document type
- Template name
- Created date/time
- Academic year
- Reference number
- Created by user
- Status

Provide search, filter, open, duplicate and print/download actions.

## 8. Template System

Templates should be data-driven instead of hard-coded wherever practical.

Each template should define:
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

This will allow new letters/patraks to be added without redesigning the whole application.

## 9. Suggested Technical Architecture

Recommended stack for the web application:
- Next.js / React
- TypeScript
- Tailwind CSS
- Component-based UI
- PostgreSQL or another relational database
- Server-side PDF generation
- Authentication and role-based access

Keep school profile data, templates, generated documents and users separate in the data model.

## 10. Suggested Database Entities

- `schools`
- `users`
- `school_users`
- `school_profiles`
- `document_templates`
- `template_fields`
- `generated_documents`
- `document_values`
- `academic_years`
- `assets` (logo/signature)

## 11. UX / Design Direction

The interface should feel like a modern, trustworthy education-office application rather than a generic admin panel.

### Principles
- Gujarati-first copy with optional English labels
- Clean dashboard cards
- Large readable typography
- Simple navigation for school office staff
- Minimal clicks to generate a document
- Clear A4 preview
- Strong print/PDF experience
- Responsive desktop/tablet/mobile layouts
- Accessible forms and validation

### Primary navigation
`Dashboard | School Profile | Letters | Patrak | Certificates | Templates | History | Settings`

## 12. MVP Scope

Phase 1 should include:
1. Login/authentication
2. School profile
3. Dashboard
4. Letter template engine
5. Initial letter templates
6. Patrak template engine
7. Initial patrak templates
8. Live A4 preview
9. PDF generation
10. Print
11. Document history

## 13. Phase 2

- More government/school templates
- Bulk generation
- Student/staff master data
- Excel import/export
- Advanced search
- Template management UI
- Multiple school support

## 14. Phase 3

- Digital signatures
- Approval workflow
- Role-based permissions
- Analytics
- Notifications
- Mobile/PWA support
- Backup/export tools

## 15. First Design Screens to Build

1. Login
2. Dashboard
3. School Profile
4. Letter Template Selection
5. Letter Form + Live A4 Preview
6. Patrak Template Selection
7. Patrak Form + Live A4 Preview
8. Document History
9. Template Management
10. Settings

## 16. Important Product Rule

Do not hard-code the school name, Acharya name, address or similar reusable values into individual documents. They must come from the school profile and be injected into templates automatically.

This keeps the system maintainable and makes changing a school's information a one-time operation.

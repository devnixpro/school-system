# DevNixEdu — MongoDB Backend

Node.js + Express + MongoDB API for the supplied Next.js frontend.

## Run locally

1. Install Node.js 18+ and MongoDB.
2. In `backend/`, run `npm install`, copy `.env.example` to `.env`, and set a strong `JWT_SECRET` and your `MONGO_URI`.
3. Start MongoDB, then run `npm run dev` from `backend/`. API: `http://localhost:5000`; health check: `GET /`.
4. In `frontend/`, run `npm install`, copy `.env.example` to `.env.local`, then run `npm run dev`.

To verify the parent login and dashboard APIs, run `npm run test:parent-e2e` from `backend/` while local MongoDB is running. The test refuses non-local MongoDB hosts and uses a uniquely named temporary database that it drops when finished; it does not modify the configured application database.

## Parent dashboard handover

- The parent portal is connected to the backend for login, linked children, attendance, fees, results, homework, timetable, and parent notices. Parent access to student records is read-only.
- Browser verification passed on desktop and a 390px mobile viewport using fictional records in an isolated local database. No real student or production data was used.
- Frontend checks passed: `npm run lint` and `npm run build`, run from `frontend/`. The isolated API journey can be checked with `npm run test:parent-e2e` from `backend/`.
- Parent settings and support do not currently have backend endpoints. Payment processing is maintained separately and was not changed as part of this parent portal work.
- For a handover or deployment, configure the recipient's own `.env` and `.env.local` values; do not share local secrets or use demo test credentials.

## First-time setup

Create the platform superadmin once:

From `backend/`, create the first platform superadmin in PowerShell:

```powershell
$env:SUPERADMIN_NAME = "Platform Admin"
$env:SUPERADMIN_EMAIL = "admin@example.com"
$env:SUPERADMIN_PASSWORD = "Use-A-Unique-Password"
npm run create-superadmin
```

Sign in as the superadmin, then create schools using `POST /api/superadmin/schools`. A school owner can also create a school and its admin account from the existing register form (`POST /api/auth/register` with `schoolName`).

If you already have legacy records from the old backend, assign them to the correct school once before using the new school-scoped APIs. From `backend/`, set `MIGRATION_SCHOOL_ID` to that school's MongoDB ObjectId and run `npm run migrate-legacy-school`. This updates only records whose `school` field is missing.

Every protected endpoint requires `Authorization: Bearer <token>`. Normal users are scoped to their school. Do not use the example JWT secret in production.

## API endpoints

| Method | Endpoint | Purpose | Access |
|---|---|---|---|
| POST | `/api/auth/register` | Create school admin with `schoolName`, or student/parent with `schoolId` and `role` | Public |
| POST | `/api/auth/login` | Login; returns JWT | Public |
| GET | `/api/auth/me` | Current profile | Auth |
| GET/POST | `/api/students` | List/create students | Auth / Admin |
| GET/PUT/DELETE | `/api/students/:id` | Student details/update/delete | Auth / Admin |
| GET/POST | `/api/teachers` | List/create teachers | Auth / Admin |
| GET/PUT/DELETE | `/api/teachers/:id` | Teacher details/update/delete | Auth / Admin |
| GET/POST/PUT | `/api/attendance` | Attendance list, individual mark, class batch save/update | Auth / Teacher or Admin for writes |
| GET | `/api/attendance/summary/:studentId` | Student attendance summary | Auth (student restricted to self) |
| GET/POST/PUT/DELETE | `/api/classes` and `/api/classes/:id` | Class management | Admin |
| GET/POST/PUT/DELETE | `/api/notices` and `/api/notices/:id` | Notice board | Auth / Admin or Teacher for writes |
| GET/POST/PUT/DELETE | `/api/timetable` and `/api/timetable/:id` | Timetable | Auth / Admin or Teacher for writes |
| GET/POST/PUT/DELETE | `/api/fees` and `/api/fees/:id` | Invoices and payment updates | Auth / Admin for writes |
| POST | `/api/fees/bulk` | Generate invoices for `studentIds` | Admin |
| PUT | `/api/fees/:id/pay` | Record full/partial payment | Admin |
| GET | `/api/fees/analytics/summary`, `/monthly`, `/by-type` | Fee analytics | Admin |
| GET | `/api/fees/:id/receipt` | Printable receipt (JWT query token supported for browser open) | Auth; own invoice for student/parent |
| GET/POST/PUT/DELETE | `/api/exams` and `/api/exams/:id` | Exam schedule CRUD | Auth / Admin for writes |
| PUT | `/api/exams/:id/result` | Publish an individual student's marks: `{studentId, obtainedMarks, grade?}` | Admin / Teacher |
| GET/POST/PUT/DELETE | `/api/homework` and `/api/homework/:id` | Homework CRUD; optional `file` upload | Auth / Admin or Teacher for writes |
| POST | `/api/homework/:id/submit` | Student homework submission | Student |
| GET | `/api/parent/children` | Parent's linked children | Parent |
| GET | `/api/parent/children/:childId/summary` | Child summary | Parent |
| GET | `/api/parent/children/:childId/attendance?month=YYYY-MM` | Monthly attendance | Parent |
| GET | `/api/parent/children/:childId/results` | Published results | Parent |
| GET | `/api/parent/children/:childId/fees` | Child invoices and totals | Parent |
| GET | `/api/parent/children/:childId/homework` | Child homework | Parent |
| GET/POST/PUT/DELETE | `/api/superadmin/...` | Platform/school management | Superadmin |

### Parent account linking

Create a parent account using `POST /api/auth/register` with `{ "name", "email", "password", "schoolId", "role":"parent" }`. Set the matching `guardianEmail` on each student record (or add the parent user ID to `parentUsers`). The parent can then access only those linked students.

### Important frontend integration notes

- Exam result publishing is per student. The result modal now loads the selected exam class's students and sends `studentId` with the marks.
- The active `/parent` dashboard uses the parent endpoints above for linked children, attendance, fees, results, homework, timetable, and parent-facing school notices. The payment system is maintained separately; this project update does not replace or modify it. Settings and support workflows are not provided by the current backend. `frontend/src/components/ParentPortal.jsx` is a legacy demo component; the active route uses `frontend/components/parent-portal/ParentPortal.jsx`.
- Homework uploads accept PDF, DOC, DOCX, JPG and PNG files up to 10 MB; files are served from `/uploads`.

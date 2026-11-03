# 🏫 School Management System

A **RESTful API** for managing school operations — students, teachers, attendance, and authentication — built with **Node.js**, **Express**, and **MongoDB**.

## 📁 Project Structure

```
school-system/
├── src/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js      # Register, Login, Profile
│   │   ├── studentController.js   # Student CRUD
│   │   ├── teacherController.js   # Teacher CRUD
│   │   └── attendanceController.js# Attendance management
│   ├── middleware/
│   │   ├── auth.js                # JWT auth + RBAC
│   │   └── errorHandler.js        # Global error handler
│   ├── models/
│   │   ├── User.js                # User model (auth)
│   │   ├── Student.js             # Student model
│   │   ├── Teacher.js             # Teacher model
│   │   └── Attendance.js          # Attendance model
│   ├── routes/
│   │   ├── authRoutes.js          # /api/auth
│   │   ├── studentRoutes.js       # /api/students
│   │   ├── teacherRoutes.js       # /api/teachers
│   │   └── attendanceRoutes.js    # /api/attendance
│   ├── app.js                     # Express app setup
│   └── server.js                  # Server entry point
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## ⚙️ Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/hafizshayanahmed1995/school-system.git
cd school-system
git checkout shayan
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
```bash
cp .env.example .env
```
Edit `.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/school_system
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development
```

### 4. Start the server
```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

---

## 🔌 API Endpoints

### 🔐 Authentication — `/api/auth`

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login & get JWT token | Public |
| GET | `/api/auth/me` | Get logged-in user profile | Private |

### 👨‍🎓 Students — `/api/students`

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/students` | Register new student | Admin |
| GET | `/api/students` | Get all students (+ search/filter/pagination) | Private |
| GET | `/api/students/:id` | Get student by ID | Private |
| PUT | `/api/students/:id` | Update student | Admin |
| DELETE | `/api/students/:id` | Delete student | Admin |

**Query Params for GET /api/students:**
- `search` — search by name, email, or roll number
- `class` — filter by class
- `section` — filter by section
- `isActive` — filter active/inactive students
- `page` — page number (default: 1)
- `limit` — results per page (default: 10)

### 👨‍🏫 Teachers — `/api/teachers`

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/teachers` | Add new teacher | Admin |
| GET | `/api/teachers` | Get all teachers (+ search/filter/pagination) | Private |
| GET | `/api/teachers/:id` | Get teacher by ID | Private |
| PUT | `/api/teachers/:id` | Update teacher | Admin |
| DELETE | `/api/teachers/:id` | Delete teacher | Admin |

### 📋 Attendance — `/api/attendance`

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/attendance` | Mark attendance | Admin, Teacher |
| GET | `/api/attendance` | Get attendance records | Private |
| GET | `/api/attendance/summary/:studentId` | Student attendance summary | Private |
| PUT | `/api/attendance/:id` | Update attendance record | Admin, Teacher |

### 👪 Parent portal

Admins create parent credentials and link active students with
`POST /api/admin/parents` using `{ "name", "email", "password", "studentIds": ["student-id"] }`.
Parents sign in at `/login`; the frontend routes parent accounts to `/parent`.
Parent APIs only return data for students linked to the authenticated parent:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/parent/children` | List linked children |
| GET | `/api/parent/children/:childId/summary` | Attendance, fee, homework, and exam summary |
| GET | `/api/parent/children/:childId/attendance?month=YYYY-MM` | Monthly attendance |
| GET | `/api/parent/children/:childId/results` | Published exam results |
| GET | `/api/parent/children/:childId/fees` | Child invoices |
| GET | `/api/parent/children/:childId/fees/:feeId/receipt` | Download a child invoice receipt |
| GET | `/api/parent/children/:childId/homework` | Assignments for the child's class and section |

Admins manage exam schedules/results at `/api/exams`; admins and teachers manage
class homework at `/api/homework`. Exam results are published per student.

---

## 🔑 Authentication

All protected routes require a **Bearer token** in the Authorization header:

```http
Authorization: Bearer <your_jwt_token>
```

## 👥 Roles

| Role | Permissions |
|------|------------|
| `admin` | Full access — CRUD on all resources |
| `teacher` | View students/teachers, mark attendance |
| `student` | View own profile |

---

## 🌿 Git Workflow (Shayan's Branch)

All work is done on the `shayan` branch:
```bash
git checkout shayan
# ... make changes ...
git add .
git commit -m "Shayan <description of work>"
git push origin shayan
```

To sync with the upstream (original) repository:
```bash
git fetch upstream
git merge upstream/main
```

---

## 👨‍💻 Developer

**Hafiz Shayan Ahmed**
- GitHub: [@hafizshayanahmed1995](https://github.com/hafizshayanahmed1995)
- Email: hafizshayanahmed1995@gmail.com
- Branch: `shayan`

## Run the full-stack applications

The current full-stack project is split into `backend/` and `frontend/`. Install
Node.js 18+ and start a local MongoDB instance before running the apps.

1. In `backend/`, run `npm install`, copy `.env.example` to `.env`, and set a
   private `JWT_SECRET`. Keep the example local MongoDB URI if MongoDB is
   running on this computer. Start the API with `npm run dev`; it listens on
   `http://localhost:5000`.
2. In a separate terminal, go to `frontend/`, run `npm install`, copy
   `.env.example` to `.env.local`, then start the web app with `npm run dev`.
   Open `http://localhost:3000`.

To run the isolated parent API end-to-end test, run `npm run test:parent-e2e`
from `backend/` while local MongoDB is running. It creates and removes its own
temporary database. Do not share `.env` files or use production credentials
for local testing.

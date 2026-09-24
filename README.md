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

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const errorHandler = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const teacherRoutes = require('./routes/teacherRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const superadminRoutes = require('./routes/superadmin.routes');
const themeRoutes = require('./routes/theme.routes');
const adminRoutes = require('./routes/admin.routes');
const paymentGatewayRoutes = require('./routes/paymentGateway.routes');
const classRoutes = require('./routes/class.routes');
const parentRoutes = require('./routes/parent.routes');
const timetableRoutes = require('./routes/timetableRoutes');
const noticeRoutes = require('./routes/noticeRoutes');
const syllabusRoutes = require('./routes/syllabusRoutes');
const feeRoutes = require('./routes/feeRoutes');
const examRoutes = require('./routes/exam.routes');
const homeworkRoutes = require('./routes/homeworkRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health Check
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'School Management System API is running',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      students: '/api/students',
      teachers: '/api/teachers',
      attendance: '/api/attendance',
      classes: '/api/classes',
      parent: '/api/parent',
      timetable: '/api/timetable',
      notices: '/api/notices',
      syllabus: '/api/syllabus',
      paymentGateways: '/api/payment-gateways',
      exams: '/api/exams', // Naya Endpoint list mein add kiya
      homework: '/api/homework',
    },
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/superadmin', superadminRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/themes', themeRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payment-gateways', paymentGatewayRoutes);
app.use('/api/parent', parentRoutes);
app.use('/api/timetable', timetableRoutes);
app.use('/api/notices', noticeRoutes);
app.use('/api/syllabus', syllabusRoutes);
app.use('/api/fees', feeRoutes);
app.use('/api/exams', examRoutes); // Naya Exam Route connect kiya
app.use('/api/homework', homeworkRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Global Error Handler
app.use(errorHandler);

module.exports = app;
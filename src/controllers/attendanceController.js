const Attendance = require('../models/Attendance');
const Student = require('../models/Student');

// @desc    Mark attendance for a student
// @route   POST /api/attendance
// @access  Private (admin, teacher)
const markAttendance = async (req, res, next) => {
  try {
    const { student, date, status, class: cls, section, remarks } = req.body;

    // Verify student exists
    const studentExists = await Student.findById(student);
    if (!studentExists) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    // Check for duplicate attendance on same date
    const attendanceDate = new Date(date || Date.now());
    attendanceDate.setHours(0, 0, 0, 0);
    const nextDay = new Date(attendanceDate);
    nextDay.setDate(nextDay.getDate() + 1);

    const existing = await Attendance.findOne({
      student,
      date: { $gte: attendanceDate, $lt: nextDay },
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Attendance already marked for this student on this date',
      });
    }

    const attendance = await Attendance.create({
      student,
      date: date || Date.now(),
      status,
      class: cls,
      section,
      remarks,
      markedBy: req.user._id,
    });

    const populated = await attendance.populate('student', 'name rollNumber');

    res.status(201).json({
      success: true,
      message: 'Attendance marked successfully',
      data: populated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get attendance records (with filters)
// @route   GET /api/attendance
// @access  Private
const getAttendance = async (req, res, next) => {
  try {
    const { student, date, status, class: cls, page = 1, limit = 20 } = req.query;

    const filter = {};
    if (student) filter.student = student;
    if (cls) filter.class = cls;
    if (status) filter.status = status;
    if (date) {
      const d = new Date(date);
      d.setHours(0, 0, 0, 0);
      const next = new Date(d);
      next.setDate(next.getDate() + 1);
      filter.date = { $gte: d, $lt: next };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Attendance.countDocuments(filter);
    const records = await Attendance.find(filter)
      .populate('student', 'name rollNumber class section')
      .populate('markedBy', 'name email')
      .sort({ date: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: records.length,
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      data: records,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get attendance summary for a student
// @route   GET /api/attendance/summary/:studentId
// @access  Private
const getAttendanceSummary = async (req, res, next) => {
  try {
    const { studentId } = req.params;

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const summary = await Attendance.aggregate([
      { $match: { student: student._id } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const total = await Attendance.countDocuments({ student: studentId });
    const result = { total, present: 0, absent: 0, late: 0, excused: 0 };
    summary.forEach((s) => { result[s._id] = s.count; });
    result.attendancePercentage =
      total > 0 ? ((result.present / total) * 100).toFixed(2) + '%' : '0%';

    res.status(200).json({
      success: true,
      data: {
        student: { id: student._id, name: student.name, rollNumber: student.rollNumber },
        summary: result,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update attendance record
// @route   PUT /api/attendance/:id
// @access  Private (admin, teacher)
const updateAttendance = async (req, res, next) => {
  try {
    const attendance = await Attendance.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('student', 'name rollNumber');

    if (!attendance) {
      return res.status(404).json({ success: false, message: 'Attendance record not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Attendance updated successfully',
      data: attendance,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { markAttendance, getAttendance, getAttendanceSummary, updateAttendance };

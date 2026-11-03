const Attendance = require('../models/Attendance');
const Student = require('../models/Student');

// @desc    Mark attendance for a student
// @route   POST /api/attendance
// @access  Private (admin, teacher)
const markAttendance = async (req, res, next) => {
  try {
    const { student, date, status, class: cls, section, remarks } = req.body;

    // Verify student exists
    const studentExists = await Student.findOne({ _id: student, school: req.user.school });
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
      school: req.user.school,
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
      school: req.user.school,
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

    const filter = { school: req.user.school };
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

    if (req.query.classId && req.query.date && ['admin','teacher'].includes(req.user.role)) {
      const d = new Date(req.query.date); d.setHours(0,0,0,0); const end = new Date(d); end.setDate(end.getDate()+1);
      const students = await Student.find({ school: req.user.school, $or: [{ classId: req.query.classId }, { class: req.query.classId }] }).select('name rollNumber class classId');
      const records = await Attendance.find({ school: req.user.school, date: { $gte:d, $lt:end }, student: { $in: students.map(x=>x._id) } });
      const byStudent = new Map(records.map(x=>[String(x.student),x]));
      return res.json({ success:true, isExisting:records.length>0, students:students.map(s=>({ id:String(s._id), _id:String(s._id), name:s.name, rollNumber:s.rollNumber, status:byStudent.get(String(s._id))?.status || 'present' })) });
    }
    if (req.user.role === 'parent') {
      const linked = await Student.find({ school:req.user.school, $or:[{parentUsers:req.user._id},{guardianEmail:req.user.email}] }).distinct('_id');
      filter.student = { $in: linked };
    }
    if (req.user.role === 'student') {
      const own = await Student.findOne({ school:req.user.school, email:req.user.email });
      if (!own) return res.json({ success:true, count:0, total:0, data:[] });
      filter.student = own._id;
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

    const student = await Student.findOne({ _id: studentId, school: req.user.school, ...(req.user.role === 'student' ? { email: req.user.email } : req.user.role === 'parent' ? { $or:[{parentUsers:req.user._id},{guardianEmail:req.user.email}] } : {}) });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const summary = await Attendance.aggregate([
      { $match: { student: student._id, school: req.user.school } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const total = await Attendance.countDocuments({ student: studentId, school: req.user.school });
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

// Save a complete class attendance register in one request.
const saveAttendanceBatch = async (req, res, next) => {
  try {
    const { classId, date, attendanceData } = req.body;
    if (!classId || !date || !Array.isArray(attendanceData) || !attendanceData.length) return res.status(400).json({success:false,message:'classId, date and attendanceData are required'});
    const d = new Date(date); if (Number.isNaN(d.getTime())) return res.status(400).json({success:false,message:'Invalid date'}); d.setHours(0,0,0,0); const end = new Date(d); end.setDate(end.getDate()+1);
    const validStatuses = ['present','absent','late','excused'];
    if (attendanceData.some(x => !validStatuses.includes(x.status))) return res.status(400).json({success:false,message:'Each attendance status must be present, absent, late or excused'});
    const ids = attendanceData.map(x=>x.studentId);
    const students = await Student.find({ _id:{$in:ids}, school:req.user.school, $or:[{classId},{class:classId}] }).select('_id class section');
    if (students.length !== new Set(ids).size) return res.status(400).json({success:false,message:'One or more students do not belong to this class'});
    const ops = attendanceData.map(x=>({updateOne:{filter:{school:req.user.school,student:x.studentId,date:{$gte:d,$lt:end}},update:{$set:{school:req.user.school,student:x.studentId,date:d,status:x.status,class:classId,section:students.find(s=>String(s._id)===String(x.studentId))?.section,markedBy:req.user._id}},upsert:true}}));
    await Attendance.bulkWrite(ops);
    res.json({success:true,message:'Class attendance saved successfully',count:ops.length});
  } catch(error){next(error);}
};

// @desc    Update attendance record
// @route   PUT /api/attendance/:id
// @access  Private (admin, teacher)
const updateAttendance = async (req, res, next) => {
  try {
    const allowed = ['date','status','class','section','remarks'];
    const patch = Object.fromEntries(Object.entries(req.body).filter(([key]) => allowed.includes(key)));
    const attendance = await Attendance.findOneAndUpdate({ _id: req.params.id, school: req.user.school }, patch, {
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

module.exports = { markAttendance, getAttendance, getAttendanceSummary, updateAttendance, saveAttendanceBatch };

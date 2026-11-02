
const Student = require('../models/Student');
const Attendance = require('../models/Attendance');
const Fee = require('../models/Fee.model');
const Exam = require('../models/Exam.model');
const Homework = require('../models/Homework.model');

// Parent sirf apne linked aur apne school ke students access kar sakta hai.
const ownedChild = async (req, childId) => {
  return Student.findOne({
    _id: childId,
    school: req.user.school,
    $or: [
      { parentUsers: req.user._id },
      { guardianEmail: req.user.email }
    ]
  }).select('_id name class section rollNumber classId school');
};

// Student ki possible class identifiers.
const getClassNames = (student) => {
  return [...new Set(
    [student.class, student.classId].filter(Boolean)
  )];
};

// Parent ke linked children.
exports.children = async (req, res, next) => {
  try {
    const students = await Student.find({
      school: req.user.school,
      $or: [
        { parentUsers: req.user._id },
        { guardianEmail: req.user.email }
      ]
    }).select('_id name class section rollNumber classId school');

    const data = students.map((student) => ({
      ...student.toObject(),
      className: student.class || student.classId || '',
      rollNo: student.rollNumber
    }));

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

// Child dashboard summary.
exports.summary = async (req, res, next) => {
  try {
    const student = await ownedChild(req, req.params.childId);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Child not found or not linked to this parent'
      });
    }

    const classNames = getClassNames(student);

    const [attendance, fees, homework] = await Promise.all([
      Attendance.find({
        school: req.user.school,
        student: student._id
      }),

      Fee.find({
        school: req.user.school,
        studentId: student._id
      }),

      Homework.find({
        school: req.user.school,
        classId: { $in: classNames }
      })
    ]);

    const totalAttendance = attendance.length;

    const present = attendance.filter(
      (record) => record.status === 'present'
    ).length;

    const absent = attendance.filter(
      (record) => record.status === 'absent'
    ).length;

    const late = attendance.filter(
      (record) => record.status === 'late'
    ).length;

    const feeDue = fees.reduce((total, fee) => {
      return total + Math.max(
        0,
        (fee.amount || 0) - (fee.paidAmount || 0)
      );
    }, 0);

    res.json({
      success: true,
      data: {
        student,
        attendancePercentage: totalAttendance
          ? Math.round((present / totalAttendance) * 100)
          : 0,
        present,
        absent,
        late,
        feeDue,
        homework: homework.length
      }
    });
  } catch (error) {
    next(error);
  }
};

// Child attendance records.
exports.attendance = async (req, res, next) => {
  try {
    const student = await ownedChild(req, req.params.childId);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Child not found or not linked to this parent'
      });
    }

    const filter = {
      school: req.user.school,
      student: student._id
    };

    // Optional month filter: YYYY-MM
    if (req.query.month) {
      if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(req.query.month)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid month format. Use YYYY-MM.'
        });
      }

      const [year, month] = req.query.month.split('-').map(Number);

      filter.date = {
        $gte: new Date(year, month - 1, 1),
        $lt: new Date(year, month, 1)
      };
    }

    const records = await Attendance.find(filter)
      .sort({ date: -1 });

    const summary = {
      present: 0,
      absent: 0,
      late: 0,
      leave: 0
    };

    records.forEach((record) => {
      const status = record.status === 'excused'
        ? 'leave'
        : record.status;

      if (summary[status] !== undefined) {
        summary[status]++;
      }
    });

    const total = records.length;

    res.json({
      success: true,
      data: {
        summary: {
          ...summary,
          percentage: total
            ? Math.round((summary.present / total) * 100)
            : 0
        },
        records
      }
    });
  } catch (error) {
    next(error);
  }
};

// Child fee records.
exports.fees = async (req, res, next) => {
  try {
    const student = await ownedChild(req, req.params.childId);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Child not found or not linked to this parent'
      });
    }

    const fees = await Fee.find({
      school: req.user.school,
      studentId: student._id
    }).sort({ dueDate: -1 });

    const total = fees.reduce(
      (sum, fee) => sum + (fee.amount || 0),
      0
    );

    const paid = fees.reduce(
      (sum, fee) => sum + (fee.paidAmount || 0),
      0
    );

    const now = new Date();

    const formattedFees = fees.map((fee) => {
      const feeData = fee.toObject();

      // GET request mein database status update nahi karte.
      if (
        feeData.status === 'pending' &&
        feeData.dueDate &&
        new Date(feeData.dueDate) < now
      ) {
        feeData.status = 'overdue';
      }

      return {
        ...feeData,
        studentId: {
          _id: student._id,
          name: student.name,
          rollNo: student.rollNumber
        }
      };
    });

    res.json({
      success: true,
      data: {
        fees: formattedFees,
        totals: {
          total,
          paid,
          due: Math.max(0, total - paid)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Child examination results.
exports.results = async (req, res, next) => {
  try {
    const student = await ownedChild(req, req.params.childId);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Child not found or not linked to this parent'
      });
    }

    const classNames = getClassNames(student);

    const exams = await Exam.find({
      school: req.user.school,
      className: { $in: classNames },
      'results.student': student._id
    }).sort({ date: -1 });

    const grouped = new Map();

    for (const exam of exams) {
      const key = `${exam.examType}-${new Date(exam.date).toISOString().slice(0, 10)}`;

      if (!grouped.has(key)) {
        grouped.set(key, {
          examId: key,
          name: exam.examType,
          date: exam.date,
          subjects: [],
          totalObtained: 0,
          totalMarks: 0
        });
      }

      const result = exam.results.find(
        (item) => String(item.student) === String(student._id)
      );

      if (result) {
        const group = grouped.get(key);

        group.subjects.push({
          subject: exam.subject,
          marksObtained: result.obtainedMarks,
          totalMarks: exam.totalMarks,
          grade: result.grade
        });

        group.totalObtained += result.obtainedMarks || 0;
        group.totalMarks += exam.totalMarks || 0;
      }
    }

    res.json({
      success: true,
      data: [...grouped.values()]
    });
  } catch (error) {
    next(error);
  }
};

// Child homework.
// Sirf isi child ki submission parent ko return hogi.
exports.homework = async (req, res, next) => {
  try {
    const student = await ownedChild(req, req.params.childId);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Child not found or not linked to this parent'
      });
    }

    const classNames = getClassNames(student);

    const homeworkRecords = await Homework.find({
      school: req.user.school,
      classId: { $in: classNames }
    })
      .sort({ dueDate: 1 })
      .select('title description classId subject dueDate fileUrl submissions createdAt');

    const data = homeworkRecords.map((homework) => {
      const record = homework.toObject();

      record.submissions = (record.submissions || []).filter(
        (submission) =>
          String(submission.student) === String(student._id)
      );

      return record;
    });

    res.json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
};

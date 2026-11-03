const mongoose = require('mongoose');
const PDFDocument = require('pdfkit');
const Attendance = require('../models/Attendance');
const Exam = require('../models/Exam.model');
const Fee = require('../models/Fee.model');
const Homework = require('../models/Homework.model');
const Student = require('../models/Student');

const isValidId = (id) => mongoose.isValidObjectId(id);

const getChild = async (req, res) => {
  if (!isValidId(req.params.childId)) {
    res.status(400).json({ success: false, message: 'Invalid child ID.' });
    return null;
  }

  const child = await Student.findOne({
    _id: req.params.childId,
    parent: req.user._id,
    school: req.user.school,
    isActive: true,
  });

  if (!child) {
    res.status(404).json({ success: false, message: 'Child not found in your parent account.' });
    return null;
  }

  return child;
};

const classFilter = (child) => {
  const section = child.section || '';
  return {
    school: child.school,
    className: child.class,
    $or: section
      ? [{ section }, { section: '' }, { section: { $exists: false } }]
      : [{ section: '' }, { section: { $exists: false } }],
  };
};

const getMyChildren = async (req, res, next) => {
  try {
    const children = await Student.find({
      parent: req.user._id,
      school: req.user.school,
      isActive: true,
    })
      .select('name email rollNumber dateOfBirth gender class section guardianName guardianPhone school')
      .populate('school', 'name')
      .sort({ name: 1 });

    return res.status(200).json({
      success: true,
      count: children.length,
      data: children,
    });
  } catch (error) {
    return next(error);
  }
};

const getChildSummary = async (req, res, next) => {
  try {
    const child = await getChild(req, res);
    if (!child) return undefined;

    const [attendance, fees, homeworkDue, upcomingExams] = await Promise.all([
      Attendance.aggregate([
        { $match: { student: child._id } },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      Fee.find({ school: child.school, studentId: child._id }).select('amount status'),
      Homework.countDocuments({
        ...classFilter(child),
        dueDate: { $gte: new Date() },
      }),
      Exam.countDocuments({
        ...classFilter(child),
        date: { $gte: new Date() },
      }),
    ]);

    const attendanceCounts = { present: 0, absent: 0, late: 0, excused: 0 };
    attendance.forEach(({ _id, count }) => {
      if (Object.hasOwn(attendanceCounts, _id)) attendanceCounts[_id] = count;
    });
    const totalAttendance = Object.values(attendanceCounts).reduce((sum, count) => sum + count, 0);
    const attendancePercentage = totalAttendance
      ? Number(((attendanceCounts.present / totalAttendance) * 100).toFixed(1))
      : 0;
    const pendingFees = fees
      .filter((fee) => fee.status !== 'paid')
      .reduce((sum, fee) => sum + fee.amount, 0);

    return res.json({
      success: true,
      data: {
        child,
        attendancePercentage,
        pendingFees,
        homeworkDue,
        upcomingExams,
      },
    });
  } catch (error) {
    return next(error);
  }
};

const getChildAttendance = async (req, res, next) => {
  try {
    const child = await getChild(req, res);
    if (!child) return undefined;

    const month = req.query.month;
    if (month && !/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) {
      return res.status(400).json({ success: false, message: 'Month must use YYYY-MM format.' });
    }

    const filter = { student: child._id };
    if (month) {
      const start = new Date(`${month}-01T00:00:00.000Z`);
      const end = new Date(start);
      end.setUTCMonth(end.getUTCMonth() + 1);
      filter.date = { $gte: start, $lt: end };
    }
    const records = await Attendance.find(filter).sort({ date: -1 }).limit(200);
    const summary = { percentage: 0, present: 0, absent: 0, late: 0, leave: 0 };
    records.forEach((record) => {
      if (record.status === 'excused') summary.leave += 1;
      else if (Object.hasOwn(summary, record.status)) summary[record.status] += 1;
    });
    if (records.length) {
      summary.percentage = Number(((summary.present / records.length) * 100).toFixed(1));
    }

    return res.json({ success: true, data: { summary, records } });
  } catch (error) {
    return next(error);
  }
};

const getChildResults = async (req, res, next) => {
  try {
    const child = await getChild(req, res);
    if (!child) return undefined;

    const exams = await Exam.find({
      school: child.school,
      'results.studentId': child._id,
    }).sort({ date: -1 });

    const results = exams.map((exam) => {
      const result = exam.results.find(
        (item) => String(item.studentId) === String(child._id)
      );
      if (!result) return null;
      return {
        examId: exam._id,
        name: `${exam.examType} - ${exam.subject}`,
        date: exam.date,
        subjects: [{
          subject: exam.subject,
          marksObtained: result.obtainedMarks,
          totalMarks: exam.totalMarks,
          grade: result.grade,
        }],
        totalObtained: result.obtainedMarks,
        totalMarks: exam.totalMarks,
        grade: result.grade,
      };
    }).filter(Boolean);

    return res.json({ success: true, data: results });
  } catch (error) {
    return next(error);
  }
};

const getChildFees = async (req, res, next) => {
  try {
    const child = await getChild(req, res);
    if (!child) return undefined;

    const fees = await Fee.find({ school: child.school, studentId: child._id })
      .populate('studentId', 'name rollNumber')
      .sort({ dueDate: -1 })
      .limit(200);
    return res.json({ success: true, count: fees.length, data: fees });
  } catch (error) {
    return next(error);
  }
};

const getChildHomework = async (req, res, next) => {
  try {
    const child = await getChild(req, res);
    if (!child) return undefined;

    const homework = await Homework.find(classFilter(child))
      .populate('createdBy', 'name')
      .sort({ dueDate: 1 })
      .limit(200);
    return res.json({ success: true, count: homework.length, data: homework });
  } catch (error) {
    return next(error);
  }
};

const getChildFeeReceipt = async (req, res, next) => {
  try {
    const child = await getChild(req, res);
    if (!child) return undefined;
    if (!isValidId(req.params.feeId)) {
      return res.status(400).json({ success: false, message: 'Invalid fee ID.' });
    }

    const fee = await Fee.findOne({
      _id: req.params.feeId,
      school: child.school,
      studentId: child._id,
    }).populate('studentId', 'name rollNumber');
    if (!fee) return res.status(404).json({ success: false, message: 'Fee record not found.' });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fee.invoiceNo}.pdf"`);
    const doc = new PDFDocument({ margin: 50 });
    doc.on('error', next);
    doc.pipe(res);
    doc.fontSize(22).text('School Fee Receipt', { align: 'center' });
    doc.moveDown().fontSize(12);
    doc.text(`Invoice: ${fee.invoiceNo}`);
    doc.text(`Student: ${fee.studentId?.name || 'N/A'}`);
    doc.text(`Roll number: ${fee.studentId?.rollNumber || 'N/A'}`);
    doc.text(`Fee month: ${fee.month}`);
    doc.text(`Fee type: ${fee.feeType}`);
    doc.text(`Amount: ${fee.amount}`);
    doc.text(`Status: ${fee.status}`);
    doc.text(`Due date: ${new Date(fee.dueDate).toLocaleDateString()}`);
    if (fee.paidDate) doc.text(`Paid date: ${new Date(fee.paidDate).toLocaleDateString()}`);
    if (fee.paymentMethod) doc.text(`Payment method: ${fee.paymentMethod}`);
    doc.end();
    return undefined;
  } catch (error) {
    if (!res.headersSent) return next(error);
    return undefined;
  }
};

module.exports = {
  getMyChildren,
  getChildSummary,
  getChildAttendance,
  getChildResults,
  getChildFees,
  getChildHomework,
  getChildFeeReceipt,
};

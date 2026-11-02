const mongoose = require('mongoose');
const Exam = require('../models/Exam.model');
const Student = require('../models/Student');

const isValidId = (id) => mongoose.isValidObjectId(id);
const getSchoolId = (user) => user.school || user.schoolId;

const serializeExam = (exam, user, studentId) => {
  const result = exam.toObject ? exam.toObject() : exam;
  if (user.role === 'student') {
    result.results = studentId
      ? result.results.filter((item) => String(item.studentId) === String(studentId))
      : [];
  }
  return {
    ...result,
    status: result.results?.length ? 'result-declared' : result.status || 'upcoming',
    classLabel: [result.className, result.section].filter(Boolean).join(' - '),
  };
};

const getStudentForUser = async (user) => {
  if (user.role !== 'student') return null;
  return Student.findOne({
    email: user.email,
    school: getSchoolId(user),
  }).select('_id');
};

const validateExamInput = (body) => {
  const { subject, examType, className, section, date, startTime, duration, totalMarks } = body;
  if (
    typeof subject !== 'string' || !subject.trim() ||
    !['Quiz', 'Midterm', 'Final', 'Test'].includes(examType) ||
    typeof className !== 'string' || !className.trim() ||
    typeof date !== 'string' || Number.isNaN(Date.parse(date)) ||
    typeof startTime !== 'string' || !/^([01]\d|2[0-3]):[0-5]\d$/.test(startTime) ||
    !Number.isFinite(Number(duration)) || Number(duration) < 10 || Number(duration) > 600 ||
    !Number.isFinite(Number(totalMarks)) || Number(totalMarks) < 1 || Number(totalMarks) > 10000 ||
    (section !== undefined && typeof section !== 'string')
  ) {
    return 'Provide a valid subject, exam type, class, date, start time, duration, and total marks.';
  }
  return null;
};

const listExams = async (req, res, next) => {
  try {
    const filter = { school: getSchoolId(req.user) };
    if (req.query.className) filter.className = req.query.className;
    if (req.query.section !== undefined) filter.section = req.query.section;

    const [exams, student] = await Promise.all([
      Exam.find(filter).sort({ date: -1, createdAt: -1 }).limit(200),
      getStudentForUser(req.user),
    ]);
    return res.json({
      success: true,
      count: exams.length,
      data: exams.map((exam) => serializeExam(exam, req.user, student?._id)),
    });
  } catch (error) {
    return next(error);
  }
};

const getExam = async (req, res, next) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid exam ID.' });
    }
    const [exam, student] = await Promise.all([
      Exam.findOne({
        _id: req.params.id,
        school: getSchoolId(req.user),
      }),
      getStudentForUser(req.user),
    ]);
    if (!exam) return res.status(404).json({ success: false, message: 'Exam not found.' });
    return res.json({ success: true, data: serializeExam(exam, req.user, student?._id) });
  } catch (error) {
    return next(error);
  }
};

const createExam = async (req, res, next) => {
  try {
    const validationError = validateExamInput(req.body);
    if (validationError) return res.status(400).json({ success: false, message: validationError });

    const exam = await Exam.create({
      subject: req.body.subject.trim(),
      examType: req.body.examType,
      className: req.body.className.trim(),
      section: req.body.section?.trim() || '',
      date: req.body.date,
      startTime: req.body.startTime,
      duration: Number(req.body.duration),
      totalMarks: Number(req.body.totalMarks),
      school: getSchoolId(req.user),
    });
    return res.status(201).json({ success: true, data: serializeExam(exam, req.user) });
  } catch (error) {
    return next(error);
  }
};

const updateExam = async (req, res, next) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid exam ID.' });
    }
    const validationError = validateExamInput(req.body);
    if (validationError) return res.status(400).json({ success: false, message: validationError });

    const exam = await Exam.findOne({
      _id: req.params.id,
      school: getSchoolId(req.user),
    });
    if (!exam) return res.status(404).json({ success: false, message: 'Exam not found.' });

    const nextClass = req.body.className.trim();
    const nextSection = req.body.section?.trim() || '';
    const nextTotalMarks = Number(req.body.totalMarks);
    if (
      exam.results.length &&
      (
        exam.className !== nextClass ||
        (exam.section || '') !== nextSection ||
        exam.results.some((result) => result.obtainedMarks > nextTotalMarks)
      )
    ) {
      return res.status(409).json({
        success: false,
        message: 'Class, section, or total marks cannot invalidate results that have already been published.',
      });
    }

    exam.subject = req.body.subject.trim();
    exam.examType = req.body.examType;
    exam.className = nextClass;
    exam.section = nextSection;
    exam.date = req.body.date;
    exam.startTime = req.body.startTime;
    exam.duration = Number(req.body.duration);
    exam.totalMarks = nextTotalMarks;
    await exam.save();
    return res.json({ success: true, data: serializeExam(exam, req.user) });
  } catch (error) {
    return next(error);
  }
};

const deleteExam = async (req, res, next) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid exam ID.' });
    }
    const exam = await Exam.findOneAndDelete({
      _id: req.params.id,
      school: getSchoolId(req.user),
    });
    if (!exam) return res.status(404).json({ success: false, message: 'Exam not found.' });
    return res.json({ success: true, message: 'Exam deleted.' });
  } catch (error) {
    return next(error);
  }
};

const publishResult = async (req, res, next) => {
  try {
    const { studentId, obtainedMarks, grade } = req.body;
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Valid exam ID is required.' });
    }
    if (!Number.isFinite(Number(obtainedMarks)) || Number(obtainedMarks) < 0) {
      return res.status(400).json({ success: false, message: 'Obtained marks must be zero or greater.' });
    }

    const exam = await Exam.findOne({
      _id: req.params.id,
      school: getSchoolId(req.user),
    });
    if (!exam) return res.status(404).json({ success: false, message: 'Exam not found.' });
    if (Number(obtainedMarks) > exam.totalMarks) {
      return res.status(400).json({ success: false, message: 'Obtained marks cannot exceed total marks.' });
    }

    if (!studentId) {
      exam.obtainedMarks = Number(obtainedMarks);
      exam.grade = typeof grade === 'string' ? grade.trim() : null;
      exam.status = 'result-declared';
      await exam.save();
      return res.json({ success: true, data: serializeExam(exam, req.user) });
    }

    if (!isValidId(studentId)) {
      return res.status(400).json({ success: false, message: 'Valid student ID is required.' });
    }
    const studentFilter = {
      _id: studentId,
      school: getSchoolId(req.user),
      isActive: true,
      class: exam.className,
    };
    if (exam.section) studentFilter.section = exam.section;
    const student = await Student.findOne(studentFilter).select('_id');
    if (!student) {
      return res.status(400).json({
        success: false,
        message: 'Student must be active and belong to this exam class and section.',
      });
    }

    const result = {
      studentId: student._id,
      obtainedMarks: Number(obtainedMarks),
      ...(typeof grade === 'string' && grade.trim() ? { grade: grade.trim() } : {}),
      publishedAt: new Date(),
    };
    const existingIndex = exam.results.findIndex(
      (item) => String(item.studentId) === String(student._id)
    );
    if (existingIndex >= 0) exam.results[existingIndex] = result;
    else exam.results.push(result);
    exam.status = 'result-declared';
    await exam.save();

    return res.json({ success: true, data: serializeExam(exam, req.user) });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  listExams,
  getExam,
  getExams: listExams,
  getExamById: getExam,
  createExam,
  updateExam,
  deleteExam,
  publishResult,
};

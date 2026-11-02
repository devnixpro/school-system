const mongoose = require('mongoose');
const PDFDocument = require('pdfkit');
const Fee = require('../models/Fee.model');
const Student = require('../models/Student');

const getSchoolId = (req) => req.user && (req.user.school || req.user.schoolId);

const validId = (id) => mongoose.Types.ObjectId.isValid(id);

const makeInvoiceNo = () =>
  `INV-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

const populateFee = (query) =>
  query.populate({
    path: 'studentId',
    select: 'name rollNumber school',
  });

const syncOverdueFees = async (schoolId) => {
  await Fee.updateMany(
    {
      school: schoolId,
      status: 'pending',
      dueDate: { $lt: new Date() },
    },
    { $set: { status: 'overdue' } }
  );
};

const getSchoolStudent = async (studentId, schoolId) => {
  if (!validId(studentId)) return null;
  return Student.findOne({ _id: studentId, school: schoolId });
};

const listFees = async (req, res, next) => {
  try {
    const schoolId = getSchoolId(req);
    if (!schoolId) {
      return res.status(403).json({ success: false, message: 'No school is assigned to this user.' });
    }

    await syncOverdueFees(schoolId);

    const filter = { school: schoolId };
    if (req.query.status && ['pending', 'paid', 'overdue'].includes(req.query.status)) {
      filter.status = req.query.status;
    }
    if (req.query.month) filter.month = req.query.month;

    const limit = Math.min(500, Math.max(1, parseInt(req.query.limit, 10) || 100));
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const [fees, total] = await Promise.all([
      populateFee(Fee.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit)),
      Fee.countDocuments(filter),
    ]);

    return res.json({ success: true, count: fees.length, total, data: fees });
  } catch (error) {
    return next(error);
  }
};

const getFeeById = async (req, res, next) => {
  try {
    const schoolId = getSchoolId(req);
    if (!schoolId) return res.status(403).json({ success: false, message: 'No school is assigned to this user.' });
    if (!validId(req.params.id)) return res.status(400).json({ success: false, message: 'Invalid fee ID.' });

    const fee = await populateFee(Fee.findOne({ _id: req.params.id, school: schoolId }));
    if (!fee) return res.status(404).json({ success: false, message: 'Fee record not found.' });
    return res.json({ success: true, data: fee });
  } catch (error) {
    return next(error);
  }
};

const createFee = async (req, res, next) => {
  try {
    const schoolId = getSchoolId(req);
    if (!schoolId) return res.status(403).json({ success: false, message: 'No school is assigned to this user.' });

    const { studentId, amount, month, dueDate, feeType } = req.body;
    if (!studentId || amount === undefined || !month || !dueDate) {
      return res.status(400).json({ success: false, message: 'studentId, amount, month and dueDate are required.' });
    }

    const student = await getSchoolStudent(studentId, schoolId);
    if (!student) return res.status(400).json({ success: false, message: 'Student not found in your school.' });

    const fee = await Fee.create({
      school: schoolId,
      studentId: student._id,
      invoiceNo: makeInvoiceNo(),
      amount,
      month,
      dueDate,
      feeType,
      createdBy: req.user._id,
    });

    const result = await populateFee(Fee.findById(fee._id));
    return res.status(201).json({ success: true, message: 'Fee created successfully.', data: result });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: error.message });
    }
    return next(error);
  }
};

const bulkCreateFees = async (req, res, next) => {
  try {
    const schoolId = getSchoolId(req);
    if (!schoolId) return res.status(403).json({ success: false, message: 'No school is assigned to this user.' });

    const { studentIds, amount, month, dueDate, feeType } = req.body;
    if (!Array.isArray(studentIds) || studentIds.length === 0 || amount === undefined || !month || !dueDate) {
      return res.status(400).json({ success: false, message: 'studentIds, amount, month and dueDate are required.' });
    }
    if (studentIds.some((id) => !validId(id))) {
      return res.status(400).json({ success: false, message: 'One or more student IDs are invalid.' });
    }

    const uniqueIds = [...new Set(studentIds.map(String))];
    const students = await Student.find({ _id: { $in: uniqueIds }, school: schoolId }).select('_id');
    if (students.length !== uniqueIds.length) {
      return res.status(400).json({ success: false, message: 'Every student must belong to your school.' });
    }

    const fees = await Fee.insertMany(students.map((student) => ({
      school: schoolId,
      studentId: student._id,
      invoiceNo: makeInvoiceNo(),
      amount,
      month,
      dueDate,
      feeType,
      createdBy: req.user._id,
    })));

    const populated = await populateFee(Fee.find({ _id: { $in: fees.map((fee) => fee._id) } }));
    return res.status(201).json({
      success: true,
      message: 'Fees created successfully.',
      count: populated.length,
      data: populated,
    });
  } catch (error) {
    if (error.name === 'ValidationError' || error.name === 'BulkWriteError') {
      return res.status(400).json({ success: false, message: error.message });
    }
    return next(error);
  }
};

const markFeePaid = async (req, res, next) => {
  try {
    const schoolId = getSchoolId(req);
    if (!schoolId) return res.status(403).json({ success: false, message: 'No school is assigned to this user.' });
    if (!validId(req.params.id)) return res.status(400).json({ success: false, message: 'Invalid fee ID.' });

    const { paymentMethod, transactionId } = req.body;
    const allowedMethods = ['cash', 'card', 'bank_transfer', 'online', 'cheque'];
    if (!allowedMethods.includes(paymentMethod)) {
      return res.status(400).json({ success: false, message: 'A valid paymentMethod is required.' });
    }

    const fee = await Fee.findOneAndUpdate(
      { _id: req.params.id, school: schoolId },
      {
        $set: {
          status: 'paid',
          paidDate: new Date(),
          paymentMethod,
          ...(transactionId ? { transactionId: String(transactionId).trim() } : {}),
        },
      },
      { new: true, runValidators: true }
    );

    if (!fee) return res.status(404).json({ success: false, message: 'Fee record not found.' });
    const populated = await populateFee(Fee.findById(fee._id));
    return res.json({ success: true, message: 'Payment recorded successfully.', data: populated });
  } catch (error) {
    return next(error);
  }
};

const updateFee = async (req, res, next) => {
  try {
    const schoolId = getSchoolId(req);
    if (!schoolId) return res.status(403).json({ success: false, message: 'No school is assigned to this user.' });
    if (!validId(req.params.id)) return res.status(400).json({ success: false, message: 'Invalid fee ID.' });

    const updates = {};
    for (const field of ['amount', 'month', 'dueDate', 'feeType']) {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    }
    if (!Object.keys(updates).length) {
      return res.status(400).json({ success: false, message: 'No editable fee fields were supplied.' });
    }

    const fee = await Fee.findOneAndUpdate(
      { _id: req.params.id, school: schoolId },
      { $set: updates },
      { new: true, runValidators: true }
    );
    if (!fee) return res.status(404).json({ success: false, message: 'Fee record not found.' });

    const populated = await populateFee(Fee.findById(fee._id));
    return res.json({ success: true, message: 'Fee updated successfully.', data: populated });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: error.message });
    }
    return next(error);
  }
};

const deleteFee = async (req, res, next) => {
  try {
    const schoolId = getSchoolId(req);
    if (!schoolId) return res.status(403).json({ success: false, message: 'No school is assigned to this user.' });
    if (!validId(req.params.id)) return res.status(400).json({ success: false, message: 'Invalid fee ID.' });

    const fee = await Fee.findOneAndDelete({ _id: req.params.id, school: schoolId });
    if (!fee) return res.status(404).json({ success: false, message: 'Fee record not found.' });
    return res.json({ success: true, message: 'Fee deleted successfully.' });
  } catch (error) {
    return next(error);
  }
};

const getAnalyticsSummary = async (req, res, next) => {
  try {
    const schoolId = getSchoolId(req);
    if (!schoolId) return res.status(403).json({ success: false, message: 'No school is assigned to this user.' });
    await syncOverdueFees(schoolId);

    const [totalFees, paid, pending, overdue, totals] = await Promise.all([
      Fee.countDocuments({ school: schoolId }),
      Fee.countDocuments({ school: schoolId, status: 'paid' }),
      Fee.countDocuments({ school: schoolId, status: 'pending' }),
      Fee.countDocuments({ school: schoolId, status: 'overdue' }),
      Fee.aggregate([
        { $match: { school: new mongoose.Types.ObjectId(String(schoolId)) } },
        { $group: { _id: null, billedAmount: { $sum: '$amount' }, collectedAmount: { $sum: { $cond: [{ $eq: ['$status', 'paid'] }, '$amount', 0] } } } },
      ]),
    ]);

    return res.json({
      success: true,
      data: {
        totalFees, paid, pending, overdue,
        billedAmount: totals[0]?.billedAmount || 0,
        collectedAmount: totals[0]?.collectedAmount || 0,
      },
    });
  } catch (error) {
    return next(error);
  }
};

const getMonthlyAnalytics = async (req, res, next) => {
  try {
    const schoolId = getSchoolId(req);
    if (!schoolId) return res.status(403).json({ success: false, message: 'No school is assigned to this user.' });

    const data = await Fee.aggregate([
      { $match: { school: new mongoose.Types.ObjectId(String(schoolId)) } },
      { $group: {
        _id: '$month',
        totalAmount: { $sum: '$amount' },
        collectedAmount: { $sum: { $cond: [{ $eq: ['$status', 'paid'] }, '$amount', 0] } },
        count: { $sum: 1 },
      } },
      { $sort: { _id: 1 } },
      { $project: { _id: 0, month: '$_id', totalAmount: 1, collectedAmount: 1, count: 1 } },
    ]);
    return res.json({ success: true, data });
  } catch (error) {
    return next(error);
  }
};

const getAnalyticsByType = async (req, res, next) => {
  try {
    const schoolId = getSchoolId(req);
    if (!schoolId) return res.status(403).json({ success: false, message: 'No school is assigned to this user.' });

    const data = await Fee.aggregate([
      { $match: { school: new mongoose.Types.ObjectId(String(schoolId)) } },
      { $group: {
        _id: '$feeType',
        totalAmount: { $sum: '$amount' },
        count: { $sum: 1 },
        collectedAmount: { $sum: { $cond: [{ $eq: ['$status', 'paid'] }, '$amount', 0] } },
      } },
      { $project: { _id: 0, type: '$_id', totalAmount: 1, count: 1, collectedAmount: 1 } },
      { $sort: { totalAmount: -1 } },
    ]);
    return res.json({ success: true, data });
  } catch (error) {
    return next(error);
  }
};

const getFeeReceipt = async (req, res, next) => {
  try {
    const schoolId = getSchoolId(req);
    if (!schoolId) return res.status(403).json({ success: false, message: 'No school is assigned to this user.' });
    if (!validId(req.params.id)) return res.status(400).json({ success: false, message: 'Invalid fee ID.' });

    const fee = await populateFee(Fee.findOne({ _id: req.params.id, school: schoolId }));
    if (!fee) return res.status(404).json({ success: false, message: 'Fee record not found.' });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${fee.invoiceNo}.pdf"`);

    const doc = new PDFDocument({ margin: 50 });
    doc.on('error', next);
    doc.pipe(res);
    doc.fontSize(22).text('School Fee Receipt', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12);
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
    if (fee.transactionId) doc.text(`Transaction ID: ${fee.transactionId}`);
    doc.end();
  } catch (error) {
    if (!res.headersSent) return next(error);
    return undefined;
  }
};

module.exports = {
  listFees,
  getFeeById,
  createFee,
  bulkCreateFees,
  markFeePaid,
  updateFee,
  deleteFee,
  getAnalyticsSummary,
  getMonthlyAnalytics,
  getAnalyticsByType,
  getFeeReceipt,
};

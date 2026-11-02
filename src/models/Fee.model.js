const mongoose = require('mongoose');

const feeSchema = new mongoose.Schema({
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true,
    index: true,
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
    index: true,
  },
  invoiceNo: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  amount: {
    type: Number,
    required: true,
    min: [0.01, 'Amount must be greater than zero'],
    max: [10000000, 'Amount cannot exceed 10,000,000'],
  },
  feeType: {
    type: String,
    trim: true,
    default: 'Tuition',
  },
  month: {
    type: String,
    required: true,
    trim: true,
    match: [/^[A-Z][a-z]+-\d{4}$/, 'Month must use Month-YYYY format'],
  },
  dueDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'overdue'],
    default: 'pending',
    index: true,
  },
  paidDate: {
    type: Date,
    default: null,
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'bank_transfer', 'online', 'cheque'],
    default: undefined,
  },
  transactionId: {
    type: String,
    trim: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, { timestamps: true });

feeSchema.index({ school: 1, studentId: 1, month: 1 });

module.exports = mongoose.model('Fee', feeSchema);

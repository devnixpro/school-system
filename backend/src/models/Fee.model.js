
const mongoose = require('mongoose');

const feeSchema = new mongoose.Schema(
  {
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

    month: {
      type: String,
      required: true,
      trim: true,
    },

    feeType: {
      type: String,
      default: 'Tuition Fee',
      trim: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    paidAmount: {
      type: Number,
      default: 0,
      min: 0,
      validate: {
        validator: function (value) {
          return value <= this.amount;
        },
        message: 'Paid amount cannot exceed total fee amount',
      },
    },

    dueDate: {
      type: Date,
      required: true,
    },

    paidDate: Date,

    status: {
      type: String,
      enum: ['pending', 'partial', 'paid', 'overdue'],
      default: 'pending',
      index: true,
    },

    paymentMethod: {
      type: String,
      enum: ['cash', 'card', 'bank_transfer', 'online', 'cheque', null],
      default: null,
    },

    transactionId: String,

    payments: [
      {
        amount: {
          type: Number,
          required: true,
          min: 0.01,
        },
        paymentMethod: String,
        transactionId: String,
        paidAt: {
          type: Date,
          default: Date.now,
        },
        receivedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
      },
    ],
  },
  { timestamps: true }
);

feeSchema.index({ school: 1, studentId: 1, month: 1 });

module.exports = mongoose.model('Fee', feeSchema);

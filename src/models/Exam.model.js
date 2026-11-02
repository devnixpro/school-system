const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    obtainedMarks: {
      type: Number,
      required: true,
      min: 0,
    },
    grade: {
      type: String,
      trim: true,
    },
    publishedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const examSchema = new mongoose.Schema(
  {
    subject: { type: String, required: true },
    examType: { type: String, required: true },
    className: { type: String, required: true },
    section: { type: String, trim: true, default: '' },
    date: { type: Date, required: true },
    startTime: { type: String, required: true },
    duration: { type: Number, required: true },
    totalMarks: { type: Number, required: true },
    obtainedMarks: { type: Number, default: null },
    grade: { type: String, default: null },
    status: {
      type: String,
      enum: ['upcoming', 'result-declared'],
      default: 'upcoming',
    },
    results: {
      type: [resultSchema],
      default: [],
    },
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

examSchema.index({ school: 1, className: 1, section: 1, date: 1 });

module.exports = mongoose.model('Exam', examSchema);

const mongoose = require('mongoose');
const examSchema = new mongoose.Schema({
  school: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true, index: true },
  subject: { type: String, required: true, trim: true },
  examType: { type: String, enum: ['Quiz', 'Midterm', 'Final', 'Test'], default: 'Midterm' },
  className: { type: String, required: true, trim: true },
  date: { type: Date, required: true },
  startTime: { type: String, required: true },
  duration: { type: Number, required: true, min: 10 },
  totalMarks: { type: Number, required: true, min: 1 },
  results: [{ student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true }, obtainedMarks: { type: Number, required: true, min: 0 }, grade: String, publishedAt: { type: Date, default: Date.now } }],
}, { timestamps: true });
examSchema.index({ school: 1, className: 1, date: 1 });
module.exports = mongoose.model('Exam', examSchema);

const mongoose = require('mongoose');
const homeworkSchema = new mongoose.Schema({
  school: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true, index: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  classId: { type: String, required: true, trim: true },
  subject: { type: String, required: true, trim: true },
  dueDate: Date,
  fileUrl: String,
  assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  submissions: [{ student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' }, fileUrl: String, submittedOn: Date, status: { type: String, enum: ['submitted', 'late', 'reviewed'], default: 'submitted' }, marksObtained: Number, totalMarks: Number }],
}, { timestamps: true });
homeworkSchema.index({ school: 1, classId: 1, dueDate: 1 });
module.exports = mongoose.model('Homework', homeworkSchema);

const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
  name: { type: String, required: true },
  completed: { type: Boolean, default: false }
});

const moduleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['Completed', 'In Progress', 'Upcoming'], 
    default: 'Upcoming' 
  },
  duration: { type: String, required: true },
  topics: [topicSchema],
  resources: { type: String }
});

const syllabusSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // e.g., 'cs101'
  code: { type: String, required: true },             // e.g., 'CS-101'
  name: { type: String, required: true },             // e.g., 'Computer Science Fundamentals'
  instructor: { type: String, required: true },
  totalModules: { type: Number, required: true },
  completedModules: { type: Number, default: 0 },
  progress: { type: Number, default: 0 },             // e.g., 75 (%)
  modules: [moduleSchema]
}, { timestamps: true });

module.exports = mongoose.model('Syllabus', syllabusSchema);
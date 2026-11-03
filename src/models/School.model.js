const mongoose = require('mongoose');

const schoolSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'School name is required'],
      trim: true,
    },
    schoolType: {
      type: String,
      default: 'Primary & Secondary',
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    studentCount: {
      type: Number,
      default: 500,
    },
    academicYear: {
      type: String,
      default: '2026-2027',
    },
    branchName: {
      type: String,
      default: 'Main Campus',
    },
    selectedModules: [{ type: String }],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('School', schoolSchema);
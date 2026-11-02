require('dotenv').config();
const mongoose = require('mongoose');
const School = require('../src/models/School.model');
const Student = require('../src/models/Student');
const Teacher = require('../src/models/Teacher');
const Attendance = require('../src/models/Attendance');
const Notice = require('../src/models/Notice.model');
const Timetable = require('../src/models/Timetable.model');
(async () => {
  try {
    const schoolId = process.env.MIGRATION_SCHOOL_ID;
    if (!schoolId || !mongoose.isValidObjectId(schoolId)) throw new Error('Set MIGRATION_SCHOOL_ID to the existing school ObjectId.');
    await mongoose.connect(process.env.MONGO_URI);
    const school = await School.findById(schoolId);
    if (!school) throw new Error('School not found.');
    const models = [Student, Teacher, Attendance, Notice, Timetable];
    for (const Model of models) {
      const result = await Model.updateMany({ school: { $exists: false } }, { $set: { school: school._id } });
      console.log(`${Model.collection.collectionName}: ${result.modifiedCount} records linked`);
    }
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  } finally { await mongoose.disconnect(); }
})();

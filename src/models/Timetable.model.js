const mongoose = require('mongoose');

const timetableSchema = new mongoose.Schema({
  className: { 
    type: String, 
    required: true 
  },
  section: { 
    type: String, 
    required: true 
  },
  day: { 
    type: String, 
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    required: true 
  },
  subject: { 
    type: String, 
    required: true 
  },
  teacher: { 
    type: String, 
    required: true 
  },
  roomNo: { 
    type: String 
  },
  startTime: { 
    type: String, 
    required: true 
  },
  endTime: { 
    type: String, 
    required: true 
  }
}, { timestamps: true });

module.exports = mongoose.model('Timetable', timetableSchema);
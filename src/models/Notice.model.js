const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true,
    trim: true 
  },
  content: { 
    type: String, 
    required: true 
  },
  postedBy: { 
    type: String, 
    default: 'Admin' 
  },
  targetAudience: { 
    type: String, 
    enum: ['All', 'Students', 'Teachers', 'Parents'], 
    default: 'All' 
  },
  priority: { 
    type: String, 
    enum: ['Low', 'Medium', 'High'], 
    default: 'Medium' 
  },
  expiryDate: { 
    type: Date 
  }
}, { timestamps: true });

module.exports = mongoose.model('Notice', noticeSchema);
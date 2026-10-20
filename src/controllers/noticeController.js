const Notice = require('../models/Notice.model');

// Create New Notice
exports.createNotice = async (req, res) => {
  try {
    const notice = new Notice(req.body);
    await notice.save();
    res.status(201).json({ success: true, message: "Notice published successfully!", data: notice });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Get All Notices (Target Audience by filter)
exports.getAllNotices = async (req, res) => {
  try {
    const { targetAudience } = req.query;
    let filter = {};

    if (targetAudience) {
      filter.targetAudience = { $in: [targetAudience, 'All'] };
    }
    const notices = await Notice.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: notices.length, data: notices });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Single Notice Get by ID 
exports.getNoticeById = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);
    if (!notice) {
      return res.status(404).json({ success: false, message: "Notice not found" });
    }
    res.status(200).json({ success: true, data: notice });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Notice Update
exports.updateNotice = async (req, res) => {
  try {
    const notice = await Notice.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    if (!notice) {
      return res.status(404).json({ success: false, message: "Notice not found" });
    }
    res.status(200).json({ success: true, message: "Notice updated successfully", data: notice });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Notice Delete
exports.deleteNotice = async (req, res) => {
  try {
    const notice = await Notice.findByIdAndDelete(req.params.id);
    if (!notice) {
      return res.status(404).json({ success: false, message: "Notice not found" });
    }
    res.status(200).json({ success: true, message: "Notice deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
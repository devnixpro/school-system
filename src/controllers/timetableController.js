const Timetable = require('../models/Timetable.model');

// Create new timetable
exports.createTimetable = async (req, res) => {
  try {
    const timetable = new Timetable(req.body);
    await timetable.save();
    res.status(201).json({ success: true, message: "Slot added successfully!", data: timetable });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// get all Timetables (Filter by Class & Section)
exports.getAllTimetables = async (req, res) => {
  try {
    const { className, section, day } = req.query;
    let filter = {};

    if (className) filter.className = className;
    if (section) filter.section = section;
    if (day) filter.day = day;

    const timetables = await Timetable.find(filter);
    res.status(200).json({ success: true, count: timetables.length, data: timetables });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get Single Timetable Entry by id
exports.getTimetableById = async (req, res) => {
  try {
    const timetable = await Timetable.findById(req.params.id);
    if (!timetable) {
      return res.status(404).json({ success: false, message: "Record not found" });
    }
    res.status(200).json({ success: true, data: timetable });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update Timetable Slot
exports.updateTimetable = async (req, res) => {
  try {
    const timetable = await Timetable.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    if (!timetable) {
      return res.status(404).json({ success: false, message: "Record not found" });
    }
    res.status(200).json({ success: true, message: "Updated successfully", data: timetable });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Delete Timetable Slot 
exports.deleteTimetable = async (req, res) => {
  try {
    const timetable = await Timetable.findByIdAndDelete(req.params.id);
    if (!timetable) {
      return res.status(404).json({ success: false, message: "Record not found" });
    }
    res.status(200).json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
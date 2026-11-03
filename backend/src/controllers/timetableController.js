const Timetable = require('../models/Timetable.model');

// Create new timetable
exports.createTimetable = async (req, res) => {
  try {
    const timetable = new Timetable({ ...req.body, school: req.user.school });
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
    let filter = { school: req.user.school };

    if (className) filter.className = className;
    if (section) filter.section = section;
    if (day) filter.day = day;

    if (req.user.role === 'student') { const Student = require('../models/Student'); const own = await Student.findOne({school:req.user.school,email:req.user.email}); if (!own) return res.json({success:true,count:0,data:[]}); filter.className = own.class || own.classId; filter.section = own.section || filter.section; }
    if (req.user.role === 'parent') { const Student = require('../models/Student'); const linked = await Student.find({school:req.user.school,$or:[{parentUsers:req.user._id},{guardianEmail:req.user.email}]}).select('class section classId'); const combos = linked.map(s=>({className:s.class||s.classId,section:s.section})); filter.$or = combos; }
    const timetables = await Timetable.find(filter);
    res.status(200).json({ success: true, count: timetables.length, data: timetables });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get Single Timetable Entry by id
exports.getTimetableById = async (req, res) => {
  try {
    const timetable = await Timetable.findOne({ _id: req.params.id, school: req.user.school });
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
    const timetable = await Timetable.findOneAndUpdate(
      { _id: req.params.id, school: req.user.school },
      { ...req.body, school:req.user.school },
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
    const timetable = await Timetable.findOneAndDelete({ _id: req.params.id, school: req.user.school });
    if (!timetable) {
      return res.status(404).json({ success: false, message: "Record not found" });
    }
    res.status(200).json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
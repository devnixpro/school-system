const Syllabus = require('../models/Syllabus.model');

// Get all subjects/syllabus
const getAllSyllabus = async (req, res) => {
  try {
    const syllabi = await Syllabus.find({});
    res.status(200).json({ success: true, data: syllabi });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single syllabus by custom id (e.g., 'cs101')
const getSyllabusById = async (req, res) => {
  try {
    const { id } = req.params;
    const syllabus = await Syllabus.findOne({ id });
    
    if (!syllabus) {
      return res.status(404).json({ success: false, message: 'Syllabus not found' });
    }
    
    res.status(200).json({ success: true, data: syllabus });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create a new syllabus document
const createSyllabus = async (req, res) => {
  try {
    const newSyllabus = new Syllabus(req.body);
    const savedSyllabus = await newSyllabus.save();
    res.status(201).json({ success: true, data: savedSyllabus });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Update topic status or overall progress
const updateProgress = async (req, res) => {
  try {
    const { id } = req.params;
    const { progress, completedModules, modules } = req.body;

    const updatedSyllabus = await Syllabus.findOneAndUpdate(
      { id },
      { 
        ...(progress !== undefined && { progress }),
        ...(completedModules !== undefined && { completedModules }),
        ...(modules && { modules })
      },
      { new: true, runValidators: true }
    );

    if (!updatedSyllabus) {
      return res.status(404).json({ success: false, message: 'Syllabus not found' });
    }

    res.status(200).json({ success: true, data: updatedSyllabus });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteSyllabus = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedSyllabus = await Syllabus.findOneAndDelete({ id });

    if (!deletedSyllabus) {
      return res.status(404).json({ success: false, message: 'Syllabus not found' });
    }

    res.status(200).json({ success: true, message: 'Syllabus deleted successfully', data: deletedSyllabus });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = {
  getAllSyllabus,
  getSyllabusById,
  createSyllabus,
  updateProgress,
  deleteSyllabus
};
const mongoose = require('mongoose');
const Homework = require('../models/Homework.model');

const isValidId = (id) => mongoose.isValidObjectId(id);

const validateHomeworkInput = (body) => {
  if (
    typeof body.title !== 'string' || !body.title.trim() ||
    typeof body.subject !== 'string' || !body.subject.trim() ||
    typeof body.className !== 'string' || !body.className.trim() ||
    typeof body.dueDate !== 'string' || Number.isNaN(Date.parse(body.dueDate)) ||
    (body.section !== undefined && typeof body.section !== 'string') ||
    (body.description !== undefined && typeof body.description !== 'string')
  ) {
    return 'Title, subject, class, and a valid due date are required.';
  }
  return null;
};

const listHomework = async (req, res, next) => {
  try {
    const filter = { school: req.user.school };
    if (req.query.className) filter.className = req.query.className;
    if (req.query.section !== undefined) filter.section = req.query.section;

    const items = await Homework.find(filter)
      .populate('createdBy', 'name')
      .sort({ dueDate: 1, createdAt: -1 })
      .limit(200);
    return res.json({ success: true, count: items.length, data: items });
  } catch (error) {
    return next(error);
  }
};

const createHomework = async (req, res, next) => {
  try {
    const validationError = validateHomeworkInput(req.body);
    if (validationError) return res.status(400).json({ success: false, message: validationError });

    const item = await Homework.create({
      title: req.body.title.trim(),
      subject: req.body.subject.trim(),
      className: req.body.className.trim(),
      section: req.body.section?.trim() || '',
      description: req.body.description?.trim() || '',
      dueDate: req.body.dueDate,
      school: req.user.school,
      createdBy: req.user._id,
    });
    return res.status(201).json({ success: true, data: item });
  } catch (error) {
    return next(error);
  }
};

const updateHomework = async (req, res, next) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid homework ID.' });
    }
    const validationError = validateHomeworkInput(req.body);
    if (validationError) return res.status(400).json({ success: false, message: validationError });

    const item = await Homework.findOneAndUpdate(
      { _id: req.params.id, school: req.user.school },
      {
        title: req.body.title.trim(),
        subject: req.body.subject.trim(),
        className: req.body.className.trim(),
        section: req.body.section?.trim() || '',
        description: req.body.description?.trim() || '',
        dueDate: req.body.dueDate,
      },
      { new: true, runValidators: true }
    );
    if (!item) return res.status(404).json({ success: false, message: 'Homework not found.' });
    return res.json({ success: true, data: item });
  } catch (error) {
    return next(error);
  }
};

const deleteHomework = async (req, res, next) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid homework ID.' });
    }
    const item = await Homework.findOneAndDelete({ _id: req.params.id, school: req.user.school });
    if (!item) return res.status(404).json({ success: false, message: 'Homework not found.' });
    return res.json({ success: true, message: 'Homework deleted.' });
  } catch (error) {
    return next(error);
  }
};

module.exports = { listHomework, createHomework, updateHomework, deleteHomework };

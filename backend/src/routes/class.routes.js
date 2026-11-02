const express = require('express');
const router = express.Router();

const Class = require('../models/Class.model');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role.middleware');

router.use(protect, authorize('admin'));

router.get('/', async (req, res, next) => {
  try {
    const classes = await Class.find({ school: req.user.school })
      .populate('teacher', 'name email')
      .populate('school', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: classes.length,
      data: classes,
    });
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const newClass = await Class.create({ ...req.body, school: req.user.school });

    res.status(201).json({
      success: true,
      message: 'Class created successfully',
      data: newClass,
    });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const updatedClass = await Class.findOneAndUpdate(
      { _id: req.params.id, school: req.user.school },
      { ...req.body, school: req.user.school },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedClass) {
      return res.status(404).json({
        success: false,
        message: 'Class not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Class updated successfully',
      data: updatedClass,
    });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const deletedClass = await Class.findOneAndDelete({ _id: req.params.id, school: req.user.school });

    if (!deletedClass) {
      return res.status(404).json({
        success: false,
        message: 'Class not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Class deleted successfully',
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
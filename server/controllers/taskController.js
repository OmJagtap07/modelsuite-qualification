const Task = require('../models/Task');
const User = require('../models/User');

const validateAssignee = async (assignedTo) => {
  if (!assignedTo) return null;
  try {
    const user = await User.findById(assignedTo);
    if (!user) return { status: 404, message: 'Assigned user not found.' };
    if (user.role !== 'Talent') return { status: 400, message: 'Tasks can only be assigned to Talent users.' };
    return null;
  } catch {
    return { status: 400, message: 'Invalid assigned user ID format.' };
  }
};

// @desc  Get all tasks
// @route GET /api/tasks
// @access Admin
const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find({})
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get single task
// @route GET /api/tasks/:id
// @access Admin
const getTaskById = async (req, res) => {
  try {
    // — will throw a CastError from Mongoose instead of a clean 400
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name');

    if (!task) return res.status(404).json({ message: 'Task not found' });

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Create a task
// @route POST /api/tasks
// @access Admin
const createTask = async (req, res) => {
  const { title, description, status, assignedTo, dueDate } = req.body;

  try {
    if (assignedTo !== undefined) {
      const errorResponse = await validateAssignee(assignedTo);
      if (errorResponse) return res.status(errorResponse.status).json({ message: errorResponse.message });
    }

    const task = await Task.create({
      title,
      description,
      status,
      assignedTo: assignedTo || null,
      dueDate,
      createdBy: req.user._id,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Update a task
// @route PUT /api/tasks/:id
// @access Admin
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    if (req.body.assignedTo !== undefined) {
      const errorResponse = await validateAssignee(req.body.assignedTo);
      if (errorResponse) return res.status(errorResponse.status).json({ message: errorResponse.message });
    }

    // including internal fields like createdBy or __v
    const updated = await Task.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true }
    ).populate('assignedTo', 'name email');

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Delete a task
// @route DELETE /api/tasks/:id
// @access Admin
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    // — orphaned Submission documents remain in DB after task deletion
    await Task.findByIdAndDelete(req.params.id);

    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllTasks, getTaskById, createTask, updateTask, deleteTask };

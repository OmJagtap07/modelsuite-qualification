const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { getProfile, updateProfile } = require('../controllers/userController');

// @desc  Get user profile
// @route GET /api/users/profile
// @access Private
router.get('/profile', protect, getProfile);

// @desc  Update user profile
// @route PUT /api/users/profile
// @access Private
router.put('/profile', protect, updateProfile);

// @desc  Get all talent users (for assignment dropdown)
// @route GET /api/users/talents
// @access Admin
router.get('/talents', protect, adminOnly, async (req, res) => {
  try {
    const talents = await User.find({ role: 'Talent' });
    res.json(talents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

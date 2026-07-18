const User = require('../models/User');

// @desc  Get user profile
// @route GET /api/users/profile
// @access Private
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Update user profile (bio, skills, interests)
// @route PUT /api/users/profile
// @access Private (Talent/Admin)
const updateProfile = async (req, res) => {
  const { bio, skills, interests } = req.body;

  if (bio !== undefined && typeof bio !== 'string') {
    return res.status(400).json({ message: 'Bio must be a string' });
  }

  if (skills !== undefined) {
    if (!Array.isArray(skills) || !skills.every(s => typeof s === 'string')) {
      return res.status(400).json({ message: 'Skills must be an array of strings' });
    }
  }

  if (interests !== undefined) {
    if (!Array.isArray(interests) || !interests.every(i => typeof i === 'string')) {
      return res.status(400).json({ message: 'Interests must be an array of strings' });
    }
  }

  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (bio !== undefined) user.bio = bio;
    if (skills !== undefined) user.skills = skills;
    if (interests !== undefined) user.interests = interests;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      bio: updatedUser.bio,
      skills: updatedUser.skills,
      interests: updatedUser.interests,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getProfile, updateProfile };

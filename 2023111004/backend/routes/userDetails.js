const express = require('express');
const user = require('./../database_tables/user');
const { authenticateJWT } = require('./../authentication/jwt_authentication');
const router = express.Router();

router.get('/', authenticateJWT, async (req, res) => {
  const email = req.user;
  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }
  try {
    const databaseUser = await user.findOne({ email });
    if (!databaseUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    const { password, ...userData } = databaseUser.toObject(); 
    res.json({ user: userData });
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
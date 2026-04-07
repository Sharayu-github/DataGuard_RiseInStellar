const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Login with wallet
router.post('/login', async (req, res) => {
  try {
    const { walletAddress } = req.body;

    if (!walletAddress) {
      return res.status(400).json({
        success: false,
        message: 'Wallet address required'
      });
    }

    // Create JWT token
    const token = jwt.sign(
      { walletAddress },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      user: {
        walletAddress,
        createdAt: new Date()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Login error: ' + error.message
    });
  }
});

// Logout
router.post('/logout', (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

// Get profile
router.get('/profile', (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'your-secret-key'
    );

    res.json({
      success: true,
      user: {
        walletAddress: decoded.walletAddress
      }
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');

// All routes require authentication
router.use(authMiddleware);

// Invoice management routes - to be implemented
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Invoice management module - coming soon',
    data: []
  });
});

router.post('/', (req, res) => {
  res.json({
    success: true,
    message: 'Invoice creation - coming soon'
  });
});

module.exports = router;
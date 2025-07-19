const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');

// All routes require authentication
router.use(authMiddleware);

// Project management routes - to be implemented
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Project management module - coming soon',
    data: []
  });
});

router.post('/', (req, res) => {
  res.json({
    success: true,
    message: 'Project creation - coming soon'
  });
});

module.exports = router;
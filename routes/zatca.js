const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');

// All routes require authentication
router.use(authMiddleware);

// ZATCA compliance routes - to be implemented
router.get('/settings', (req, res) => {
  res.json({
    success: true,
    message: 'ZATCA settings module - coming soon',
    data: {}
  });
});

router.post('/validate', (req, res) => {
  res.json({
    success: true,
    message: 'ZATCA validation - coming soon'
  });
});

module.exports = router;
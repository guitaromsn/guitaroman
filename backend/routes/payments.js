const express = require('express');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();
router.use(authenticateToken);

// Placeholder routes - to be implemented
router.get('/', (req, res) => {
    res.json({ success: true, message: 'Payments API - Coming Soon', data: [] });
});

module.exports = router;
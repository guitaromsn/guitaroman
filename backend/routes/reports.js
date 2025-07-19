const express = require('express');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();
router.use(authenticateToken);

// Placeholder routes - to be implemented
router.get('/dashboard', (req, res) => {
    res.json({ 
        success: true, 
        message: 'Reports API - Coming Soon', 
        data: {
            totalCustomers: 0,
            totalInvoices: 0,
            totalRevenue: 0,
            totalProfit: 0
        }
    });
});

module.exports = router;
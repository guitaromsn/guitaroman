const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');
const { authMiddleware } = require('../middleware/auth');

// All routes require authentication
router.use(authMiddleware);

// Inventory CRUD operations
router.get('/', inventoryController.getInventoryItems);
router.get('/:id', inventoryController.getInventoryItemById);
router.post('/', inventoryController.createInventoryItem);
router.put('/:id', inventoryController.updateInventoryItem);
router.delete('/:id', inventoryController.deleteInventoryItem);

// Inventory transactions
router.get('/:id/transactions', inventoryController.getItemTransactions);
router.post('/:id/transactions', inventoryController.createTransaction);

// Inventory reports
router.get('/reports/low-stock', inventoryController.getLowStockItems);
router.get('/reports/categories', inventoryController.getCategorySummary);
router.get('/reports/movements', inventoryController.getStockMovements);

module.exports = router;
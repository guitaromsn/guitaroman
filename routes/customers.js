const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const { authMiddleware } = require('../middleware/auth');

// All routes require authentication
router.use(authMiddleware);

// Customer CRUD operations
router.get('/', customerController.getCustomers);
router.get('/:id', customerController.getCustomerById);
router.post('/', customerController.createCustomer);
router.put('/:id', customerController.updateCustomer);
router.delete('/:id', customerController.deleteCustomer);

// Customer related operations
router.get('/:id/projects', customerController.getCustomerProjects);
router.get('/:id/invoices', customerController.getCustomerInvoices);
router.get('/:id/summary', customerController.getCustomerSummary);

module.exports = router;
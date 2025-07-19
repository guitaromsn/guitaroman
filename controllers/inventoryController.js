const inventoryService = require('../services/inventoryService');
const { validateInventoryItem } = require('../middleware/validation');

class InventoryController {
  async getInventoryItems(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search || '';
      const category = req.query.category || '';
      const sortBy = req.query.sortBy || 'Name';
      const sortOrder = req.query.sortOrder || 'ASC';

      const result = await inventoryService.getInventoryItems({
        page,
        limit,
        search,
        category,
        sortBy,
        sortOrder
      });

      res.json({
        success: true,
        data: result.items,
        pagination: {
          page,
          limit,
          total: result.total,
          pages: Math.ceil(result.total / limit)
        }
      });
    } catch (error) {
      console.error('Get inventory items error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getInventoryItemById(req, res) {
    try {
      const { id } = req.params;
      const item = await inventoryService.getInventoryItemById(id);

      if (!item) {
        return res.status(404).json({ error: 'Inventory item not found' });
      }

      res.json({
        success: true,
        data: item
      });
    } catch (error) {
      console.error('Get inventory item by ID error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async createInventoryItem(req, res) {
    try {
      const { error } = validateInventoryItem(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const result = await inventoryService.createInventoryItem(req.body, req.user.Id);

      if (!result.success) {
        return res.status(400).json({ error: result.message });
      }

      res.status(201).json({
        success: true,
        data: result.item
      });
    } catch (error) {
      console.error('Create inventory item error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async updateInventoryItem(req, res) {
    try {
      const { id } = req.params;
      const { error } = validateInventoryItem(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const result = await inventoryService.updateInventoryItem(id, req.body, req.user.Id);

      if (!result.success) {
        return res.status(400).json({ error: result.message });
      }

      res.json({
        success: true,
        data: result.item
      });
    } catch (error) {
      console.error('Update inventory item error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async deleteInventoryItem(req, res) {
    try {
      const { id } = req.params;
      const result = await inventoryService.deleteInventoryItem(id, req.user.Id);

      if (!result.success) {
        return res.status(400).json({ error: result.message });
      }

      res.json({
        success: true,
        message: 'Inventory item deleted successfully'
      });
    } catch (error) {
      console.error('Delete inventory item error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getItemTransactions(req, res) {
    try {
      const { id } = req.params;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const result = await inventoryService.getItemTransactions(id, { page, limit });

      res.json({
        success: true,
        data: result.transactions,
        pagination: {
          page,
          limit,
          total: result.total,
          pages: Math.ceil(result.total / limit)
        }
      });
    } catch (error) {
      console.error('Get item transactions error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async createTransaction(req, res) {
    try {
      const { id } = req.params;
      const { transactionType, quantity, unitCost, notes } = req.body;

      if (!transactionType || !quantity) {
        return res.status(400).json({ error: 'Transaction type and quantity are required' });
      }

      const result = await inventoryService.createTransaction({
        inventoryItemId: id,
        transactionType,
        quantity,
        unitCost,
        notes,
        createdBy: req.user.Id
      });

      if (!result.success) {
        return res.status(400).json({ error: result.message });
      }

      res.status(201).json({
        success: true,
        data: result.transaction
      });
    } catch (error) {
      console.error('Create transaction error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getLowStockItems(req, res) {
    try {
      const items = await inventoryService.getLowStockItems();

      res.json({
        success: true,
        data: items
      });
    } catch (error) {
      console.error('Get low stock items error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getCategorySummary(req, res) {
    try {
      const summary = await inventoryService.getCategorySummary();

      res.json({
        success: true,
        data: summary
      });
    } catch (error) {
      console.error('Get category summary error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getStockMovements(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const fromDate = req.query.fromDate;
      const toDate = req.query.toDate;

      const result = await inventoryService.getStockMovements({
        page,
        limit,
        fromDate,
        toDate
      });

      res.json({
        success: true,
        data: result.movements,
        pagination: {
          page,
          limit,
          total: result.total,
          pages: Math.ceil(result.total / limit)
        }
      });
    } catch (error) {
      console.error('Get stock movements error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = new InventoryController();
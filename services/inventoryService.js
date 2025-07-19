const { v4: uuidv4 } = require('uuid');
const { dbConnection, sql } = require('../config/database');

class InventoryService {
  async getInventoryItems(options = {}) {
    try {
      const { page = 1, limit = 10, search = '', category = '', sortBy = 'Name', sortOrder = 'ASC' } = options;
      const offset = (page - 1) * limit;

      let whereConditions = ['i.IsActive = 1'];
      const params = { offset, limit };

      if (search) {
        whereConditions.push('(i.Name LIKE @search OR i.SKU LIKE @search OR i.Description LIKE @search)');
        params.search = `%${search}%`;
      }

      if (category) {
        whereConditions.push('i.Category = @category');
        params.category = category;
      }

      const whereClause = whereConditions.join(' AND ');

      const countQuery = `
        SELECT COUNT(*) as total
        FROM InventoryItems i
        WHERE ${whereClause}
      `;

      const dataQuery = `
        SELECT 
          i.Id, i.Name, i.Description, i.SKU, i.Category, i.UnitPrice,
          i.Quantity, i.MinStockLevel, i.MaxStockLevel, i.Unit, i.VatRate,
          i.CreatedAt, i.UpdatedAt,
          u.FirstName + ' ' + u.LastName as CreatedByName,
          CASE 
            WHEN i.Quantity <= i.MinStockLevel THEN 'Low Stock'
            WHEN i.Quantity = 0 THEN 'Out of Stock'
            ELSE 'In Stock'
          END as StockStatus
        FROM InventoryItems i
        LEFT JOIN Users u ON i.CreatedBy = u.Id
        WHERE ${whereClause}
        ORDER BY i.${sortBy} ${sortOrder}
        OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY
      `;

      const [countResult, dataResult] = await Promise.all([
        dbConnection.executeQuery(countQuery, params),
        dbConnection.executeQuery(dataQuery, params)
      ]);

      return {
        items: dataResult.recordset,
        total: countResult.recordset[0].total
      };
    } catch (error) {
      console.error('Get inventory items error:', error);
      throw error;
    }
  }

  async getInventoryItemById(id) {
    try {
      const query = `
        SELECT 
          i.Id, i.Name, i.Description, i.SKU, i.Category, i.UnitPrice,
          i.Quantity, i.MinStockLevel, i.MaxStockLevel, i.Unit, i.VatRate,
          i.CreatedAt, i.UpdatedAt,
          u.FirstName + ' ' + u.LastName as CreatedByName,
          CASE 
            WHEN i.Quantity <= i.MinStockLevel THEN 'Low Stock'
            WHEN i.Quantity = 0 THEN 'Out of Stock'
            ELSE 'In Stock'
          END as StockStatus
        FROM InventoryItems i
        LEFT JOIN Users u ON i.CreatedBy = u.Id
        WHERE i.Id = @id AND i.IsActive = 1
      `;

      const result = await dbConnection.executeQuery(query, { id });
      return result.recordset[0] || null;
    } catch (error) {
      console.error('Get inventory item by ID error:', error);
      throw error;
    }
  }

  async createInventoryItem(itemData, createdBy) {
    try {
      const {
        name, description, sku, category, unitPrice, quantity = 0,
        minStockLevel = 0, maxStockLevel, unit = 'piece', vatRate = 15.00
      } = itemData;

      // Check if SKU already exists
      const existingItem = await this.getInventoryItemBySKU(sku);
      if (existingItem) {
        return { success: false, message: 'SKU already exists' };
      }

      const itemId = uuidv4();

      const query = `
        INSERT INTO InventoryItems (
          Id, Name, Description, SKU, Category, UnitPrice, Quantity,
          MinStockLevel, MaxStockLevel, Unit, VatRate, CreatedBy
        )
        OUTPUT INSERTED.*
        VALUES (
          @id, @name, @description, @sku, @category, @unitPrice, @quantity,
          @minStockLevel, @maxStockLevel, @unit, @vatRate, @createdBy
        )
      `;

      const result = await dbConnection.executeQuery(query, {
        id: itemId,
        name,
        description: description || null,
        sku,
        category: category || null,
        unitPrice,
        quantity,
        minStockLevel,
        maxStockLevel: maxStockLevel || null,
        unit,
        vatRate,
        createdBy
      });

      // Create initial stock transaction if quantity > 0
      if (quantity > 0) {
        await this.createTransaction({
          inventoryItemId: itemId,
          transactionType: 'adjustment',
          quantity: quantity,
          notes: 'Initial stock',
          createdBy
        });
      }

      return {
        success: true,
        item: result.recordset[0]
      };
    } catch (error) {
      console.error('Create inventory item error:', error);
      return { success: false, message: 'Failed to create inventory item' };
    }
  }

  async updateInventoryItem(id, itemData, updatedBy) {
    try {
      const {
        name, description, sku, category, unitPrice,
        minStockLevel, maxStockLevel, unit, vatRate
      } = itemData;

      // Check if item exists
      const existingItem = await this.getInventoryItemById(id);
      if (!existingItem) {
        return { success: false, message: 'Inventory item not found' };
      }

      // Check if SKU is already taken by another item
      if (sku !== existingItem.SKU) {
        const itemWithSKU = await this.getInventoryItemBySKU(sku);
        if (itemWithSKU && itemWithSKU.Id !== id) {
          return { success: false, message: 'SKU already in use by another item' };
        }
      }

      const query = `
        UPDATE InventoryItems 
        SET 
          Name = @name,
          Description = @description,
          SKU = @sku,
          Category = @category,
          UnitPrice = @unitPrice,
          MinStockLevel = @minStockLevel,
          MaxStockLevel = @maxStockLevel,
          Unit = @unit,
          VatRate = @vatRate,
          UpdatedAt = GETDATE()
        OUTPUT INSERTED.*
        WHERE Id = @id AND IsActive = 1
      `;

      const result = await dbConnection.executeQuery(query, {
        id,
        name,
        description: description || null,
        sku,
        category: category || null,
        unitPrice,
        minStockLevel,
        maxStockLevel: maxStockLevel || null,
        unit,
        vatRate
      });

      if (result.recordset.length === 0) {
        return { success: false, message: 'Inventory item not found' };
      }

      return {
        success: true,
        item: result.recordset[0]
      };
    } catch (error) {
      console.error('Update inventory item error:', error);
      return { success: false, message: 'Failed to update inventory item' };
    }
  }

  async deleteInventoryItem(id, deletedBy) {
    try {
      // Check if item exists and has no associated invoice items
      const itemCheck = await dbConnection.executeQuery(`
        SELECT 
          i.Id,
          (SELECT COUNT(*) FROM InvoiceItems WHERE InventoryItemId = i.Id) as InvoiceItemCount
        FROM InventoryItems i
        WHERE i.Id = @id AND i.IsActive = 1
      `, { id });

      if (itemCheck.recordset.length === 0) {
        return { success: false, message: 'Inventory item not found' };
      }

      const item = itemCheck.recordset[0];
      
      if (item.InvoiceItemCount > 0) {
        return { 
          success: false, 
          message: 'Cannot delete inventory item that has been used in invoices. Please archive instead.' 
        };
      }

      // Soft delete the item
      const query = `
        UPDATE InventoryItems 
        SET IsActive = 0, UpdatedAt = GETDATE()
        WHERE Id = @id
      `;

      await dbConnection.executeQuery(query, { id });

      return { success: true };
    } catch (error) {
      console.error('Delete inventory item error:', error);
      return { success: false, message: 'Failed to delete inventory item' };
    }
  }

  async getInventoryItemBySKU(sku) {
    try {
      const query = `
        SELECT Id, Name, SKU FROM InventoryItems 
        WHERE SKU = @sku AND IsActive = 1
      `;
      
      const result = await dbConnection.executeQuery(query, { sku });
      return result.recordset[0] || null;
    } catch (error) {
      console.error('Get inventory item by SKU error:', error);
      return null;
    }
  }

  async createTransaction(transactionData) {
    try {
      const {
        inventoryItemId, transactionType, quantity, unitCost, totalCost,
        referenceType, referenceId, notes, createdBy
      } = transactionData;

      const transactionId = uuidv4();
      const calculatedTotalCost = totalCost || (unitCost ? unitCost * Math.abs(quantity) : null);

      // Insert transaction
      const transactionQuery = `
        INSERT INTO InventoryTransactions (
          Id, InventoryItemId, TransactionType, Quantity, UnitCost, TotalCost,
          ReferenceType, ReferenceId, Notes, CreatedBy
        )
        OUTPUT INSERTED.*
        VALUES (
          @id, @inventoryItemId, @transactionType, @quantity, @unitCost, @totalCost,
          @referenceType, @referenceId, @notes, @createdBy
        )
      `;

      const transactionResult = await dbConnection.executeQuery(transactionQuery, {
        id: transactionId,
        inventoryItemId,
        transactionType,
        quantity,
        unitCost: unitCost || null,
        totalCost: calculatedTotalCost,
        referenceType: referenceType || null,
        referenceId: referenceId || null,
        notes: notes || null,
        createdBy
      });

      // Update inventory quantity
      const updateQuantityQuery = `
        UPDATE InventoryItems 
        SET Quantity = Quantity + @quantity, UpdatedAt = GETDATE()
        WHERE Id = @inventoryItemId
      `;

      await dbConnection.executeQuery(updateQuantityQuery, {
        inventoryItemId,
        quantity: transactionType === 'sale' ? -Math.abs(quantity) : Math.abs(quantity)
      });

      return {
        success: true,
        transaction: transactionResult.recordset[0]
      };
    } catch (error) {
      console.error('Create transaction error:', error);
      return { success: false, message: 'Failed to create transaction' };
    }
  }

  async getItemTransactions(inventoryItemId, options = {}) {
    try {
      const { page = 1, limit = 10 } = options;
      const offset = (page - 1) * limit;

      const countQuery = `
        SELECT COUNT(*) as total
        FROM InventoryTransactions
        WHERE InventoryItemId = @inventoryItemId
      `;

      const dataQuery = `
        SELECT 
          t.Id, t.TransactionType, t.Quantity, t.UnitCost, t.TotalCost,
          t.ReferenceType, t.ReferenceId, t.Notes, t.CreatedAt,
          u.FirstName + ' ' + u.LastName as CreatedByName
        FROM InventoryTransactions t
        LEFT JOIN Users u ON t.CreatedBy = u.Id
        WHERE t.InventoryItemId = @inventoryItemId
        ORDER BY t.CreatedAt DESC
        OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY
      `;

      const [countResult, dataResult] = await Promise.all([
        dbConnection.executeQuery(countQuery, { inventoryItemId }),
        dbConnection.executeQuery(dataQuery, { inventoryItemId, offset, limit })
      ]);

      return {
        transactions: dataResult.recordset,
        total: countResult.recordset[0].total
      };
    } catch (error) {
      console.error('Get item transactions error:', error);
      throw error;
    }
  }

  async getLowStockItems() {
    try {
      const query = `
        SELECT 
          Id, Name, SKU, Category, Quantity, MinStockLevel, Unit,
          CASE 
            WHEN Quantity = 0 THEN 'Out of Stock'
            ELSE 'Low Stock'
          END as StockStatus
        FROM InventoryItems
        WHERE Quantity <= MinStockLevel AND IsActive = 1
        ORDER BY 
          CASE WHEN Quantity = 0 THEN 0 ELSE 1 END,
          Quantity ASC
      `;

      const result = await dbConnection.executeQuery(query);
      return result.recordset;
    } catch (error) {
      console.error('Get low stock items error:', error);
      throw error;
    }
  }

  async getCategorySummary() {
    try {
      const query = `
        SELECT 
          ISNULL(Category, 'Uncategorized') as Category,
          COUNT(*) as ItemCount,
          SUM(Quantity) as TotalQuantity,
          SUM(Quantity * UnitPrice) as TotalValue,
          SUM(CASE WHEN Quantity <= MinStockLevel THEN 1 ELSE 0 END) as LowStockCount
        FROM InventoryItems
        WHERE IsActive = 1
        GROUP BY Category
        ORDER BY TotalValue DESC
      `;

      const result = await dbConnection.executeQuery(query);
      return result.recordset;
    } catch (error) {
      console.error('Get category summary error:', error);
      throw error;
    }
  }

  async getStockMovements(options = {}) {
    try {
      const { page = 1, limit = 10, fromDate, toDate } = options;
      const offset = (page - 1) * limit;

      let whereConditions = ['1=1'];
      const params = { offset, limit };

      if (fromDate) {
        whereConditions.push('t.CreatedAt >= @fromDate');
        params.fromDate = fromDate;
      }

      if (toDate) {
        whereConditions.push('t.CreatedAt <= @toDate');
        params.toDate = toDate;
      }

      const whereClause = whereConditions.join(' AND ');

      const countQuery = `
        SELECT COUNT(*) as total
        FROM InventoryTransactions t
        WHERE ${whereClause}
      `;

      const dataQuery = `
        SELECT 
          t.Id, t.TransactionType, t.Quantity, t.UnitCost, t.TotalCost,
          t.ReferenceType, t.ReferenceId, t.Notes, t.CreatedAt,
          i.Name as ItemName, i.SKU, i.Category,
          u.FirstName + ' ' + u.LastName as CreatedByName
        FROM InventoryTransactions t
        LEFT JOIN InventoryItems i ON t.InventoryItemId = i.Id
        LEFT JOIN Users u ON t.CreatedBy = u.Id
        WHERE ${whereClause}
        ORDER BY t.CreatedAt DESC
        OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY
      `;

      const [countResult, dataResult] = await Promise.all([
        dbConnection.executeQuery(countQuery, params),
        dbConnection.executeQuery(dataQuery, params)
      ]);

      return {
        movements: dataResult.recordset,
        total: countResult.recordset[0].total
      };
    } catch (error) {
      console.error('Get stock movements error:', error);
      throw error;
    }
  }
}

module.exports = new InventoryService();
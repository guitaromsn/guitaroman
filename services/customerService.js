const { v4: uuidv4 } = require('uuid');
const { dbConnection, sql } = require('../config/database');

class CustomerService {
  async getCustomers(options = {}) {
    try {
      const { page = 1, limit = 10, search = '', sortBy = 'Name', sortOrder = 'ASC' } = options;
      const offset = (page - 1) * limit;

      const searchCondition = search ? 
        `WHERE (c.Name LIKE @search OR c.Email LIKE @search OR c.Phone LIKE @search) AND c.IsActive = 1` :
        'WHERE c.IsActive = 1';

      const countQuery = `
        SELECT COUNT(*) as total
        FROM Customers c
        ${searchCondition}
      `;

      const dataQuery = `
        SELECT 
          c.Id, c.Name, c.Email, c.Phone, c.Address, c.City, c.Country,
          c.VatNumber, c.CommercialRegistration, c.PaymentTerms,
          c.CreatedAt, c.UpdatedAt,
          u.FirstName + ' ' + u.LastName as CreatedByName
        FROM Customers c
        LEFT JOIN Users u ON c.CreatedBy = u.Id
        ${searchCondition}
        ORDER BY c.${sortBy} ${sortOrder}
        OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY
      `;

      const searchParam = search ? `%${search}%` : '';

      const [countResult, dataResult] = await Promise.all([
        dbConnection.executeQuery(countQuery, { search: searchParam }),
        dbConnection.executeQuery(dataQuery, { 
          search: searchParam, 
          offset, 
          limit 
        })
      ]);

      return {
        customers: dataResult.recordset,
        total: countResult.recordset[0].total
      };
    } catch (error) {
      console.error('Get customers error:', error);
      throw error;
    }
  }

  async getCustomerById(id) {
    try {
      const query = `
        SELECT 
          c.Id, c.Name, c.Email, c.Phone, c.Address, c.City, c.Country,
          c.VatNumber, c.CommercialRegistration, c.PaymentTerms,
          c.CreatedAt, c.UpdatedAt,
          u.FirstName + ' ' + u.LastName as CreatedByName
        FROM Customers c
        LEFT JOIN Users u ON c.CreatedBy = u.Id
        WHERE c.Id = @id AND c.IsActive = 1
      `;

      const result = await dbConnection.executeQuery(query, { id });
      return result.recordset[0] || null;
    } catch (error) {
      console.error('Get customer by ID error:', error);
      throw error;
    }
  }

  async createCustomer(customerData, createdBy) {
    try {
      const { name, email, phone, address, city, country, vatNumber, commercialRegistration, paymentTerms = 30 } = customerData;

      // Check if customer with same name or email already exists
      if (email) {
        const existingCustomer = await this.getCustomerByEmail(email);
        if (existingCustomer) {
          return { success: false, message: 'Customer with this email already exists' };
        }
      }

      const customerId = uuidv4();

      const query = `
        INSERT INTO Customers (
          Id, Name, Email, Phone, Address, City, Country, 
          VatNumber, CommercialRegistration, PaymentTerms, CreatedBy
        )
        OUTPUT INSERTED.*
        VALUES (
          @id, @name, @email, @phone, @address, @city, @country,
          @vatNumber, @commercialRegistration, @paymentTerms, @createdBy
        )
      `;

      const result = await dbConnection.executeQuery(query, {
        id: customerId,
        name,
        email: email || null,
        phone: phone || null,
        address: address || null,
        city: city || null,
        country: country || null,
        vatNumber: vatNumber || null,
        commercialRegistration: commercialRegistration || null,
        paymentTerms,
        createdBy
      });

      return {
        success: true,
        customer: result.recordset[0]
      };
    } catch (error) {
      console.error('Create customer error:', error);
      return { success: false, message: 'Failed to create customer' };
    }
  }

  async updateCustomer(id, customerData, updatedBy) {
    try {
      const { name, email, phone, address, city, country, vatNumber, commercialRegistration, paymentTerms } = customerData;

      // Check if customer exists
      const existingCustomer = await this.getCustomerById(id);
      if (!existingCustomer) {
        return { success: false, message: 'Customer not found' };
      }

      // Check if email is already taken by another customer
      if (email) {
        const customerWithEmail = await this.getCustomerByEmail(email);
        if (customerWithEmail && customerWithEmail.Id !== id) {
          return { success: false, message: 'Email already in use by another customer' };
        }
      }

      const query = `
        UPDATE Customers 
        SET 
          Name = @name,
          Email = @email,
          Phone = @phone,
          Address = @address,
          City = @city,
          Country = @country,
          VatNumber = @vatNumber,
          CommercialRegistration = @commercialRegistration,
          PaymentTerms = @paymentTerms,
          UpdatedAt = GETDATE()
        OUTPUT INSERTED.*
        WHERE Id = @id AND IsActive = 1
      `;

      const result = await dbConnection.executeQuery(query, {
        id,
        name,
        email: email || null,
        phone: phone || null,
        address: address || null,
        city: city || null,
        country: country || null,
        vatNumber: vatNumber || null,
        commercialRegistration: commercialRegistration || null,
        paymentTerms
      });

      if (result.recordset.length === 0) {
        return { success: false, message: 'Customer not found' };
      }

      return {
        success: true,
        customer: result.recordset[0]
      };
    } catch (error) {
      console.error('Update customer error:', error);
      return { success: false, message: 'Failed to update customer' };
    }
  }

  async deleteCustomer(id, deletedBy) {
    try {
      // Check if customer exists and has no associated invoices or projects
      const customerCheck = await dbConnection.executeQuery(`
        SELECT 
          c.Id,
          (SELECT COUNT(*) FROM Invoices WHERE CustomerId = c.Id AND IsActive = 1) as InvoiceCount,
          (SELECT COUNT(*) FROM Projects WHERE CustomerId = c.Id AND IsActive = 1) as ProjectCount
        FROM Customers c
        WHERE c.Id = @id AND c.IsActive = 1
      `, { id });

      if (customerCheck.recordset.length === 0) {
        return { success: false, message: 'Customer not found' };
      }

      const customer = customerCheck.recordset[0];
      
      if (customer.InvoiceCount > 0 || customer.ProjectCount > 0) {
        return { 
          success: false, 
          message: 'Cannot delete customer with existing invoices or projects. Please archive instead.' 
        };
      }

      // Soft delete the customer
      const query = `
        UPDATE Customers 
        SET IsActive = 0, UpdatedAt = GETDATE()
        WHERE Id = @id
      `;

      await dbConnection.executeQuery(query, { id });

      return { success: true };
    } catch (error) {
      console.error('Delete customer error:', error);
      return { success: false, message: 'Failed to delete customer' };
    }
  }

  async getCustomerByEmail(email) {
    try {
      const query = `
        SELECT Id, Name, Email FROM Customers 
        WHERE Email = @email AND IsActive = 1
      `;
      
      const result = await dbConnection.executeQuery(query, { email: email.toLowerCase() });
      return result.recordset[0] || null;
    } catch (error) {
      console.error('Get customer by email error:', error);
      return null;
    }
  }

  async getCustomerProjects(customerId) {
    try {
      const query = `
        SELECT 
          p.Id, p.Name, p.Description, p.StartDate, p.EndDate, 
          p.Status, p.Budget, p.Currency, p.CreatedAt,
          u.FirstName + ' ' + u.LastName as CreatedByName
        FROM Projects p
        LEFT JOIN Users u ON p.CreatedBy = u.Id
        WHERE p.CustomerId = @customerId AND p.IsActive = 1
        ORDER BY p.CreatedAt DESC
      `;

      const result = await dbConnection.executeQuery(query, { customerId });
      return result.recordset;
    } catch (error) {
      console.error('Get customer projects error:', error);
      throw error;
    }
  }

  async getCustomerInvoices(customerId, options = {}) {
    try {
      const { page = 1, limit = 10 } = options;
      const offset = (page - 1) * limit;

      const countQuery = `
        SELECT COUNT(*) as total
        FROM Invoices
        WHERE CustomerId = @customerId AND IsActive = 1
      `;

      const dataQuery = `
        SELECT 
          i.Id, i.InvoiceNumber, i.InvoiceDate, i.DueDate, 
          i.TotalAmount, i.Currency, i.Status,
          p.Name as ProjectName
        FROM Invoices i
        LEFT JOIN Projects p ON i.ProjectId = p.Id
        WHERE i.CustomerId = @customerId AND i.IsActive = 1
        ORDER BY i.InvoiceDate DESC
        OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY
      `;

      const [countResult, dataResult] = await Promise.all([
        dbConnection.executeQuery(countQuery, { customerId }),
        dbConnection.executeQuery(dataQuery, { customerId, offset, limit })
      ]);

      return {
        invoices: dataResult.recordset,
        total: countResult.recordset[0].total
      };
    } catch (error) {
      console.error('Get customer invoices error:', error);
      throw error;
    }
  }

  async getCustomerSummary(customerId) {
    try {
      const query = `
        SELECT 
          c.Id,
          c.Name,
          c.Email,
          c.PaymentTerms,
          (SELECT COUNT(*) FROM Projects WHERE CustomerId = c.Id AND IsActive = 1) as TotalProjects,
          (SELECT COUNT(*) FROM Invoices WHERE CustomerId = c.Id AND IsActive = 1) as TotalInvoices,
          (SELECT ISNULL(SUM(TotalAmount), 0) FROM Invoices WHERE CustomerId = c.Id AND Status = 'paid' AND IsActive = 1) as TotalPaid,
          (SELECT ISNULL(SUM(TotalAmount), 0) FROM Invoices WHERE CustomerId = c.Id AND Status IN ('sent', 'overdue') AND IsActive = 1) as TotalOutstanding,
          (SELECT COUNT(*) FROM Invoices WHERE CustomerId = c.Id AND Status = 'overdue' AND IsActive = 1) as OverdueInvoices,
          (SELECT TOP 1 InvoiceDate FROM Invoices WHERE CustomerId = c.Id AND IsActive = 1 ORDER BY InvoiceDate DESC) as LastInvoiceDate
        FROM Customers c
        WHERE c.Id = @customerId AND c.IsActive = 1
      `;

      const result = await dbConnection.executeQuery(query, { customerId });
      return result.recordset[0] || null;
    } catch (error) {
      console.error('Get customer summary error:', error);
      throw error;
    }
  }
}

module.exports = new CustomerService();
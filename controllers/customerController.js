const customerService = require('../services/customerService');
const { validateCustomer } = require('../middleware/validation');

class CustomerController {
  async getCustomers(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search || '';
      const sortBy = req.query.sortBy || 'Name';
      const sortOrder = req.query.sortOrder || 'ASC';

      const result = await customerService.getCustomers({
        page,
        limit,
        search,
        sortBy,
        sortOrder
      });

      res.json({
        success: true,
        data: result.customers,
        pagination: {
          page,
          limit,
          total: result.total,
          pages: Math.ceil(result.total / limit)
        }
      });
    } catch (error) {
      console.error('Get customers error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getCustomerById(req, res) {
    try {
      const { id } = req.params;
      const customer = await customerService.getCustomerById(id);

      if (!customer) {
        return res.status(404).json({ error: 'Customer not found' });
      }

      res.json({
        success: true,
        data: customer
      });
    } catch (error) {
      console.error('Get customer by ID error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async createCustomer(req, res) {
    try {
      const { error } = validateCustomer(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const result = await customerService.createCustomer(req.body, req.user.Id);

      if (!result.success) {
        return res.status(400).json({ error: result.message });
      }

      res.status(201).json({
        success: true,
        data: result.customer
      });
    } catch (error) {
      console.error('Create customer error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async updateCustomer(req, res) {
    try {
      const { id } = req.params;
      const { error } = validateCustomer(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const result = await customerService.updateCustomer(id, req.body, req.user.Id);

      if (!result.success) {
        return res.status(400).json({ error: result.message });
      }

      res.json({
        success: true,
        data: result.customer
      });
    } catch (error) {
      console.error('Update customer error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async deleteCustomer(req, res) {
    try {
      const { id } = req.params;
      const result = await customerService.deleteCustomer(id, req.user.Id);

      if (!result.success) {
        return res.status(400).json({ error: result.message });
      }

      res.json({
        success: true,
        message: 'Customer deleted successfully'
      });
    } catch (error) {
      console.error('Delete customer error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getCustomerProjects(req, res) {
    try {
      const { id } = req.params;
      const projects = await customerService.getCustomerProjects(id);

      res.json({
        success: true,
        data: projects
      });
    } catch (error) {
      console.error('Get customer projects error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getCustomerInvoices(req, res) {
    try {
      const { id } = req.params;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const result = await customerService.getCustomerInvoices(id, { page, limit });

      res.json({
        success: true,
        data: result.invoices,
        pagination: {
          page,
          limit,
          total: result.total,
          pages: Math.ceil(result.total / limit)
        }
      });
    } catch (error) {
      console.error('Get customer invoices error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getCustomerSummary(req, res) {
    try {
      const { id } = req.params;
      const summary = await customerService.getCustomerSummary(id);

      res.json({
        success: true,
        data: summary
      });
    } catch (error) {
      console.error('Get customer summary error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = new CustomerController();
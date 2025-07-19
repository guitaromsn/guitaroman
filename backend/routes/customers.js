const express = require('express');
const { Op } = require('sequelize');
const Customer = require('../models/Customer');
const { authenticateToken, authorize } = require('../middleware/auth');

const router = express.Router();

// Apply authentication to all routes
router.use(authenticateToken);

// Generate customer code
const generateCustomerCode = async () => {
    const lastCustomer = await Customer.findOne({
        order: [['createdAt', 'DESC']]
    });
    
    if (!lastCustomer) {
        return 'CUS001';
    }
    
    const lastCode = lastCustomer.customer_code;
    const lastNumber = parseInt(lastCode.replace('CUS', ''));
    const newNumber = lastNumber + 1;
    return `CUS${newNumber.toString().padStart(3, '0')}`;
};

// GET /api/customers - Get all customers with pagination and search
router.get('/', async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 10, 
            search = '', 
            type = '', 
            active = 'true' 
        } = req.query;

        const offset = (parseInt(page) - 1) * parseInt(limit);
        
        const whereClause = {};
        
        // Search filter
        if (search) {
            whereClause[Op.or] = [
                { name_ar: { [Op.like]: `%${search}%` } },
                { name_en: { [Op.like]: `%${search}%` } },
                { customer_code: { [Op.like]: `%${search}%` } },
                { vat_number: { [Op.like]: `%${search}%` } },
                { email: { [Op.like]: `%${search}%` } }
            ];
        }

        // Type filter
        if (type) {
            whereClause.customer_type = type;
        }

        // Active filter
        if (active !== 'all') {
            whereClause.is_active = active === 'true';
        }

        const customers = await Customer.findAndCountAll({
            where: whereClause,
            limit: parseInt(limit),
            offset: offset,
            order: [['createdAt', 'DESC']]
        });

        res.json({
            success: true,
            data: {
                customers: customers.rows,
                pagination: {
                    total: customers.count,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    totalPages: Math.ceil(customers.count / parseInt(limit))
                }
            }
        });

    } catch (error) {
        console.error('Get customers error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch customers',
            error: error.message
        });
    }
});

// GET /api/customers/:id - Get single customer
router.get('/:id', async (req, res) => {
    try {
        const customer = await Customer.findByPk(req.params.id);

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: 'Customer not found'
            });
        }

        res.json({
            success: true,
            data: { customer }
        });

    } catch (error) {
        console.error('Get customer error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch customer',
            error: error.message
        });
    }
});

// POST /api/customers - Create new customer
router.post('/', authorize('admin', 'manager', 'accountant'), async (req, res) => {
    try {
        const {
            name_ar,
            name_en,
            vat_number,
            commercial_register,
            phone,
            email,
            address_ar,
            address_en,
            city,
            postal_code,
            country,
            customer_type,
            credit_limit,
            payment_terms,
            notes
        } = req.body;

        // Validate required fields
        if (!name_ar) {
            return res.status(400).json({
                success: false,
                message: 'Customer name in Arabic is required'
            });
        }

        // Generate customer code
        const customer_code = await generateCustomerCode();

        const customer = await Customer.create({
            customer_code,
            name_ar,
            name_en,
            vat_number,
            commercial_register,
            phone,
            email,
            address_ar,
            address_en,
            city,
            postal_code,
            country: country || 'Saudi Arabia',
            customer_type: customer_type || 'company',
            credit_limit: credit_limit || 0,
            payment_terms: payment_terms || 30,
            notes,
            created_by: req.user.id,
            updated_by: req.user.id
        });

        res.status(201).json({
            success: true,
            message: 'Customer created successfully',
            data: { customer }
        });

    } catch (error) {
        console.error('Create customer error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create customer',
            error: error.message
        });
    }
});

// PUT /api/customers/:id - Update customer
router.put('/:id', authorize('admin', 'manager', 'accountant'), async (req, res) => {
    try {
        const customer = await Customer.findByPk(req.params.id);

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: 'Customer not found'
            });
        }

        const {
            name_ar,
            name_en,
            vat_number,
            commercial_register,
            phone,
            email,
            address_ar,
            address_en,
            city,
            postal_code,
            country,
            customer_type,
            credit_limit,
            payment_terms,
            is_active,
            notes
        } = req.body;

        await customer.update({
            name_ar: name_ar || customer.name_ar,
            name_en,
            vat_number,
            commercial_register,
            phone,
            email,
            address_ar,
            address_en,
            city,
            postal_code,
            country,
            customer_type,
            credit_limit,
            payment_terms,
            is_active,
            notes,
            updated_by: req.user.id
        });

        res.json({
            success: true,
            message: 'Customer updated successfully',
            data: { customer }
        });

    } catch (error) {
        console.error('Update customer error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update customer',
            error: error.message
        });
    }
});

// DELETE /api/customers/:id - Soft delete customer
router.delete('/:id', authorize('admin', 'manager'), async (req, res) => {
    try {
        const customer = await Customer.findByPk(req.params.id);

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: 'Customer not found'
            });
        }

        await customer.update({
            is_active: false,
            updated_by: req.user.id
        });

        res.json({
            success: true,
            message: 'Customer deactivated successfully'
        });

    } catch (error) {
        console.error('Delete customer error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to deactivate customer',
            error: error.message
        });
    }
});

module.exports = router;
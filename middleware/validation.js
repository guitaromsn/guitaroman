const Joi = require('joi');

const validateLogin = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
  });

  return schema.validate(data);
};

const validateRegister = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])')).required()
      .messages({
        'string.pattern.base': 'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character'
      }),
    firstName: Joi.string().min(2).max(50).required(),
    lastName: Joi.string().min(2).max(50).required(),
    role: Joi.string().valid('admin', 'manager', 'user').default('user')
  });

  return schema.validate(data);
};

const validateCustomer = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().optional(),
    phone: Joi.string().min(10).max(20).optional(),
    address: Joi.string().max(500).optional(),
    city: Joi.string().max(50).optional(),
    country: Joi.string().max(50).optional(),
    vatNumber: Joi.string().max(20).optional(),
    commercialRegistration: Joi.string().max(20).optional(),
    paymentTerms: Joi.number().integer().min(0).default(30)
  });

  return schema.validate(data);
};

const validateInventoryItem = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    description: Joi.string().max(500).optional(),
    sku: Joi.string().max(50).required(),
    category: Joi.string().max(50).optional(),
    unitPrice: Joi.number().precision(2).min(0).required(),
    quantity: Joi.number().integer().min(0).default(0),
    minStockLevel: Joi.number().integer().min(0).default(0),
    maxStockLevel: Joi.number().integer().min(0).optional(),
    unit: Joi.string().max(20).default('piece'),
    vatRate: Joi.number().precision(2).min(0).max(100).default(15)
  });

  return schema.validate(data);
};

const validateInvoice = (data) => {
  const schema = Joi.object({
    customerId: Joi.string().uuid().required(),
    projectId: Joi.string().uuid().optional(),
    invoiceDate: Joi.date().default(() => new Date()),
    dueDate: Joi.date().optional(),
    items: Joi.array().items(
      Joi.object({
        inventoryItemId: Joi.string().uuid().required(),
        quantity: Joi.number().min(0.01).required(),
        unitPrice: Joi.number().precision(2).min(0).required(),
        discount: Joi.number().precision(2).min(0).max(100).default(0),
        description: Joi.string().max(500).optional()
      })
    ).min(1).required(),
    notes: Joi.string().max(1000).optional(),
    terms: Joi.string().max(1000).optional(),
    discountRate: Joi.number().precision(2).min(0).max(100).default(0),
    currency: Joi.string().length(3).default('SAR')
  });

  return schema.validate(data);
};

const validateProject = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    description: Joi.string().max(1000).optional(),
    customerId: Joi.string().uuid().required(),
    startDate: Joi.date().optional(),
    endDate: Joi.date().optional(),
    status: Joi.string().valid('planning', 'active', 'on-hold', 'completed', 'cancelled').default('planning'),
    budget: Joi.number().precision(2).min(0).optional(),
    currency: Joi.string().length(3).default('SAR')
  });

  return schema.validate(data);
};

module.exports = {
  validateLogin,
  validateRegister,
  validateCustomer,
  validateInventoryItem,
  validateInvoice,
  validateProject
};
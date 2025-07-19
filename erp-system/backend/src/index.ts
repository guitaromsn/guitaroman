import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandler';
import { authMiddleware } from './middleware/auth';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://yourdomain.com'] 
    : ['http://localhost:3000'],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'Amanat Al-Kalima ERP Backend'
  });
});

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/dashboard', authMiddleware, require('./routes/dashboard'));
app.use('/api/invoices', authMiddleware, require('./routes/invoices'));
app.use('/api/customers', authMiddleware, require('./routes/customers'));
app.use('/api/inventory', authMiddleware, require('./routes/inventory'));
app.use('/api/quotes', authMiddleware, require('./routes/quotes'));
app.use('/api/payments', authMiddleware, require('./routes/payments'));
app.use('/api/loans', authMiddleware, require('./routes/loans'));
app.use('/api/employees', authMiddleware, require('./routes/employees'));
app.use('/api/expenses', authMiddleware, require('./routes/expenses'));
app.use('/api/projects', authMiddleware, require('./routes/projects'));
app.use('/api/reports', authMiddleware, require('./routes/reports'));
app.use('/api/settings', authMiddleware, require('./routes/settings'));

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Amanat Al-Kalima ERP Backend running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV}`);
});

export default app;
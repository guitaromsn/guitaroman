import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    // Get various counts and statistics
    const [
      totalCustomers,
      totalInvoices,
      pendingInvoices,
      totalInventoryItems,
      totalRevenue,
      overdueInvoices
    ] = await Promise.all([
      prisma.customer.count({ where: { isActive: true } }),
      prisma.invoice.count(),
      prisma.invoice.count({ where: { status: 'SENT' } }),
      prisma.inventoryItem.count({ where: { isActive: true } }),
      prisma.invoice.aggregate({
        _sum: { totalAmount: true },
        where: { status: 'PAID' }
      }),
      prisma.invoice.count({
        where: {
          status: 'SENT',
          dueDate: { lt: new Date() }
        }
      })
    ]);

    // Get recent invoices
    const recentInvoices = await prisma.invoice.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        customer: {
          select: { name: true }
        }
      }
    });

    // Get low stock items
    const lowStockItems = await prisma.inventoryItem.findMany({
      where: {
        isActive: true,
        OR: [
          { minStock: { not: null }, currentStock: { lte: prisma.inventoryItem.fields.minStock } },
          { currentStock: { lte: 10 } } // Default low stock threshold
        ]
      },
      take: 10
    });

    const stats = {
      totalCustomers,
      totalInvoices,
      pendingInvoices,
      totalInventoryItems,
      totalRevenue: totalRevenue._sum.totalAmount || 0,
      overdueInvoices,
      recentInvoices,
      lowStockItems
    };

    res.json(stats);
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch dashboard statistics'
    });
  }
});

// Get monthly revenue data
router.get('/revenue-chart', async (req, res) => {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyRevenue = await prisma.invoice.groupBy({
      by: ['createdAt'],
      _sum: { totalAmount: true },
      where: {
        status: 'PAID',
        createdAt: { gte: sixMonthsAgo }
      },
      orderBy: { createdAt: 'asc' }
    });

    // Group by month
    const revenueByMonth = monthlyRevenue.reduce((acc: any, invoice) => {
      const month = invoice.createdAt.toISOString().slice(0, 7); // YYYY-MM format
      if (!acc[month]) {
        acc[month] = 0;
      }
      acc[month] += Number(invoice._sum.totalAmount || 0);
      return acc;
    }, {});

    const chartData = Object.entries(revenueByMonth).map(([month, revenue]) => ({
      month,
      revenue
    }));

    res.json(chartData);
  } catch (error) {
    console.error('Revenue chart error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch revenue chart data'
    });
  }
});

module.exports = router;
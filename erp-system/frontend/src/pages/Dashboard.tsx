import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Paper,
} from '@mui/material';
import {
  TrendingUp,
  Receipt,
  Inventory,
  People,
  AttachMoney,
  Warning,
} from '@mui/icons-material';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  subtitle?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, subtitle }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography color="textSecondary" gutterBottom variant="h6">
            {title}
          </Typography>
          <Typography variant="h4" component="h2" sx={{ color }}>
            {value}
          </Typography>
          {subtitle && (
            <Typography color="textSecondary" variant="body2">
              {subtitle}
            </Typography>
          )}
        </Box>
        <Box sx={{ color, fontSize: 40 }}>
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const Dashboard: React.FC = () => {
  // Mock data - would come from API in real implementation
  const stats = [
    {
      title: 'Total Revenue',
      value: 'SAR 2,450,000',
      icon: <AttachMoney />,
      color: '#4caf50',
      subtitle: 'This month'
    },
    {
      title: 'Pending Invoices',
      value: '24',
      icon: <Receipt />,
      color: '#ff9800',
      subtitle: 'SAR 125,000 value'
    },
    {
      title: 'Inventory Items',
      value: '156',
      icon: <Inventory />,
      color: '#2196f3',
      subtitle: '12,500 KG total'
    },
    {
      title: 'Active Customers',
      value: '89',
      icon: <People />,
      color: '#9c27b0',
      subtitle: '15 new this month'
    },
    {
      title: 'Overdue Payments',
      value: 'SAR 45,000',
      icon: <Warning />,
      color: '#f44336',
      subtitle: '8 invoices overdue'
    },
    {
      title: 'Monthly Growth',
      value: '+12.5%',
      icon: <TrendingUp />,
      color: '#4caf50',
      subtitle: 'Compared to last month'
    },
  ];

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" gutterBottom>
        Welcome to Amanat Al-Kalima ERP System
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <StatCard {...stat} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Invoices
            </Typography>
            <Typography color="textSecondary">
              Invoice management functionality will be implemented here
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Inventory Status
            </Typography>
            <Typography color="textSecondary">
              Low stock alerts and inventory overview will be displayed here
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Sales Performance
            </Typography>
            <Typography color="textSecondary">
              Charts and analytics for sales performance will be implemented here
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
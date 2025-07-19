import React from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  LinearProgress
} from '@mui/material';
import {
  People as PeopleIcon,
  Receipt as ReceiptIcon,
  TrendingUp as TrendingUpIcon,
  AccountBalance as AccountBalanceIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

const Dashboard = () => {
  const { t } = useTranslation();

  const stats = [
    {
      title: t('total_customers'),
      value: '0',
      icon: <PeopleIcon sx={{ fontSize: 40, color: '#1976d2' }} />,
      color: '#1976d2'
    },
    {
      title: t('total_invoices'),
      value: '0',
      icon: <ReceiptIcon sx={{ fontSize: 40, color: '#388e3c' }} />,
      color: '#388e3c'
    },
    {
      title: t('total_revenue'),
      value: '0 ر.س',
      icon: <TrendingUpIcon sx={{ fontSize: 40, color: '#f57c00' }} />,
      color: '#f57c00'
    },
    {
      title: t('total_profit'),
      value: '0 ر.س',
      icon: <AccountBalanceIcon sx={{ fontSize: 40, color: '#7b1fa2' }} />,
      color: '#7b1fa2'
    }
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
        {t('dashboard')}
      </Typography>
      
      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card elevation={2}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="textSecondary" gutterBottom variant="h6">
                      {stat.title}
                    </Typography>
                    <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold' }}>
                      {stat.value}
                    </Typography>
                  </Box>
                  {stat.icon}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: 300 }}>
            <Typography variant="h6" gutterBottom>
              مخطط المبيعات الشهرية
            </Typography>
            <Box display="flex" alignItems="center" justifyContent="center" height="80%">
              <Typography color="textSecondary">
                سيتم إضافة المخططات قريباً...
              </Typography>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: 300 }}>
            <Typography variant="h6" gutterBottom>
              أحدث الفواتير
            </Typography>
            <Box display="flex" alignItems="center" justifyContent="center" height="80%">
              <Typography color="textSecondary">
                لا توجد فواتير بعد
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              حالة النظام
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" gutterBottom>
                العملاء: نشط
              </Typography>
              <LinearProgress variant="determinate" value={100} sx={{ mb: 2 }} />
              
              <Typography variant="body2" gutterBottom>
                الفواتير: قيد التطوير
              </Typography>
              <LinearProgress variant="determinate" value={30} sx={{ mb: 2 }} />
              
              <Typography variant="body2" gutterBottom>
                المخزون: قيد التطوير
              </Typography>
              <LinearProgress variant="determinate" value={10} sx={{ mb: 2 }} />
              
              <Typography variant="body2" gutterBottom>
                التقارير: قيد التطوير
              </Typography>
              <LinearProgress variant="determinate" value={5} />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
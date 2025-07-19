import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { useTranslation } from 'react-i18next';

const Invoices = () => {
  const { t } = useTranslation();

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
        {t('invoices')}
      </Typography>
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="textSecondary">
          قائمة الفواتير قيد التطوير
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
          سيتم إضافة وظائف إنشاء وإدارة الفواتير مع تكامل ZATCA للفواتير الإلكترونية
        </Typography>
      </Paper>
    </Box>
  );
};

export default Invoices;
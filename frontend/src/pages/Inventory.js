import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { useTranslation } from 'react-i18next';

const Inventory = () => {
  const { t } = useTranslation();

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
        {t('inventory')}
      </Typography>
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="textSecondary">
          إدارة المخزون قيد التطوير
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
          سيتم إضافة وظائف تتبع مخزون المعادن والخردة مع تنبيهات نفاد المخزون
        </Typography>
      </Paper>
    </Box>
  );
};

export default Inventory;
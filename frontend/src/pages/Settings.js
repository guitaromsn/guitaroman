import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { useTranslation } from 'react-i18next';

const Settings = () => {
  const { t } = useTranslation();

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
        {t('settings')}
      </Typography>
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="textSecondary">
          الإعدادات قيد التطوير
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
          سيتم إضافة إعدادات النظام والمستخدمين واللغة وتكامل ZATCA
        </Typography>
      </Paper>
    </Box>
  );
};

export default Settings;
import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { useTranslation } from 'react-i18next';

const Projects = () => {
  const { t } = useTranslation();

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
        {t('projects')}
      </Typography>
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="textSecondary">
          إدارة المشاريع قيد التطوير
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
          سيتم إضافة وظائف تتبع مشاريع تجارة الخردة والمعادن مع حساب التكاليف والأرباح
        </Typography>
      </Paper>
    </Box>
  );
};

export default Projects;
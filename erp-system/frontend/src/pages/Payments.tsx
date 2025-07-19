import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const Payments: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Payment Management
      </Typography>
      <Paper sx={{ p: 3, mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          Payment Tracking System
        </Typography>
        <Typography color="textSecondary" paragraph>
          This module will include:
        </Typography>
        <ul>
          <li>Track and record all payments from customers</li>
          <li>Clear financial records for scrap metal and material sales</li>
          <li>Payment method tracking (Cash, Bank Transfer, Check, Credit Card)</li>
          <li>Payment reconciliation</li>
          <li>Outstanding payment reports</li>
          <li>Payment reminders and follow-up</li>
        </ul>
      </Paper>
    </Box>
  );
};

export default Payments;
import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const Invoices: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Invoices Management
      </Typography>
      <Paper sx={{ p: 3, mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          ZATCA-Compliant Invoice System
        </Typography>
        <Typography color="textSecondary" paragraph>
          This module will include:
        </Typography>
        <ul>
          <li>Create and manage invoices for metal scrap transactions</li>
          <li>ZATCA e-invoicing compliance with electronic submission</li>
          <li>Site-specific invoicing with detailed VAT tracking</li>
          <li>Sales receipts management</li>
          <li>Invoice templates and customization</li>
          <li>PDF generation and email delivery</li>
        </ul>
      </Paper>
    </Box>
  );
};

export default Invoices;
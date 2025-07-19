import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const Quotes: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Quotes Management
      </Typography>
      <Paper sx={{ p: 3, mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          Quote Generation System
        </Typography>
        <Typography color="textSecondary" paragraph>
          This module will include:
        </Typography>
        <ul>
          <li>Generate and manage accurate quotes for scrap metal transactions</li>
          <li>Ensure consistency and profitability in pricing</li>
          <li>Include quotes for material procurement and site-specific projects</li>
          <li>Quote templates and customization</li>
          <li>Quote tracking and follow-up</li>
          <li>Convert quotes to invoices</li>
        </ul>
      </Paper>
    </Box>
  );
};

export default Quotes;
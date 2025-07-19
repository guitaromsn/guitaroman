import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const Inventory: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Inventory Management
      </Typography>
      <Paper sx={{ p: 3, mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          Metal Scrap Inventory System
        </Typography>
        <Typography color="textSecondary" paragraph>
          This module will include:
        </Typography>
        <ul>
          <li>Oversee metal scrap inventory (types, weights, quantities, market pricing)</li>
          <li>Track materials from procurement to sales</li>
          <li>Accurate stock levels aligned with project requirements</li>
          <li>Automated stock alerts for low inventory</li>
          <li>Inventory movement tracking</li>
          <li>Cost analysis and pricing optimization</li>
        </ul>
      </Paper>
    </Box>
  );
};

export default Inventory;
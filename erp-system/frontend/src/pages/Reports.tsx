import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const Reports: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Reports & Analytics
      </Typography>
      <Paper sx={{ p: 3, mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          Business Intelligence & Reporting
        </Typography>
        <Typography color="textSecondary" paragraph>
          This module will include:
        </Typography>
        <ul>
          <li>Generate detailed financial and operational reports</li>
          <li>Profit margins, scrap inventory turnover, project costs, sales performance</li>
          <li>Customized reports for material tracking and site-specific financials</li>
          <li>VAT reports for tax authority submission</li>
          <li>Export capabilities (PDF, Excel)</li>
          <li>Real-time analytics dashboard</li>
        </ul>
      </Paper>
    </Box>
  );
};

export default Reports;
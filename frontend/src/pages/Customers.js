import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  Grid,
  Alert,
  CircularProgress
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Add as AddIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const Customers = () => {
  const { t } = useTranslation();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const columns = [
    { field: 'customer_code', headerName: t('customer_code'), width: 130 },
    { field: 'name_ar', headerName: t('customer_name'), width: 200 },
    { field: 'phone', headerName: t('phone'), width: 150 },
    { field: 'email', headerName: t('email'), width: 200 },
    { field: 'city', headerName: 'المدينة', width: 150 },
    {
      field: 'actions',
      headerName: t('actions'),
      width: 150,
      renderCell: (params) => (
        <Box>
          <Button size="small" onClick={() => handleEdit(params.row.id)}>
            {t('edit')}
          </Button>
        </Box>
      ),
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axios.get('/api/customers', {
          params: {
            search: searchTerm,
            limit: 100
          }
        });
        setCustomers(response.data.data.customers);
      } catch (error) {
        console.error('Error fetching customers:', error);
        setError('فشل في تحميل العملاء');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchTerm]);

  const handleEdit = (id) => {
    // TODO: Implement edit functionality
    console.log('Edit customer:', id);
  };

  const handleAddCustomer = () => {
    // TODO: Implement add customer functionality
    console.log('Add new customer');
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
          {t('customers')}
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddCustomer}
        >
          {t('add_customer')}
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label={t('search')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="البحث بالاسم أو رمز العميل..."
          />
        </Grid>
      </Grid>

      <Paper sx={{ height: 400, width: '100%' }}>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="100%">
            <CircularProgress />
          </Box>
        ) : (
          <DataGrid
            rows={customers}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10, 25, 50]}
            disableSelectionOnClick
            localeText={{
              noRowsLabel: 'لا توجد بيانات',
              footerRowSelected: (count) => `${count} صف محدد`,
            }}
          />
        )}
      </Paper>
    </Box>
  );
};

export default Customers;
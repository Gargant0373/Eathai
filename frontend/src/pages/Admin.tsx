import React from 'react';
import { Button, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Admin: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ maxWidth: 600, margin: 'auto', mt: 5 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Admin Dashboard
      </Typography>
      <Button
        variant="contained"
        fullWidth
        onClick={() => navigate('/admin/create-food')}
        sx={{ mt: 3 }}
      >
        Add Food Item
      </Button>
    </Box>
  );
};

export default Admin;

import React, { useEffect, useState } from 'react';
import { Box, Button, Typography, IconButton, Grid, Card, CardContent, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import GroupIcon from '@mui/icons-material/Group';
import { useNavigate } from 'react-router-dom';
import { getAllOrders, updateOrderStatus } from '../services/orderService';
import { Order } from '../models';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await getAllOrders();
        const filteredOrders = response.orders.filter(
          (order: Order) => order.status === 'pending' || order.status === 'confirmed'
        );
        setOrders(filteredOrders);
      } catch (error: any) {
        console.error('Failed to fetch orders:', error.response?.data?.error || error.message);
      }
    };

    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: number, newStatus: 'pending' | 'confirmed' | 'completed' | 'cancelled') => {
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error: any) {
      console.error('Failed to update order status:', error.response?.data?.error || error.message);
    }
  };

  return (
    <Box sx={{ maxWidth: 900, margin: 'auto', mt: 5 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate('/main')}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" sx={{ fontWeight: 'bold', ml: 2 }}>
          Admin Dashboard
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mb: 4 }}>
        <Button
          variant="contained"
          startIcon={<AddCircleIcon />}
          onClick={() => navigate('/admin/create-food')}
          sx={{
            backgroundColor: '#007bff',
            textTransform: 'none',
            '&:hover': { backgroundColor: '#0056b3' },
          }}
        >
          Create Food
        </Button>
        <Button
          variant="contained"
          startIcon={<GroupIcon />}
          onClick={() => navigate('/admin/user-management')}
          sx={{
            backgroundColor: '#007bff',
            textTransform: 'none',
            '&:hover': { backgroundColor: '#0056b3' },
          }}
        >
          User Management
        </Button>
      </Box>

      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
        Manage Orders
      </Typography>

      <Grid container spacing={3}>
        {orders.map((order) => (
          <Grid item xs={12} sm={6} md={4} key={order.id}>
            <Card sx={{ borderRadius: 4, boxShadow: 3, padding: 2 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {order.food.name}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Quantity:</strong> {order.quantity}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>User Email:</strong> {order.user.email}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Status:</strong> {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Typography>
                <FormControl fullWidth>
                  <InputLabel>Update Status</InputLabel>
                  <Select
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(order.id, e.target.value as 'pending' | 'confirmed' | 'completed' | 'cancelled')
                    }
                    sx={{ mt: 1 }}
                  >
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="confirmed">Confirmed</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                    <MenuItem value="cancelled">Cancelled</MenuItem>
                  </Select>
                </FormControl>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AdminDashboard;

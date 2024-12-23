import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CancelIcon from '@mui/icons-material/Cancel';
import DoneIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import PendingIcon from '@mui/icons-material/HourglassEmpty';
import { Box, Button, Card, CardContent, Chip, Grid, IconButton, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { handleFormatDate } from '../components/FoodItemCard';
import { Order } from '../models';
import { cancelOrder, getUserOrders } from '../services/orderService';

const ViewOrder: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await getUserOrders();
        const selectedOrder = response.orders.find((o: Order) => o.id === parseInt(id!));
        if (!selectedOrder) {
          alert('Order not found.');
          navigate('/main');
        }
        setOrder(selectedOrder);
      } catch (error: any) {
        alert(error.response?.data?.error || 'Failed to fetch order details.');
        navigate('/main');
      }
    };

    fetchOrder();
  }, [id, navigate]);

  const handleCancelOrder = async () => {
    if (!order || order.status !== 'pending') {
      alert('Only pending orders can be canceled.');
      return;
    }

    try {
      await cancelOrder(order.id);
      alert('Order canceled successfully!');
      navigate('/main');
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to cancel order.');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <PendingIcon sx={{ color: 'orange' }} />;
      case 'confirmed':
        return <DoneIcon sx={{ color: 'blue' }} />;
      case 'completed':
        return <DoneIcon sx={{ color: 'green' }} />;
      case 'cancelled':
        return <CancelIcon sx={{ color: 'red' }} />;
      default:
        return <ErrorIcon sx={{ color: 'gray' }} />;
    }
  };

  if (!order) return null;

  return (
    <Box sx={{ maxWidth: 700, margin: 'auto', mt: 5, px: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <IconButton onClick={() => navigate('/main')}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" sx={{ fontWeight: 'bold', ml: 2 }}>
          Order Details
        </Typography>
      </Box>

      <Card
        sx={{
          padding: 3,
          borderRadius: 4,
          boxShadow: 3,
          backgroundColor: '#f9f9f9',
        }}
      >
        <CardContent>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#007BFF', mb: 2 }}>
            {order.food.name}
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3 }}>
            {order.food.description}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                <strong>Quantity:</strong>&nbsp; {order.quantity}
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                <strong>Status:</strong>&nbsp;
                <Chip
                  icon={getStatusIcon(order.status)}
                  label={order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  color={
                    order.status === 'pending'
                      ? 'warning'
                      : order.status === 'confirmed'
                      ? 'primary'
                      : order.status === 'completed'
                      ? 'success'
                      : 'error'
                  }
                  size="small"
                  sx={{ textTransform: 'capitalize' }}
                />
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                <strong>Date:</strong>&nbsp; {handleFormatDate(order.timestamp * 1000)}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>

        {order.status === 'pending' && (
          <Button
            variant="contained"
            color="error"
            fullWidth
            sx={{
              mt: 3,
              borderRadius: 2,
              textTransform: 'none',
              backgroundColor: '#ff5c5c',
              '&:hover': {
                backgroundColor: '#ff4040',
              },
            }}
            onClick={handleCancelOrder}
          >
            Cancel Order
          </Button>
        )}
      </Card>
    </Box>
  );
};

export default ViewOrder;

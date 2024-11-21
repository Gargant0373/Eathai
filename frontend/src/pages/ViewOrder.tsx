import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Box, Button, Card, CardContent } from '@mui/material';
import { getUserOrders, cancelOrder } from '../services/orderService';
import { Order } from '../models';
import dayjs from 'dayjs';

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

  if (!order) return null;

  return (
    <Box sx={{ maxWidth: 600, margin: 'auto', mt: 5 }}>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Order Details
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Food:</strong> {order.food.name}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Description:</strong> {order.food.description}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Quantity:</strong> {order.quantity}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Status:</strong> {order.status}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Order Date:</strong> {dayjs(order.timestamp).format('DD/MM/YYYY HH:mm')}
          </Typography>
        </CardContent>
      </Card>

      {order.status === 'pending' && (
        <Button
          variant="contained"
          color="error"
          fullWidth
          sx={{ mt: 3 }}
          onClick={handleCancelOrder}
        >
          Cancel Order
        </Button>
      )}
    </Box>
  );
};

export default ViewOrder;

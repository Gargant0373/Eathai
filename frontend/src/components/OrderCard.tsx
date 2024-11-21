import React from 'react';
import { Card, CardContent, CardActions, Typography, Button, Chip, Grid } from '@mui/material';
import { Order } from '../models';
import PendingIcon from '@mui/icons-material/HourglassEmpty';
import DoneIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ErrorIcon from '@mui/icons-material/Error';

interface OrderCardProps {
  order: Order;
  onViewOrder: (orderId: number) => void;
}

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

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return 'warning';
    case 'confirmed':
      return 'info';
    case 'completed':
      return 'success';
    case 'cancelled':
      return 'error';
    default:
      return 'default';
  }
};

const OrderCard: React.FC<OrderCardProps> = ({ order, onViewOrder }) => {
  return (
    <Card
      sx={{
        padding: 3,
        borderRadius: 4,
        boxShadow: 3,
        backgroundColor: '#f9f9f9',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
      }}
    >
      <CardContent>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 'bold',
            color: '#007BFF',
            mb: 2,
            textAlign: 'center',
          }}
        >
          {order.food.name}
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography
              variant="body1"
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <strong>Quantity:</strong>&nbsp; {order.quantity}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography
              variant="body1"
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <strong>Status:</strong>&nbsp;
              <Chip
                icon={getStatusIcon(order.status)}
                label={order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                color={getStatusColor(order.status)}
                size="small"
                sx={{ textTransform: 'capitalize' }}
              />
            </Typography>
          </Grid>
        </Grid>
      </CardContent>

      <CardActions sx={{ justifyContent: 'center', mt: 2 }}>
        <Button
          variant="contained"
          size="large"
          onClick={() => onViewOrder(order.id)}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            paddingX: 3,
            backgroundColor: '#007bff',
            '&:hover': {
              backgroundColor: '#0056b3',
            },
          }}
        >
          View Order
        </Button>
      </CardActions>
    </Card>
  );
};

export default OrderCard;

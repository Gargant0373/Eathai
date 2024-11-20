import React from 'react';
import { Card, CardContent, CardActions, Typography, Button } from '@mui/material';
import { Order } from '../models';

interface OrderCardProps {
  order: Order;
  onViewOrder: (orderId: number) => void;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, onViewOrder }) => {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <CardContent>
        <Typography variant="h6">{order.food.name}</Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          Quantity: {order.quantity}
        </Typography>
        <Typography variant="body2">
          Status: {order.status}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          variant="contained"
          size="small"
          onClick={() => onViewOrder(order.id)}
          sx={{ ml: 1, mb: 1 }}
        >
          View Order
        </Button>
      </CardActions>
    </Card>
  );
};

export default OrderCard;

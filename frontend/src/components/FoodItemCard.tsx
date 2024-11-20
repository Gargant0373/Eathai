import React from 'react';
import { Card, CardContent, CardActions, Typography, Button } from '@mui/material';
import { FoodItem } from '../models';

interface FoodItemCardProps {
  food: FoodItem;
  onPlaceOrder: (foodId: number) => void;
}

const FoodItemCard: React.FC<FoodItemCardProps> = ({ food, onPlaceOrder }) => {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <CardContent>
        <Typography variant="h6">{food.name}</Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          {food.description}
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          Price: ${food.price.toFixed(2)}
        </Typography>
        <Typography variant="body2">
          Available: {food.quantity_available || 'Unlimited'}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          variant="contained"
          size="small"
          onClick={() => onPlaceOrder(food.id)}
          sx={{ ml: 1, mb: 1 }}
        >
          Place Order
        </Button>
      </CardActions>
    </Card>
  );
};

export default FoodItemCard;

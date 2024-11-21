import React from 'react';
import { Card, CardContent, CardActions, Typography, Button } from '@mui/material';
import { FoodItem } from '../models';

interface FoodItemCardProps {
  food: FoodItem;
  onPlaceOrder: (foodId: number) => void;
}

const FoodItemCard: React.FC<FoodItemCardProps> = ({ food, onPlaceOrder }) => {
  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 2,
        boxShadow: 3,
        borderRadius: 2,
        backgroundColor: '#ffffff',
      }}
    >
      <CardContent sx={{ textAlign: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
          {food.name}
        </Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
          {food.description}
        </Typography>

        <Typography variant="body1" sx={{ mb: 1 }}>
          <strong>Price:</strong> ${food.price.toFixed(2)}
        </Typography>

        <Typography variant="body1">
          <strong>Available:</strong> {food.quantity_available || 'Unlimited'}
        </Typography>
      </CardContent>

      <CardActions sx={{ justifyContent: 'center', mt: 2 }}>
        <Button
          variant="contained"
          size="medium"
          onClick={() => onPlaceOrder(food.id)}
          sx={{
            borderRadius: '20px',
            textTransform: 'none',
            paddingX: 3,
            backgroundColor: '#007bff',
            '&:hover': {
              backgroundColor: '#0056b3',
            },
          }}
        >
          Place Order
        </Button>
      </CardActions>
    </Card>
  );
};

export default FoodItemCard;

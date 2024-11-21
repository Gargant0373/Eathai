import React from 'react';
import { Card, CardContent, CardActions, Typography, Button, Grid } from '@mui/material';
import { FoodItem } from '../models';

interface FoodItemCardProps {
  food: FoodItem;
  onPlaceOrder: (foodId: number) => void;
}

const FoodItemCard: React.FC<FoodItemCardProps> = ({ food, onPlaceOrder }) => {
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
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#007BFF', mb: 2, textAlign: 'center' }}>
          {food.name}
        </Typography>

        <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3, textAlign: 'center' }}>
          {food.description}
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <strong>Price:</strong>&nbsp; ${food.price.toFixed(2)}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <strong>Available:</strong>&nbsp; {food.quantity_available || 'Unlimited'}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>

      <CardActions sx={{ justifyContent: 'center', mt: 2 }}>
        <Button
          variant="contained"
          size="large"
          onClick={() => onPlaceOrder(food.id)}
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
          Place Order
        </Button>
      </CardActions>
    </Card>
  );
};

export default FoodItemCard;

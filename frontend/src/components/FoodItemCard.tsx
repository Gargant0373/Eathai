import React from 'react';
import { Card, CardContent, CardActions, Typography, Button, Grid } from '@mui/material';
import { FoodItem } from '../models';

interface FoodItemCardProps {
  food: FoodItem;
  onPlaceOrder: (foodId: number) => void;
}

const FoodItemCard: React.FC<FoodItemCardProps> = ({ food, onPlaceOrder }) => {
  const isSoldOut = food.quantity_available === 0;

  return (
    <Card
      sx={{
        padding: 3,
        borderRadius: 4,
        boxShadow: 3,
        backgroundColor: isSoldOut ? '#ffcccc' : '#f9f9f9', 
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '100%',
      }}
    >
      <CardContent sx={{ textAlign: 'center', width: '100%' }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 'bold',
            color: isSoldOut ? '#d32f2f' : '#007BFF',
            mb: 2,
          }}
        >
          {food.name}
        </Typography>

        <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3 }}>
          {food.description}
        </Typography>

        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} md={6} sx={{ textAlign: 'center' }}>
            <Typography variant="body1">
              <strong>Price:</strong>&nbsp; ${food.price.toFixed(2)}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6} sx={{ textAlign: 'center' }}>
            <Typography
              variant="body1"
              sx={{
                color: isSoldOut ? '#d32f2f' : 'inherit',
              }}
            >
              <strong>Available:</strong>&nbsp; {isSoldOut ? 'SOLD OUT' : food.quantity_available || 'Unlimited'}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>

      {!isSoldOut && (
        <CardActions sx={{ justifyContent: 'center', mt: 2, width: '100%' }}>
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
      )}
    </Card>
  );
};

export default FoodItemCard;

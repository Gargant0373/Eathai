import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Box, TextField, Button, Card, CardContent } from '@mui/material';
import { getAvailableFood } from '../services/adminService';
import { placeOrder } from '../services/orderService';
import { FoodItem } from '../models';

const PlaceOrder: React.FC = () => {
  const { id } = useParams<{ id: string }>(); 
  const navigate = useNavigate();
  const [food, setFood] = useState<FoodItem | null>(null);
  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    const fetchFood = async () => {
      try {
        const response = await getAvailableFood();
        const selectedFood = response.available_food.find((item: FoodItem) => item.id === parseInt(id!));
        if (!selectedFood) {
          alert('Food item not found or unavailable.');
          navigate('/main'); 
        }
        setFood(selectedFood);
      } catch (error: any) {
        alert(error.response?.data?.error || 'Failed to fetch food details.');
        navigate('/main');
      }
    };

    fetchFood();
  }, [id, navigate]);

  const handlePlaceOrder = async () => {
    if (quantity < 1 || (food?.quantity_available && quantity > food.quantity_available)) {
      alert('Invalid quantity.');
      return;
    }

    try {
      await placeOrder(parseInt(id!), quantity);
      alert('Order placed successfully!');
      navigate('/main');
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to place order.');
    }
  };

  if (!food) return null;

  return (
    <Box sx={{ maxWidth: 600, margin: 'auto', mt: 5 }}>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            {food.name}
          </Typography>
          <Typography variant="body1" gutterBottom>
            {food.description}
          </Typography>
          <Typography variant="body2" gutterBottom>
            Price: ${food.price.toFixed(2)}
          </Typography>
          <Typography variant="body2" gutterBottom>
            Available Quantity: {food.quantity_available || 'Unlimited'}
          </Typography>
        </CardContent>
      </Card>

      <Box sx={{ mt: 3 }}>
        <TextField
          label="Quantity"
          type="number"
          fullWidth
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
          inputProps={{ min: 1, max: food.quantity_available || undefined }}
        />
        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 2 }}
          onClick={handlePlaceOrder}
        >
          Place Order
        </Button>
      </Box>
    </Box>
  );
};

export default PlaceOrder;

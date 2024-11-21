import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Box, TextField, Button, Card, CardContent, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
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
    <Box sx={{ maxWidth: 700, margin: 'auto', mt: 5, px: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate('/main')}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" sx={{ fontWeight: 'bold', ml: 2 }}>
          Place Order
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
          <Typography
            variant="h5"
            sx={{ fontWeight: 'bold', color: '#007BFF', mb: 2, textAlign: 'center' }}
          >
            {food.name}
          </Typography>

          <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3, textAlign: 'center' }}>
            {food.description}
          </Typography>

          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Price:</strong> ${food.price.toFixed(2)}
          </Typography>

          <Typography variant="body1">
            <strong>Available Quantity:</strong> {food.quantity_available || 'Unlimited'}
          </Typography>
        </CardContent>
      </Card>

      <Box sx={{ mt: 3 }}>
        <Typography variant="body1" sx={{ mb: 1 }}>
          Enter the quantity you'd like to order:
        </Typography>

        <TextField
          label="Quantity"
          type="number"
          fullWidth
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
          inputProps={{ min: 1, max: food.quantity_available || undefined }}
          sx={{ mb: 3 }}
        />

        <Button
          variant="contained"
          fullWidth
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            paddingX: 3,
            backgroundColor: '#007bff',
            '&:hover': {
              backgroundColor: '#0056b3',
            },
          }}
          onClick={handlePlaceOrder}
        >
          Place Order
        </Button>
      </Box>
    </Box>
  );
};

export default PlaceOrder;

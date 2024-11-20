import { Container, Grid, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FoodItemCard from '../components/FoodItemCard';
import OrderCard from '../components/OrderCard';
import { FoodItem, Order } from '../models';
import { getAllFood, getAvailableFood } from '../services/adminService';
import { getUserOrders } from '../services/orderService';

const Main: React.FC = () => {
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);
  const [completedOrders, setCompletedOrders] = useState<Order[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        const response = await getAvailableFood();
        console.log(await getAllFood())
        setFoodItems(response.available_food);
      } catch (error: any) {
        console.error('Error fetching food items:', error.response?.data || error.message);
      }
    };

    const fetchOrders = async () => {
      try {
        const response = await getUserOrders();
        const active = response.orders.filter((order: Order) => order.status !== 'completed');
        const completed = response.orders
          .filter((order: Order) => order.status === 'completed')
          .slice(0, 2);
        setActiveOrders(active);
        setCompletedOrders(completed);
      } catch (error: any) {
        console.error('Error fetching orders:', error.response?.data || error.message);
      }
    };

    fetchFoodItems();
    fetchOrders();
  }, []);

  const handlePlaceOrder = (foodId: number) => {
    navigate(`/order/place/${foodId}`);
  };

  const handleViewOrder = (orderId: number) => {
    navigate(`/order/view/${orderId}`);
  };

  return (
    <Container sx={{ py: 5 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Available Food
      </Typography>
      <Grid container spacing={3} justifyContent="center">
        {foodItems.map((food) => (
          <Grid item xs={12} sm={6} md={4} key={food.id}>
            <FoodItemCard food={food} onPlaceOrder={handlePlaceOrder} />
          </Grid>
        ))}
      </Grid>

      <Typography variant="h4" align="center" gutterBottom sx={{ mt: 5 }}>
        Active Orders
      </Typography>
      <Grid container spacing={3} justifyContent="center">
        {activeOrders.map((order) => (
          <Grid item xs={12} sm={6} md={4} key={order.id}>
            <OrderCard order={order} onViewOrder={handleViewOrder} />
          </Grid>
        ))}
      </Grid>

      <Typography variant="h4" align="center" gutterBottom sx={{ mt: 5 }}>
        Recently Completed Orders
      </Typography>
      <Grid container spacing={3} justifyContent="center">
        {completedOrders.map((order) => (
          <Grid item xs={12} sm={6} md={4} key={order.id}>
            <OrderCard order={order} onViewOrder={handleViewOrder} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Main;

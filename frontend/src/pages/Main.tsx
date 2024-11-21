import { Container, Grid, Typography, Box } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FoodItemCard from '../components/FoodItemCard';
import OrderCard from '../components/OrderCard';
import { FoodItem, Order } from '../models';
import { getAvailableFood } from '../services/adminService';
import { getUserOrders, getAllOrders } from '../services/orderService';
import Navbar from '../components/Navbar';

const Main: React.FC = () => {
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        const response = await getAvailableFood();
        setFoodItems(response.available_food);
      } catch (error: any) {
        console.error('Error fetching food items:', error.response?.data || error.message);
      }
    };

    const fetchOrders = async () => {
      try {
        const userOrdersResponse = await getUserOrders();
        const active = userOrdersResponse.orders.filter((order: Order) => order.status === 'pending' || order.status === 'confirmed');
        setActiveOrders(active);

        const recentOrdersResponse = await getAllOrders(1, 2);
        const recent = recentOrdersResponse.orders.filter((order: Order) => order.status === 'completed' || order.status === 'cancelled');
        setRecentOrders(recent);
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

  return <>
    <Navbar />
    <Container sx={{ py: 5 }}>
      <Box sx={{ textAlign: 'center', mb: 5 }}>
        <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2 }}>
          Available Food
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Discover and order your favorite dishes
        </Typography>
      </Box>

      <Grid container spacing={3} justifyContent="center">
        {foodItems.map((food) => (
          <Grid item xs={12} sm={6} md={4} key={food.id}>
            <FoodItemCard food={food} onPlaceOrder={handlePlaceOrder} />
          </Grid>
        ))}
      </Grid>

      <Box sx={{ textAlign: 'center', mt: 8, mb: 5 }}>
        <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2 }}>
          Active Orders
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Keep track of your ongoing orders
        </Typography>
      </Box>

      {activeOrders.length > 0 ? (
        <Grid container spacing={3} justifyContent="center">
          {activeOrders.map((order) => (
            <Grid item xs={12} sm={6} md={4} key={order.id}>
              <OrderCard order={order} onViewOrder={handleViewOrder} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="body1" align="center" color="text.secondary" sx={{ mt: 2 }}>
          No active orders.
        </Typography>
      )}

      <Box sx={{ textAlign: 'center', mt: 8, mb: 5 }}>
        <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2 }}>
          Recent Orders
        </Typography>
        <Typography variant="body1" color="text.secondary">
          View the history of your recent orders
        </Typography>
      </Box>

      {recentOrders.length > 0 ? (
        <Grid container spacing={3} justifyContent="center">
          {recentOrders.map((order) => (
            <Grid item xs={12} sm={6} md={4} key={order.id}>
              <OrderCard order={order} onViewOrder={handleViewOrder} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="body1" align="center" color="text.secondary" sx={{ mt: 2 }}>
          No recent orders to display.
        </Typography>
      )}
    </Container>
    </>;
};

export default Main;

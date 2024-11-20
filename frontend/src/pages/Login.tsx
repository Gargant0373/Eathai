import React from 'react';
import { useForm } from 'react-hook-form';
import { TextField, Button, Box, Link } from '@mui/material';
import { loginUser } from '../services/authService';
import { useNavigate } from 'react-router-dom';

interface LoginForm {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const { register, handleSubmit } = useForm<LoginForm>();
  const navigate = useNavigate();

  const onSubmit = async (data: LoginForm) => {
    try {
      const response = await loginUser(data.email, data.password);
      localStorage.setItem('token', response.token);
      navigate('/main');
    } catch (error: any) {
      alert(error.response?.data?.error || 'Login failed');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ width: '300px', margin: 'auto', mt: 5 }}>
      <TextField
        {...register('email')}
        label="Email"
        fullWidth
        margin="normal"
        type="email"
        required
      />
      <TextField
        {...register('password')}
        label="Password"
        fullWidth
        margin="normal"
        type="password"
        required
      />
      <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
        Login
      </Button>
      <Box mt={2}>
        <Link href="/register" variant="body2">
          Don't have an account? Register
        </Link>
      </Box>
    </Box>
  );
};

export default Login;

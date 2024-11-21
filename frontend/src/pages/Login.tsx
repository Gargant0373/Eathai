import React from 'react';
import { useForm } from 'react-hook-form';
import { Typography, TextField, Button, Box, Link } from '@mui/material';
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
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f5f5f5',
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          backgroundColor: 'white',
          padding: 4,
          borderRadius: 2,
          boxShadow: 3,
          width: '300px',
          textAlign: 'center',
        }}
      >
        <img 
          src="/logo.png" 
          alt="Logo" 
          style={{ width: '100px', marginBottom: '20px' }} 
        />

        <Typography variant="h5" gutterBottom>
          Login
        </Typography>
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
    </Box>
  );
};

export default Login;

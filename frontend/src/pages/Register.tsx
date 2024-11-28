import React from 'react';
import { useForm } from 'react-hook-form';
import { TextField, Button, Box, Link, Typography } from '@mui/material';
import { registerUser } from '../services/authService';
import { useNavigate } from 'react-router-dom';

interface RegisterForm {
  email: string;
  username: string;
  password: string;
}

const Register: React.FC = () => {
  const { register, handleSubmit } = useForm<RegisterForm>();
  const navigate = useNavigate();

  const onSubmit = async (data: RegisterForm) => {
    try {
      await registerUser(data.email, data.password);
      alert('Registration successful! Please wait for approval.');
      navigate('/');
    } catch (error: any) {
      alert(error.response?.data?.error || 'Registration failed');
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
          Register
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
          Register
        </Button>

        <Box mt={2}>
          <Link href="/" variant="body2">
            Already have an account? Login
          </Link>
        </Box>
      </Box>
    </Box>
  );
};

export default Register;

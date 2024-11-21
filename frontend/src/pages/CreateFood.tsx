import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { TextField, Button, Box, Typography, IconButton } from '@mui/material';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { addFood } from '../services/adminService';
import { useNavigate } from 'react-router-dom';

interface CreateFoodForm {
  name: string;
  description: string;
  price: number;
  quantity: number;
  available_date: string;
  registration_closing?: string;
}

const CreateFood: React.FC = () => {
  const { register, handleSubmit } = useForm<CreateFoodForm>();
  const navigate = useNavigate();
  const [availableDate, setAvailableDate] = useState(dayjs().add(48, 'hours'));
  const [registrationClosing, setRegistrationClosing] = useState<dayjs.Dayjs | null>(null);

  const onSubmit = async (data: CreateFoodForm) => {
    try {
      const payload = {
        ...data,
        available_date: availableDate.valueOf(),
        registration_closing: registrationClosing ? registrationClosing.valueOf() : undefined,
      };

      if (availableDate.isBefore(dayjs())) {
        alert('Available Date cannot be in the past.');
        return;
      }
      if (registrationClosing && registrationClosing.isBefore(dayjs())) {
        alert('Registration Closing Date cannot be in the past.');
        return;
      }

      await addFood(payload);
      alert('Food item added successfully!');
      navigate('/admin');
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to add food item');
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ maxWidth: 700, margin: 'auto', mt: 5, px: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton onClick={() => navigate('/admin')}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" sx={{ fontWeight: 'bold', ml: 2 }}>
            Add Food Item
          </Typography>
        </Box>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{
            padding: 3,
            borderRadius: 4,
            boxShadow: 3,
            backgroundColor: '#f9f9f9',
          }}
        >
          <TextField
            {...register('name', { required: true })}
            label="Name"
            fullWidth
            margin="normal"
            required
          />
          <TextField
            {...register('description', { required: true })}
            label="Description"
            fullWidth
            margin="normal"
            required
          />
          <TextField
            {...register('price', { required: true, valueAsNumber: true })}
            label="Price"
            type="number"
            fullWidth
            margin="normal"
            required
          />
          <TextField
            {...register('quantity', { required: true, valueAsNumber: true })}
            label="Quantity"
            type="number"
            fullWidth
            margin="normal"
            required
          />
          <DateTimePicker
            label="Available Date"
            value={availableDate}
            onChange={(newValue) => setAvailableDate(newValue || dayjs())}
            slots={{ textField: TextField }}
            sx={{ mt: 3, width: '100%' }}
          />
          <DateTimePicker
            label="Registration Closing Date"
            value={registrationClosing}
            onChange={(newValue) => setRegistrationClosing(newValue)}
            slots={{ textField: TextField }}
            sx={{ mt: 3, width: '100%' }}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              mt: 3,
              borderRadius: 2,
              textTransform: 'none',
              backgroundColor: '#007bff',
              '&:hover': {
                backgroundColor: '#0056b3',
              },
            }}
          >
            Add Food
          </Button>
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default CreateFood;

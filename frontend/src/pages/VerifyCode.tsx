import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { verifyEmail } from '../services/authService';

const VerifyCode = () => {
  const { code, email } = useParams<{ code: string; email: string }>();
  const [status, setStatus] = useState('Verifying...');
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null); // null = loading, true = success, false = failure

  useEffect(() => {
    const handleVerification = async () => {
      if (!email || !code) {
        setStatus('Invalid URL.');
        setIsSuccess(false);
        return;
      }

      try {
        await verifyEmail(code, email);
        setStatus('Email verified successfully!');
        setIsSuccess(true);
      } catch (error) {
        setStatus('Verification failed. Please try again.');
        setIsSuccess(false);
      }
    };

    handleVerification();
  }, [email, code]);

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #f3f4f6, #e5e7eb)',
      }}
    >
      <Card
        sx={{
          maxWidth: 400,
          width: '100%',
          textAlign: 'center',
          padding: 3,
          borderRadius: 3,
          boxShadow: 3,
          borderTop: isSuccess === true
            ? '6px solid #4caf50'
            : isSuccess === false
            ? '6px solid #f44336'
            : '',
        }}
      >
        <CardContent>
          <Typography variant="h5" component="h1" gutterBottom>
            {status}
          </Typography>

          {isSuccess === null && (
            <CircularProgress color="primary" />
          )}

          {isSuccess === true && (
            <Typography variant="body1" color="textSecondary">
              Your email has been successfully verified. You can now log in.
            </Typography>
          )}

          {isSuccess === false && (
            <Typography variant="body1" color="textSecondary">
              Unfortunately, we couldn't verify your email. Please check the
              link or contact support for further assistance.
            </Typography>
          )}

          <Box mt={2}>
            {isSuccess !== null && (
              <Button
                variant="contained"
                color="primary"
                onClick={() => window.location.href = '/'}
              >
                Go to Login
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default VerifyCode;

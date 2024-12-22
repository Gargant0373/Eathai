import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Typography,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import VerifiedIcon from '@mui/icons-material/Verified';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import { getAllUsers, verifyUser, makeUserAdmin, deleteUser } from '../services/authService';

interface User {
  id: number;
  email: string;
  is_approved: boolean;
  is_admin: boolean;
  email_confirmation: boolean;
}

const UserManagement: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const fetchUsers = async (page: number) => {
    try {
      const response = await getAllUsers(page);
      setUsers(response.users);
      setTotalPages(response.pages);
    } catch (error: any) {
      console.error('Failed to fetch users:', error.response?.data?.error || error.message);
    }
  };

  const handleVerifyUser = async (userId: number) => {
    try {
      let user = users.filter((user) => user.id === userId)[0];
      if (user.email_confirmation === false) {
        alert('User has not confirmed their email yet.');
        return;
      }
      await verifyUser(userId);
      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, is_approved: true } : user
        )
      );
    } catch (error: any) {
      console.error('Failed to verify user:', error.response?.data?.error || error.message);
    }
  };

  const handleMakeAdmin = async (userId: number) => {
    try {
      await makeUserAdmin(userId);
      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, is_admin: true } : user
        )
      );
    } catch (error: any) {
      console.error('Failed to make user an admin:', error.response?.data?.error || error.message);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    try {
      await deleteUser(userId);
      setUsers((prev) => prev.filter((user) => user.id !== userId));
    } catch (error: any) {
      console.error('Failed to delete user:', error.response?.data?.error || error.message);
    }
  };

  useEffect(() => {
    fetchUsers(page);
  }, [page]);

  return (
    <Box sx={{ maxWidth: 900, margin: 'auto', mt: 5 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate('/admin')}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" sx={{ fontWeight: 'bold', ml: 2 }}>
          User Management
        </Typography>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Email</strong></TableCell>
              <TableCell><strong>Email Verified</strong></TableCell>
              <TableCell><strong>Approved</strong></TableCell>
              <TableCell><strong>Admin</strong></TableCell>
              <TableCell align="center"><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.email_confirmation ? 'Yes' : 'No'}</TableCell>
                <TableCell>{user.is_approved ? 'Yes' : 'No'}</TableCell>
                <TableCell>{user.is_admin ? 'Yes' : 'No'}</TableCell>
                <TableCell align="center">
                  {!user.is_approved && (
                    <Button
                      size="small"
                      startIcon={<VerifiedIcon />}
                      onClick={() => handleVerifyUser(user.id)}
                      sx={{
                        backgroundColor: '#007bff',
                        color: '#fff',
                        textTransform: 'none',
                        '&:hover': { backgroundColor: '#0056b3' },
                        mx: 0.5,
                      }}
                    >
                      Approve
                    </Button>
                  )}
                  {!user.is_admin && (
                    <Button
                      size="small"
                      startIcon={<AdminPanelSettingsIcon />}
                      onClick={() => handleMakeAdmin(user.id)}
                      sx={{
                        backgroundColor: '#007bff',
                        color: '#fff',
                        textTransform: 'none',
                        '&:hover': { backgroundColor: '#0056b3' },
                        mx: 0.5,
                      }}
                    >
                      Admin
                    </Button>
                  )}
                  <Button
                    size="small"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDeleteUser(user.id)}
                    sx={{
                      backgroundColor: '#ff5c5c',
                      color: '#fff',
                      textTransform: 'none',
                      '&:hover': { backgroundColor: '#ff4040' },
                      mx: 0.5,
                    }}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          Previous
        </Button>
        <Typography variant="body1" sx={{ mx: 2 }}>
          Page {page} of {totalPages}
        </Typography>
        <Button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
};

export default UserManagement;

import React, { useEffect, useState } from 'react';
import {
    AppBar,
    Box,
    IconButton,
    Toolbar,
    Typography,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Tooltip,
    Badge,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ListAltIcon from '@mui/icons-material/ListAlt';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { useNavigate } from 'react-router-dom';
import { isAdmin } from '../utils/auth';
import { getUnverifiedUsers } from '../services/authService';

const Navbar: React.FC = () => {
    const navigate = useNavigate();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [pendingCount, setPendingCount] = useState<number>(0);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    const handleNavigate = (path: string) => {
        navigate(path);
        setDrawerOpen(false);
    };

    useEffect(() => {
        const fetchPendingUsers = async () => {
            if (isAdmin()) {
                try {
                    const unverifiedUsers = await getUnverifiedUsers();
                    setPendingCount(unverifiedUsers.length);
                } catch (error: any) {
                    console.error('Failed to fetch unverified users:', error.response?.data?.error || error.message);
                }
            }
        };

        fetchPendingUsers();
    }, []);

    const menuItems = isAdmin()
        ? [
            { text: 'Admin Dashboard', icon: <DashboardIcon />, path: '/admin' },
            { text: 'Create Food', icon: <AddCircleIcon />, path: '/admin/create-food' },
            { text: 'User Management', icon: <ListAltIcon />, path: '/admin/user-management' },
        ]
        : [];

    return (
        <>
            <AppBar position="static" sx={{ backgroundColor: '#007bff', boxShadow: 3 }}>
                <Toolbar>
                    <Typography
                        variant="h5"
                        sx={{
                            flexGrow: 1,
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                        }}
                        onClick={() => navigate('/main')}
                    >
                        Eathai
                        {isAdmin() && pendingCount > 0 && (
                            <Tooltip title={`${pendingCount} users await verification`}>
                                <Badge
                                    badgeContent={pendingCount}
                                    color="error"
                                    sx={{ ml: 2, cursor: 'pointer' }}
                                    onClick={() => handleNavigate('/admin/user-management')}
                                />
                            </Tooltip>
                        )}
                    </Typography>

                    <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
                        {menuItems.map((item, index) => (
                            <Tooltip key={index} title={item.text} placement="bottom">
                                <IconButton
                                    color="inherit"
                                    onClick={() => handleNavigate(item.path)}
                                    sx={{
                                        '&:hover': {
                                            backgroundColor: '#ffffff20',
                                        },
                                    }}
                                >
                                    {item.icon}
                                </IconButton>
                            </Tooltip>
                        ))}
                        <Tooltip title="Logout" placement="bottom">
                            <IconButton
                                color="error"
                                onClick={handleLogout}
                                sx={{
                                    '&:hover': {
                                        backgroundColor: '#ff404020',
                                    },
                                }}
                            >
                                <LogoutIcon />
                            </IconButton>
                        </Tooltip>
                    </Box>

                    <Tooltip title="Menu" placement="bottom">
                        <IconButton
                            edge="end"
                            color="inherit"
                            sx={{ display: { xs: 'flex', md: 'none' } }}
                            onClick={() => setDrawerOpen(true)}
                        >
                            <MenuIcon />
                        </IconButton>
                    </Tooltip>
                </Toolbar>
            </AppBar>

            <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                sx={{
                    '& .MuiDrawer-paper': {
                        width: 250,
                        backgroundColor: '#f9f9f9',
                    },
                }}
            >
                <List>
                    {menuItems.map((item, index) => (
                        <ListItem key={index} disablePadding>
                            <ListItemButton onClick={() => handleNavigate(item.path)}>
                                {item.icon && <item.icon.type sx={{ mr: 2 }} />}
                                <ListItemText primary={item.text} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                    <ListItem disablePadding>
                        <ListItemButton onClick={handleLogout}>
                            <LogoutIcon sx={{ mr: 2 }} />
                            <ListItemText primary="Logout" />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Drawer>
        </>
    );
};

export default Navbar;

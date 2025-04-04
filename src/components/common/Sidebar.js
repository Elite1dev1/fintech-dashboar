import React from 'react';
import { 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Divider, 
  Box, 
  Typography, 
  Avatar, 
  IconButton,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { 
  Dashboard as DashboardIcon,
  AccountBalance as AccountIcon,
  TrendingUp as InvestmentsIcon,
  Savings as SavingsIcon,
  Receipt as TransactionsIcon,
  Settings as SettingsIcon,
  Help as HelpIcon,
  ChevronLeft as ChevronLeftIcon,
  Logout as LogoutIcon,
  BarChart as AnalyticsIcon,
  Person as ContactsIcon
} from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';

const Sidebar = () => {
  const { user, sidebarOpen, toggleSidebar } = useAppContext();
  const theme = useTheme();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const drawerWidth = 220; // Match the width in Layout.js
  
  const menuItems = [
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/',
    },
    {
      text: 'Investments',
      icon: <InvestmentsIcon />,
      path: '/investments',
    },
    {
      text: 'Savings',
      icon: <SavingsIcon />,
      path: '/savings',
    },
    {
      text: 'Transactions',
      icon: <TransactionsIcon />,
      path: '/transactions',
    },
    {
      text: 'Analytics',
      icon: <AnalyticsIcon />,
      path: '/analytics',
    },
    {
      text: 'Contacts',
      icon: <ContactsIcon />,
      path: '/contacts',
    },
    {
      text: 'Settings',
      icon: <SettingsIcon />,
      path: '/settings',
    },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  const drawer = (
    <>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100%',
        backgroundColor: '#ffffff'
      }}>
        {/* Logo and App Name */}
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            p: 2,
            borderBottom: '1px solid',
            borderColor: 'divider'
          }}
        >
          <Typography 
            variant="h5" 
            component="div" 
            color="primary" 
            sx={{ 
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <Box component="span" sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
              $
            </Box>
            FinSave
          </Typography>
          {isMobile && (
            <IconButton 
              onClick={toggleSidebar} 
              sx={{ ml: 'auto' }}
            >
              <ChevronLeftIcon />
            </IconButton>
          )}
        </Box>

        {/* Navigation Menu */}
        <List sx={{ py: 2, px: 1, flex: 1 }}>
          {menuItems.map((item) => (
            <ListItem
              button
              component={Link}
              to={item.path}
              key={item.text}
              sx={{
                borderRadius: 1.5,
                mb: 0.5,
                py: 1,
                color: isActive(item.path) ? 'primary.main' : 'text.secondary',
                backgroundColor: isActive(item.path) ? 'primary.main' + '10' : 'transparent',
                '&:hover': {
                  backgroundColor: isActive(item.path) ? 'primary.main' + '15' : 'action.hover',
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 36, // Reduced from 40
                  color: isActive(item.path) ? 'primary.main' : 'text.secondary',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontSize: '0.9rem',
                  fontWeight: isActive(item.path) ? 600 : 500,
                }}
              />
            </ListItem>
          ))}
        </List>

        {/* User Profile Section */}
        <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar
              alt={user?.firstName}
              src="/static/images/avatar/1.jpg"
              sx={{ width: 36, height: 36 }} // Reduced from 40
            />
            <Box sx={{ ml: 1.5 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                {user?.firstName} {user?.lastName}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                Premium Account
              </Typography>
            </Box>
            <IconButton sx={{ ml: 'auto' }} color="inherit" size="small">
              <LogoutIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { md: sidebarOpen ? drawerWidth : 0 }, flexShrink: { md: 0 } }}
    >
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={isMobile && sidebarOpen}
        onClose={toggleSidebar}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: drawerWidth,
            borderRadius: 0,
          },
        }}
      >
        {drawer}
      </Drawer>
      
      {/* Desktop drawer */}
      <Drawer
        variant="persistent"
        open={sidebarOpen}
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: drawerWidth,
            borderRadius: 0,
            borderRight: '1px solid',
            borderColor: 'divider',
            boxShadow: 'none'
          },
        }}
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default Sidebar;

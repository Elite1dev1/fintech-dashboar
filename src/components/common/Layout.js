import React from 'react';
import { Box, AppBar, Toolbar, IconButton, Typography, Avatar, Badge, useTheme, useMediaQuery } from '@mui/material';
import { 
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  Search as SearchIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import { useAppContext } from '../../context/AppContext';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  const { user, sidebarOpen, toggleSidebar } = useAppContext();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const drawerWidth = 220;

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${sidebarOpen ? drawerWidth : 0}px)` },
          ml: { md: sidebarOpen ? `${drawerWidth}px` : 0 },
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          height: '100vh',
          overflow: 'auto',
          bgcolor: 'background.default',
          pl: { md: sidebarOpen ? 0.625 : 0 }, 
        }}
      >
        {/* App Bar */}
        <AppBar 
          position="sticky" 
          elevation={0}
          sx={{
            width: '100%',
            bgcolor: 'background.paper',
            borderBottom: '1px solid',
            borderColor: 'divider',
            color: 'text.primary',
          }}
        >
          <Toolbar sx={{ justifyContent: 'space-between', minHeight: '60px', px: 2 }}>
            {/* Left side */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {isMobile && (
                <IconButton
                  color="inherit"
                  edge="start"
                  onClick={toggleSidebar}
                  sx={{ mr: 2 }}
                >
                  <MenuIcon />
                </IconButton>
              )}
              <Box sx={{ 
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'background.paper',
                borderRadius: 2,
                p: '6px 12px',
                width: { xs: 160, sm: 240 },
                border: '1px solid',
                borderColor: 'divider',
              }}>
                <SearchIcon sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} />
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                  Search...
                </Typography>
              </Box>
            </Box>
            
            {/* Right side */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton color="inherit" sx={{ ml: 1 }}>
                <Badge badgeContent={3} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              <IconButton color="inherit" sx={{ ml: 1 }}>
                <SettingsIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>
        
        {/* Page Content */}
        <Box sx={{ 
          height: 'calc(100v - 60px)',
          overflow: 'auto',
          backgroundColor: theme.palette.background.default
        }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;

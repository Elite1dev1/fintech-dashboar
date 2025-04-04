import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  IconButton, 
  Typography, 
  Badge, 
  Menu, 
  MenuItem, 
  Box, 
  Avatar, 
  Tooltip, 
  useTheme,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Switch,
  FormControlLabel
} from '@mui/material';
import { 
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  AccountCircle,
  Settings as SettingsIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  Search as SearchIcon,
  Help as HelpIcon
} from '@mui/icons-material';
import { useAppContext } from '../../context/AppContext';

const Header = () => {
  const { user, toggleSidebar, darkMode, toggleDarkMode, notifications } = useAppContext();
  const theme = useTheme();
  
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState(null);
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  
  const handleNotificationsOpen = (event) => {
    setNotificationsAnchorEl(event.currentTarget);
  };
  
  const handleNotificationsClose = () => {
    setNotificationsAnchorEl(null);
  };
  
  const handleProfileOpen = (event) => {
    setProfileAnchorEl(event.currentTarget);
  };
  
  const handleProfileClose = () => {
    setProfileAnchorEl(null);
  };
  
  const unreadNotifications = notifications ? notifications.filter(n => !n.read).length : 0;

  return (
    <AppBar 
      position="fixed" 
      color="default" 
      elevation={0}
      sx={{ 
        zIndex: theme.zIndex.drawer + 1,
        backgroundColor: theme.palette.background.paper,
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="open drawer"
          onClick={toggleSidebar}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        
        <Typography
          variant="h6"
          noWrap
          component="div"
          color="primary"
          sx={{ display: { xs: 'none', sm: 'block' }, fontWeight: 'bold' }}
        >
          FinSave
        </Typography>
        
        <Box sx={{ flexGrow: 1 }} />
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title="Search">
            <IconButton color="inherit" sx={{ mr: 1 }}>
              <SearchIcon />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Notifications">
            <IconButton 
              color="inherit" 
              onClick={handleNotificationsOpen}
              sx={{ mr: 1 }}
            >
              <Badge badgeContent={unreadNotifications} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>
          
          <Menu
            anchorEl={notificationsAnchorEl}
            open={Boolean(notificationsAnchorEl)}
            onClose={handleNotificationsClose}
            PaperProps={{
              sx: { 
                width: 320,
                maxHeight: 400,
                overflow: 'auto',
                mt: 1.5
              }
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">Notifications</Typography>
              <Typography variant="body2" color="primary" sx={{ cursor: 'pointer' }}>
                Mark all as read
              </Typography>
            </Box>
            <Divider />
            {notifications && notifications.length > 0 ? (
              <List sx={{ p: 0 }}>
                {notifications.map((notification) => (
                  <ListItem 
                    key={notification.id} 
                    alignItems="flex-start"
                    sx={{ 
                      backgroundColor: notification.read ? 'inherit' : `${theme.palette.primary.main}08`,
                      '&:hover': {
                        backgroundColor: theme.palette.action.hover,
                      }
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar 
                        sx={{ 
                          bgcolor: 
                            notification.type === 'alert' ? theme.palette.error.main :
                            notification.type === 'success' ? theme.palette.success.main :
                            theme.palette.info.main
                        }}
                      >
                        {notification.type === 'alert' ? '!' : notification.type === 'success' ? '✓' : 'i'}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={notification.title}
                      secondary={
                        <React.Fragment>
                          <Typography
                            component="span"
                            variant="body2"
                            color="text.primary"
                            sx={{ display: 'block' }}
                          >
                            {notification.message}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(notification.date).toLocaleString()}
                          </Typography>
                        </React.Fragment>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Box sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  No notifications
                </Typography>
              </Box>
            )}
            <Divider />
            <Box sx={{ p: 1, textAlign: 'center' }}>
              <Typography variant="body2" color="primary" sx={{ cursor: 'pointer' }}>
                View all notifications
              </Typography>
            </Box>
          </Menu>
          
          <Tooltip title="Toggle dark mode">
            <IconButton color="inherit" onClick={toggleDarkMode} sx={{ mr: 1 }}>
              {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Account settings">
            <IconButton
              edge="end"
              color="inherit"
              onClick={handleProfileOpen}
            >
              {user && user.avatar ? (
                <Avatar 
                  src={user.avatar} 
                  alt={`${user.firstName} ${user.lastName}`}
                  sx={{ width: 32, height: 32 }}
                />
              ) : (
                <AccountCircle />
              )}
            </IconButton>
          </Tooltip>
          
          <Menu
            anchorEl={profileAnchorEl}
            open={Boolean(profileAnchorEl)}
            onClose={handleProfileClose}
            PaperProps={{
              sx: { width: 220, mt: 1.5 }
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            {user && (
              <Box sx={{ p: 2, textAlign: 'center' }}>
                <Avatar 
                  src={user.avatar} 
                  alt={`${user.firstName} ${user.lastName}`}
                  sx={{ width: 56, height: 56, mx: 'auto', mb: 1 }}
                />
                <Typography variant="subtitle1">{`${user.firstName} ${user.lastName}`}</Typography>
                <Typography variant="body2" color="text.secondary">{user.email}</Typography>
              </Box>
            )}
            <Divider />
            <MenuItem onClick={handleProfileClose}>
              <ListItemAvatar>
                <Avatar sx={{ width: 24, height: 24 }}>
                  <AccountCircle fontSize="small" />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="My Profile" />
            </MenuItem>
            <MenuItem onClick={handleProfileClose}>
              <ListItemAvatar>
                <Avatar sx={{ width: 24, height: 24 }}>
                  <SettingsIcon fontSize="small" />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="Settings" />
            </MenuItem>
            <MenuItem onClick={handleProfileClose}>
              <ListItemAvatar>
                <Avatar sx={{ width: 24, height: 24 }}>
                  <HelpIcon fontSize="small" />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="Help & Support" />
            </MenuItem>
            <Divider />
            <Box sx={{ px: 2, py: 1 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={darkMode}
                    onChange={toggleDarkMode}
                    size="small"
                  />
                }
                label="Dark Mode"
              />
            </Box>
            <Divider />
            <MenuItem 
              onClick={handleProfileClose}
              sx={{ color: theme.palette.error.main }}
            >
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;

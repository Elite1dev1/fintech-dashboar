import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Link,
  InputAdornment,
  IconButton,
  Divider,
  useTheme,
  Alert,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Google as GoogleIcon,
  Apple as AppleIcon,
  Facebook as FacebookIcon
} from '@mui/icons-material';
import { useAppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { isAuthenticated } = useAppContext();
  const theme = useTheme();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);
  
  // Handle input change
  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'rememberMe' ? checked : value
    });
  };
  
  // Toggle password visibility
  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Simulate login (in a real app, this would be an API call)
    setTimeout(() => {
      // For demo purposes, allow any login
      if (formData.email && formData.password) {
        // In a real app, this would set the authenticated user from the API response
        navigate('/');
      } else {
        setError('Please enter both email and password');
      }
      setLoading(false);
    }, 1000);
  };
  
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: theme.palette.background.default,
        p: 2
      }}
    >
      <Card
        elevation={0}
        sx={{
          maxWidth: 450,
          width: '100%',
          borderRadius: 3,
          boxShadow: '0px 8px 30px rgba(0, 0, 0, 0.08)',
          overflow: 'visible'
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography
              variant="h4"
              component="div"
              color="primary"
              sx={{ fontWeight: 'bold', mb: 1 }}
            >
              FinSave
            </Typography>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'medium' }}>
              Welcome Back
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Enter your credentials to access your account
            </Typography>
          </Box>
          
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
            
            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleTogglePasswordVisibility}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mt: 1,
                mb: 3
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    color="primary"
                    size="small"
                  />
                }
                label={
                  <Typography variant="body2">Remember me</Typography>
                }
              />
              
              <Link
                href="#"
                variant="body2"
                color="primary"
                underline="hover"
                sx={{ fontWeight: 'medium' }}
              >
                Forgot password?
              </Link>
            </Box>
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              disabled={loading}
              sx={{
                py: 1.5,
                mb: 2,
                fontWeight: 'bold',
                boxShadow: `0px 4px 14px ${theme.palette.primary.main}30`
              }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
            
            <Typography
              variant="body2"
              align="center"
              sx={{ mb: 2 }}
            >
              Don't have an account?{' '}
              <Link
                href="#"
                color="primary"
                underline="hover"
                sx={{ fontWeight: 'medium' }}
              >
                Sign Up
              </Link>
            </Typography>
            
            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" color="text.secondary">
                OR
              </Typography>
            </Divider>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Button
                variant="outlined"
                color="inherit"
                startIcon={<GoogleIcon />}
                sx={{ borderRadius: 2, flex: 1 }}
              >
                Google
              </Button>
              
              <Button
                variant="outlined"
                color="inherit"
                startIcon={<AppleIcon />}
                sx={{ borderRadius: 2, flex: 1 }}
              >
                Apple
              </Button>
              
              <Button
                variant="outlined"
                color="inherit"
                startIcon={<FacebookIcon />}
                sx={{ borderRadius: 2, flex: 1 }}
              >
                Facebook
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;

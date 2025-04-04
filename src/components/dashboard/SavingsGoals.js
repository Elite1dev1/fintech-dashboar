import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  IconButton,
  useTheme,
  Avatar,
  Divider,
  FormControl,
  InputLabel,
  Select,
  InputAdornment
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  BeachAccess as BeachIcon,
  Home as HomeIcon,
  DirectionsCar as CarIcon,
  School as EducationIcon,
  Celebration as CelebrationIcon,
  ShoppingBag as ShoppingIcon,
  LocalHospital as MedicalIcon,
  Shield as EmergencyIcon,
  Devices as ElectronicsIcon
} from '@mui/icons-material';
import { useAppContext } from '../../context/AppContext';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';

const SavingsGoals = () => {
  const { savingsGoals, addSavingsGoal, updateSavingsGoal, deleteSavingsGoal } = useAppContext();
  const theme = useTheme();
  
  const [openDialog, setOpenDialog] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    targetAmount: '',
    currentAmount: '',
    deadline: null,
    category: 'Emergency',
    autoContribution: '',
    frequency: 'monthly'
  });
  
  // Icons for different categories
  const categoryIcons = {
    Emergency: <EmergencyIcon />,
    Travel: <BeachIcon />,
    Housing: <HomeIcon />,
    Transportation: <CarIcon />,
    Education: <EducationIcon />,
    Celebration: <CelebrationIcon />,
    Shopping: <ShoppingIcon />,
    Medical: <MedicalIcon />,
    Electronics: <ElectronicsIcon />
  };
  
  // Colors for different categories
  const categoryColors = {
    Emergency: theme.palette.success.main,
    Travel: theme.palette.info.main,
    Housing: theme.palette.warning.main,
    Transportation: theme.palette.error.main,
    Education: theme.palette.secondary.main,
    Celebration: '#9c27b0',
    Shopping: '#ff9800',
    Medical: '#f44336',
    Electronics: '#2196f3'
  };
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };
  
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };
  
  // Calculate days remaining
  const calculateDaysRemaining = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  
  // Handle opening the dialog for adding a new goal
  const handleAddGoal = () => {
    setEditingGoal(null);
    setFormData({
      name: '',
      targetAmount: '',
      currentAmount: '',
      deadline: null,
      category: 'Emergency',
      autoContribution: '',
      frequency: 'monthly'
    });
    setOpenDialog(true);
  };
  
  // Handle opening the dialog for editing an existing goal
  const handleEditGoal = (goal) => {
    setEditingGoal(goal);
    setFormData({
      name: goal.name,
      targetAmount: goal.targetAmount.toString(),
      currentAmount: goal.currentAmount.toString(),
      deadline: new Date(goal.deadline),
      category: goal.category,
      autoContribution: goal.autoContribution.toString(),
      frequency: goal.frequency
    });
    setOpenDialog(true);
  };
  
  // Handle closing the dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Handle date change
  const handleDateChange = (date) => {
    setFormData({
      ...formData,
      deadline: date
    });
  };
  
  // Handle form submission
  const handleSubmit = () => {
    const goalData = {
      name: formData.name,
      targetAmount: parseFloat(formData.targetAmount),
      currentAmount: parseFloat(formData.currentAmount),
      deadline: formData.deadline.toISOString().split('T')[0],
      category: formData.category,
      icon: formData.category.toLowerCase(),
      color: categoryColors[formData.category],
      autoContribution: parseFloat(formData.autoContribution),
      frequency: formData.frequency
    };
    
    if (editingGoal) {
      updateSavingsGoal(editingGoal.id, goalData);
    } else {
      addSavingsGoal(goalData);
    }
    
    setOpenDialog(false);
  };
  
  // Handle deleting a goal
  const handleDeleteGoal = (id) => {
    deleteSavingsGoal(id);
  };
  
  return (
    <Box sx={{ flexGrow: 1, p: { xs: 2, md: "15px 32px 24px 5px" }, mt: 8 }}>
      {/* Header Section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Savings Goals
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Track and manage your savings goals
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAddGoal}
        >
          Add New Goal
        </Button>
      </Box>
      
      {/* Goals Grid */}
      <Grid container spacing={3}>
        {savingsGoals && savingsGoals.map((goal) => {
          const progress = (goal.currentAmount / goal.targetAmount) * 100;
          const daysRemaining = calculateDaysRemaining(goal.deadline);
          
          return (
            <Grid item xs={12} sm={6} md={4} key={goal.id}>
              <Card elevation={0} sx={{ borderRadius: 2, height: '100%', position: 'relative' }}>
                <Box 
                  sx={{ 
                    position: 'absolute', 
                    top: 12, 
                    right: 12, 
                    display: 'flex', 
                    gap: 1 
                  }}
                >
                  <IconButton 
                    size="small" 
                    onClick={() => handleEditGoal(goal)}
                    sx={{ 
                      bgcolor: `${theme.palette.primary.main}10`,
                      '&:hover': {
                        bgcolor: `${theme.palette.primary.main}20`,
                      }
                    }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton 
                    size="small" 
                    onClick={() => handleDeleteGoal(goal.id)}
                    sx={{ 
                      bgcolor: `${theme.palette.error.main}10`,
                      '&:hover': {
                        bgcolor: `${theme.palette.error.main}20`,
                      }
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
                <CardContent sx={{ pt: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar
                      sx={{
                        bgcolor: `${goal.color}20`,
                        color: goal.color,
                        mr: 2
                      }}
                    >
                      {categoryIcons[goal.category]}
                    </Avatar>
                    <Typography variant="h6" noWrap>
                      {goal.name}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2" color="text.secondary">
                        Progress
                      </Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {progress.toFixed(0)}%
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={progress > 100 ? 100 : progress} 
                      sx={{ 
                        height: 8, 
                        borderRadius: 4,
                        bgcolor: `${goal.color}20`,
                        '& .MuiLinearProgress-bar': {
                          bgcolor: goal.color
                        }
                      }}
                    />
                  </Box>
                  
                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Current
                      </Typography>
                      <Typography variant="h6" fontWeight="medium">
                        {formatCurrency(goal.currentAmount)}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Target
                      </Typography>
                      <Typography variant="h6" fontWeight="medium">
                        {formatCurrency(goal.targetAmount)}
                      </Typography>
                    </Grid>
                  </Grid>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Deadline
                      </Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {formatDate(goal.deadline)}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Days Left
                      </Typography>
                      <Typography 
                        variant="body2" 
                        fontWeight="medium"
                        color={daysRemaining < 30 ? theme.palette.error.main : 'inherit'}
                      >
                        {daysRemaining} days
                      </Typography>
                    </Grid>
                  </Grid>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Auto-contribution
                    </Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {formatCurrency(goal.autoContribution)} {goal.frequency}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
        
        {/* Add New Goal Card */}
        <Grid item xs={12} sm={6} md={4}>
          <Card 
            elevation={0} 
            sx={{ 
              borderRadius: 2, 
              height: '100%', 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              border: `1px dashed ${theme.palette.divider}`,
              bgcolor: 'transparent',
              cursor: 'pointer',
              '&:hover': {
                bgcolor: `${theme.palette.primary.main}05`,
              }
            }}
            onClick={handleAddGoal}
          >
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar
                sx={{
                  bgcolor: `${theme.palette.primary.main}20`,
                  color: theme.palette.primary.main,
                  width: 56,
                  height: 56,
                  mx: 'auto',
                  mb: 2
                }}
              >
                <AddIcon />
              </Avatar>
              <Typography variant="h6" gutterBottom>
                Add New Goal
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Create a new savings goal to track your progress
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Add/Edit Goal Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingGoal ? 'Edit Savings Goal' : 'Add New Savings Goal'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  name="name"
                  label="Goal Name"
                  fullWidth
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  name="targetAmount"
                  label="Target Amount"
                  fullWidth
                  type="number"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                  value={formData.targetAmount}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  name="currentAmount"
                  label="Current Amount"
                  fullWidth
                  type="number"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                  value={formData.currentAmount}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    label="Category"
                  >
                    <MenuItem value="Emergency">Emergency Fund</MenuItem>
                    <MenuItem value="Travel">Travel & Vacation</MenuItem>
                    <MenuItem value="Housing">Housing & Home</MenuItem>
                    <MenuItem value="Transportation">Transportation</MenuItem>
                    <MenuItem value="Education">Education</MenuItem>
                    <MenuItem value="Celebration">Celebration & Events</MenuItem>
                    <MenuItem value="Shopping">Shopping</MenuItem>
                    <MenuItem value="Medical">Medical & Health</MenuItem>
                    <MenuItem value="Electronics">Electronics</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterLuxon}>
                  <DatePicker
                    label="Deadline"
                    value={formData.deadline}
                    onChange={handleDateChange}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </LocalizationProvider>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  name="autoContribution"
                  label="Auto-contribution Amount"
                  fullWidth
                  type="number"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                  value={formData.autoContribution}
                  onChange={handleInputChange}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Frequency</InputLabel>
                  <Select
                    name="frequency"
                    value={formData.frequency}
                    onChange={handleInputChange}
                    label="Frequency"
                  >
                    <MenuItem value="daily">Daily</MenuItem>
                    <MenuItem value="weekly">Weekly</MenuItem>
                    <MenuItem value="biweekly">Bi-weekly</MenuItem>
                    <MenuItem value="monthly">Monthly</MenuItem>
                    <MenuItem value="quarterly">Quarterly</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            color="primary"
            disabled={!formData.name || !formData.targetAmount || !formData.deadline}
          >
            {editingGoal ? 'Update Goal' : 'Add Goal'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SavingsGoals;

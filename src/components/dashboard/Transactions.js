import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Grid,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  useTheme,
  Pagination,
  Avatar
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  ArrowUpward as ArrowUpIcon,
  ArrowDownward as ArrowDownIcon,
  MoreVert as MoreVertIcon,
  Receipt as ReceiptIcon,
  ShoppingBag as ShoppingIcon,
  Fastfood as FoodIcon,
  DirectionsCar as TransportIcon,
  HomeWork as HousingIcon,
  LocalHospital as HealthcareIcon,
  School as EducationIcon,
  Devices as ElectronicsIcon,
  AccountBalance as BankIcon
} from '@mui/icons-material';
import { useAppContext } from '../../context/AppContext';

const Transactions = () => {
  const { transactions } = useAppContext();
  const theme = useTheme();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  
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
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  // Get category icon
  const getCategoryIcon = (category) => {
    switch (category.toLowerCase()) {
      case 'groceries':
      case 'food':
        return <FoodIcon fontSize="small" />;
      case 'shopping':
        return <ShoppingIcon fontSize="small" />;
      case 'transportation':
        return <TransportIcon fontSize="small" />;
      case 'housing':
      case 'utilities':
        return <HousingIcon fontSize="small" />;
      case 'healthcare':
        return <HealthcareIcon fontSize="small" />;
      case 'education':
        return <EducationIcon fontSize="small" />;
      case 'electronics':
        return <ElectronicsIcon fontSize="small" />;
      case 'income':
      case 'transfer':
      case 'investment':
        return <BankIcon fontSize="small" />;
      default:
        return <ReceiptIcon fontSize="small" />;
    }
  };
  
  // Get category color
  const getCategoryColor = (category) => {
    switch (category.toLowerCase()) {
      case 'groceries':
      case 'food':
        return theme.palette.success.main;
      case 'shopping':
        return theme.palette.secondary.main;
      case 'transportation':
        return theme.palette.info.main;
      case 'housing':
      case 'utilities':
        return theme.palette.warning.main;
      case 'healthcare':
        return theme.palette.error.main;
      case 'education':
        return '#9c27b0';
      case 'electronics':
        return '#2196f3';
      case 'income':
      case 'transfer':
      case 'investment':
        return theme.palette.primary.main;
      default:
        return theme.palette.text.secondary;
    }
  };
  
  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(1);
  };
  
  // Handle category filter change
  const handleCategoryFilterChange = (event) => {
    setCategoryFilter(event.target.value);
    setPage(1);
  };
  
  // Handle type filter change
  const handleTypeFilterChange = (event) => {
    setTypeFilter(event.target.value);
    setPage(1);
  };
  
  // Handle date filter change
  const handleDateFilterChange = (event) => {
    setDateFilter(event.target.value);
    setPage(1);
  };
  
  // Handle page change
  const handlePageChange = (event, value) => {
    setPage(value);
  };
  
  // Filter transactions based on search term and filters
  const filteredTransactions = transactions?.filter(transaction => {
    const matchesSearch = searchTerm === '' || 
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === '' || 
      transaction.category.toLowerCase() === categoryFilter.toLowerCase();
    
    const matchesType = typeFilter === '' || 
      transaction.type.toLowerCase() === typeFilter.toLowerCase();
    
    let matchesDate = true;
    if (dateFilter !== '') {
      const transactionDate = new Date(transaction.date);
      const today = new Date();
      const lastWeek = new Date();
      lastWeek.setDate(today.getDate() - 7);
      const lastMonth = new Date();
      lastMonth.setMonth(today.getMonth() - 1);
      
      if (dateFilter === 'today') {
        matchesDate = transactionDate.toDateString() === today.toDateString();
      } else if (dateFilter === 'week') {
        matchesDate = transactionDate >= lastWeek;
      } else if (dateFilter === 'month') {
        matchesDate = transactionDate >= lastMonth;
      }
    }
    
    return matchesSearch && matchesCategory && matchesType && matchesDate;
  }) || [];
  
  // Get unique categories for filter
  const categories = [...new Set(transactions?.map(t => t.category) || [])];
  
  // Calculate pagination
  const paginatedTransactions = filteredTransactions.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );
  
  // Calculate totals
  const totalIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalExpense = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    
  const netCashflow = totalIncome - totalExpense;
  
  return (
    <Box sx={{ flexGrow: 1, p: { xs: 2, md: "15px 32px 24px 5px" }, mt: 8 }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Transactions
        </Typography>
        <Typography variant="body1" color="text.secondary">
          View and manage your transaction history
        </Typography>
      </Box>
      
      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Total Income Card */}
        <Grid item xs={12} sm={4}>
          <Card elevation={0} sx={{ borderRadius: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Avatar 
                  sx={{ 
                    bgcolor: `${theme.palette.success.main}20`, 
                    color: theme.palette.success.main,
                    mr: 1
                  }}
                >
                  <ArrowUpIcon />
                </Avatar>
                <Typography variant="h6" color="text.secondary">
                  Income
                </Typography>
              </Box>
              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                {formatCurrency(totalIncome)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Total Expenses Card */}
        <Grid item xs={12} sm={4}>
          <Card elevation={0} sx={{ borderRadius: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Avatar 
                  sx={{ 
                    bgcolor: `${theme.palette.error.main}20`, 
                    color: theme.palette.error.main,
                    mr: 1
                  }}
                >
                  <ArrowDownIcon />
                </Avatar>
                <Typography variant="h6" color="text.secondary">
                  Expenses
                </Typography>
              </Box>
              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                {formatCurrency(totalExpense)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Net Cashflow Card */}
        <Grid item xs={12} sm={4}>
          <Card elevation={0} sx={{ borderRadius: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Avatar 
                  sx={{ 
                    bgcolor: `${netCashflow >= 0 ? theme.palette.primary.main : theme.palette.error.main}20`, 
                    color: netCashflow >= 0 ? theme.palette.primary.main : theme.palette.error.main,
                    mr: 1
                  }}
                >
                  {netCashflow >= 0 ? <ArrowUpIcon /> : <ArrowDownIcon />}
                </Avatar>
                <Typography variant="h6" color="text.secondary">
                  Net Cashflow
                </Typography>
              </Box>
              <Typography 
                variant="h4" 
                component="div" 
                sx={{ 
                  fontWeight: 'bold',
                  color: netCashflow >= 0 ? 'inherit' : theme.palette.error.main
                }}
              >
                {formatCurrency(Math.abs(netCashflow))}
                {netCashflow < 0 && ' (Deficit)'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Filters Section */}
      <Card elevation={0} sx={{ borderRadius: 2, mb: 4 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                size="small"
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Category</InputLabel>
                <Select
                  value={categoryFilter}
                  onChange={handleCategoryFilterChange}
                  label="Category"
                  displayEmpty
                >
                  <MenuItem value="">All Categories</MenuItem>
                  {categories.map(category => (
                    <MenuItem key={category} value={category}>{category}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Type</InputLabel>
                <Select
                  value={typeFilter}
                  onChange={handleTypeFilterChange}
                  label="Type"
                  displayEmpty
                >
                  <MenuItem value="">All Types</MenuItem>
                  <MenuItem value="income">Income</MenuItem>
                  <MenuItem value="expense">Expense</MenuItem>
                  <MenuItem value="transfer">Transfer</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Date Range</InputLabel>
                <Select
                  value={dateFilter}
                  onChange={handleDateFilterChange}
                  label="Date Range"
                  displayEmpty
                >
                  <MenuItem value="">All Time</MenuItem>
                  <MenuItem value="today">Today</MenuItem>
                  <MenuItem value="week">Last 7 Days</MenuItem>
                  <MenuItem value="month">Last 30 Days</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      
      {/* Transactions Table */}
      <Card elevation={0} sx={{ borderRadius: 2 }}>
        <CardHeader
          title={`${filteredTransactions.length} Transactions`}
          action={
            <IconButton>
              <FilterIcon />
            </IconButton>
          }
        />
        <Divider />
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date & Time</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Type</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{formatDate(transaction.date)}</TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell>
                    <Chip
                      icon={getCategoryIcon(transaction.category)}
                      label={transaction.category}
                      size="small"
                      sx={{
                        bgcolor: `${getCategoryColor(transaction.category)}10`,
                        color: getCategoryColor(transaction.category),
                        borderRadius: 1,
                        '& .MuiChip-icon': {
                          color: getCategoryColor(transaction.category),
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                      size="small"
                      sx={{
                        bgcolor: 
                          transaction.type === 'income' ? `${theme.palette.success.main}10` :
                          transaction.type === 'expense' ? `${theme.palette.error.main}10` :
                          `${theme.palette.info.main}10`,
                        color: 
                          transaction.type === 'income' ? theme.palette.success.main :
                          transaction.type === 'expense' ? theme.palette.error.main :
                          theme.palette.info.main,
                        borderRadius: 1,
                      }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 'medium',
                        color: 
                          transaction.type === 'income' ? theme.palette.success.main :
                          transaction.type === 'expense' ? theme.palette.error.main :
                          'inherit',
                      }}
                    >
                      {transaction.type === 'income' ? '+' : transaction.type === 'expense' ? '-' : ''}
                      {formatCurrency(Math.abs(transaction.amount))}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small">
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        
        {filteredTransactions.length === 0 && (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              No transactions found
            </Typography>
          </Box>
        )}
        
        {filteredTransactions.length > 0 && (
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
            <Pagination
              count={Math.ceil(filteredTransactions.length / rowsPerPage)}
              page={page}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
        )}
      </Card>
    </Box>
  );
};

export default Transactions;

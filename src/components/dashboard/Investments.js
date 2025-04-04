import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
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
  Button,
  CircularProgress,
  useTheme,
  Tabs,
  Tab,
  Paper
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  MoreVert as MoreVertIcon,
  Add as AddIcon,
  PieChart as PieChartIcon,
  ShowChart as ShowChartIcon,
  TableChart as TableChartIcon,
  ArrowUpward as ArrowUpIcon,
  ArrowDownward as ArrowDownIcon
} from '@mui/icons-material';
import { useAppContext } from '../../context/AppContext';
import { fetchInvestmentPerformance } from '../../services/api';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title } from 'chart.js';
import { Pie, Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title);

const Investments = () => {
  const { investments } = useAppContext();
  const theme = useTheme();
  
  const [performanceData, setPerformanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [viewMode, setViewMode] = useState('table');
  
  useEffect(() => {
    const loadPerformanceData = async () => {
      try {
        setLoading(true);
        const data = await fetchInvestmentPerformance();
        setPerformanceData(data);
      } catch (error) {
        console.error('Error loading performance data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadPerformanceData();
  }, []);
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };
  
  // Format percentage
  const formatPercentage = (value) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };
  
  // Calculate total investment value
  const totalInvestmentValue = investments?.reduce((total, inv) => total + inv.value, 0) || 0;
  
  // Calculate total investment change
  const totalInvestmentChange = investments?.reduce((total, inv) => total + (inv.currentPrice - inv.buyPrice) * inv.shares, 0) || 0;
  const totalInvestmentChangePercent = (totalInvestmentChange / (totalInvestmentValue - totalInvestmentChange)) * 100;
  
  // Calculate investment allocation by type
  const investmentsByType = investments?.reduce((acc, inv) => {
    acc[inv.type] = (acc[inv.type] || 0) + inv.value;
    return acc;
  }, {}) || {};
  
  // Prepare chart data for allocation
  const allocationChartData = {
    labels: Object.keys(investmentsByType),
    datasets: [
      {
        data: Object.values(investmentsByType),
        backgroundColor: [
          theme.palette.primary.main,
          theme.palette.secondary.main,
          theme.palette.error.main,
          theme.palette.warning.main,
          theme.palette.info.main,
        ],
        borderWidth: 1,
      },
    ],
  };
  
  const allocationChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          boxWidth: 12,
          padding: 15,
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = formatCurrency(context.raw);
            const percentage = ((context.raw / totalInvestmentValue) * 100).toFixed(1) + '%';
            return `${label}: ${value} (${percentage})`;
          }
        }
      }
    },
  };
  
  // Prepare chart data for performance
  const performanceChartData = {
    labels: performanceData.map(item => item.date.substring(5)), // Show only month and day (MM-DD)
    datasets: [
      {
        label: 'Portfolio Value',
        data: performanceData.map(item => item.value),
        borderColor: theme.palette.primary.main,
        backgroundColor: `${theme.palette.primary.main}20`,
        fill: true,
        tension: 0.4,
      },
    ],
  };
  
  const performanceChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return formatCurrency(context.raw);
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          maxTicksLimit: 7,
        }
      },
      y: {
        beginAtZero: false,
        ticks: {
          callback: function(value) {
            return formatCurrency(value);
          }
        }
      }
    }
  };
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Handle view mode change
  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };
  
  return (
    <Box sx={{ flexGrow: 1, p: { xs: 2, md: "15px 32px 24px 5px" }, mt: 8 }}>
      {/* Header Section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Investments
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage and track your investment portfolio
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
        >
          Add Investment
        </Button>
      </Box>
      
      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Total Value Card */}
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={0} sx={{ borderRadius: 2, height: '100%' }}>
            <CardContent>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Total Value
              </Typography>
              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
                {formatCurrency(totalInvestmentValue)}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {totalInvestmentChange >= 0 ? (
                  <ArrowUpIcon fontSize="small" sx={{ color: theme.palette.success.main }} />
                ) : (
                  <ArrowDownIcon fontSize="small" sx={{ color: theme.palette.error.main }} />
                )}
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: totalInvestmentChange >= 0 ? theme.palette.success.main : theme.palette.error.main,
                    mr: 1
                  }}
                >
                  {totalInvestmentChange >= 0 ? '+' : ''}{formatCurrency(totalInvestmentChange)}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: totalInvestmentChange >= 0 ? theme.palette.success.main : theme.palette.error.main 
                  }}
                >
                  ({formatPercentage(totalInvestmentChangePercent)})
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Best Performer Card */}
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={0} sx={{ borderRadius: 2, height: '100%' }}>
            <CardContent>
              {investments && investments.length > 0 ? (
                <>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Best Performer
                  </Typography>
                  {(() => {
                    const bestPerformer = [...investments].sort((a, b) => b.changePercent - a.changePercent)[0];
                    return (
                      <>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', mr: 1 }}>
                            {bestPerformer.name}
                          </Typography>
                          <Chip 
                            label={bestPerformer.ticker} 
                            size="small" 
                            sx={{ height: 20, fontSize: '0.7rem' }} 
                          />
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <TrendingUpIcon sx={{ color: theme.palette.success.main, mr: 1 }} />
                          <Typography 
                            variant="body1" 
                            sx={{ 
                              color: theme.palette.success.main,
                              fontWeight: 'medium'
                            }}
                          >
                            {formatPercentage(bestPerformer.changePercent)}
                          </Typography>
                        </Box>
                      </>
                    );
                  })()}
                </>
              ) : (
                <Typography variant="body1" color="text.secondary">
                  No investments available
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
        
        {/* Worst Performer Card */}
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={0} sx={{ borderRadius: 2, height: '100%' }}>
            <CardContent>
              {investments && investments.length > 0 ? (
                <>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Worst Performer
                  </Typography>
                  {(() => {
                    const worstPerformer = [...investments].sort((a, b) => a.changePercent - b.changePercent)[0];
                    return (
                      <>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', mr: 1 }}>
                            {worstPerformer.name}
                          </Typography>
                          <Chip 
                            label={worstPerformer.ticker} 
                            size="small" 
                            sx={{ height: 20, fontSize: '0.7rem' }} 
                          />
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <TrendingDownIcon sx={{ color: theme.palette.error.main, mr: 1 }} />
                          <Typography 
                            variant="body1" 
                            sx={{ 
                              color: theme.palette.error.main,
                              fontWeight: 'medium'
                            }}
                          >
                            {formatPercentage(worstPerformer.changePercent)}
                          </Typography>
                        </Box>
                      </>
                    );
                  })()}
                </>
              ) : (
                <Typography variant="body1" color="text.secondary">
                  No investments available
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
        
        {/* Allocation Card */}
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={0} sx={{ borderRadius: 2, height: '100%' }}>
            <CardContent>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Allocation
              </Typography>
              {investments && investments.length > 0 ? (
                <>
                  {Object.entries(investmentsByType).map(([type, value]) => {
                    const percentage = (value / totalInvestmentValue) * 100;
                    return (
                      <Box key={type} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">{type}</Typography>
                        <Typography variant="body2" fontWeight="medium">
                          {percentage.toFixed(1)}%
                        </Typography>
                      </Box>
                    );
                  })}
                </>
              ) : (
                <Typography variant="body1" color="text.secondary">
                  No investments available
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Tabs Section */}
      <Box sx={{ mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          sx={{
            '& .MuiTabs-indicator': {
              backgroundColor: theme.palette.primary.main,
            },
          }}
        >
          <Tab label="All Investments" />
          <Tab label="ETFs" />
          <Tab label="Mutual Funds" />
          <Tab label="Index Funds" />
        </Tabs>
      </Box>
      
      {/* View Mode Selector */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Paper elevation={0} sx={{ display: 'flex', borderRadius: 2, overflow: 'hidden' }}>
          <IconButton 
            color={viewMode === 'table' ? 'primary' : 'default'} 
            onClick={() => handleViewModeChange('table')}
          >
            <TableChartIcon />
          </IconButton>
          <IconButton 
            color={viewMode === 'chart' ? 'primary' : 'default'} 
            onClick={() => handleViewModeChange('chart')}
          >
            <PieChartIcon />
          </IconButton>
          <IconButton 
            color={viewMode === 'performance' ? 'primary' : 'default'} 
            onClick={() => handleViewModeChange('performance')}
          >
            <ShowChartIcon />
          </IconButton>
        </Paper>
      </Box>
      
      {/* Main Content */}
      <Grid container spacing={3}>
        {viewMode === 'table' && (
          <Grid item xs={12}>
            <Card elevation={0} sx={{ borderRadius: 2 }}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell align="right">Shares</TableCell>
                      <TableCell align="right">Buy Price</TableCell>
                      <TableCell align="right">Current Price</TableCell>
                      <TableCell align="right">Value</TableCell>
                      <TableCell align="right">Change</TableCell>
                      <TableCell align="right">Change %</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {investments && investments
                      .filter(inv => {
                        if (tabValue === 0) return true;
                        if (tabValue === 1) return inv.type === 'ETF';
                        if (tabValue === 2) return inv.type === 'Mutual Fund';
                        if (tabValue === 3) return inv.type === 'Index Fund';
                        return true;
                      })
                      .map((investment) => (
                        <TableRow key={investment.id}>
                          <TableCell>
                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                              <Typography variant="body2" fontWeight="medium">
                                {investment.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {investment.ticker}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={investment.type} 
                              size="small" 
                              sx={{ height: 20, fontSize: '0.7rem' }} 
                            />
                          </TableCell>
                          <TableCell align="right">{investment.shares}</TableCell>
                          <TableCell align="right">{formatCurrency(investment.buyPrice)}</TableCell>
                          <TableCell align="right">{formatCurrency(investment.currentPrice)}</TableCell>
                          <TableCell align="right">{formatCurrency(investment.value)}</TableCell>
                          <TableCell align="right">
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                              {investment.change >= 0 ? (
                                <ArrowUpIcon fontSize="small" sx={{ color: theme.palette.success.main }} />
                              ) : (
                                <ArrowDownIcon fontSize="small" sx={{ color: theme.palette.error.main }} />
                              )}
                              <Typography 
                                variant="body2" 
                                sx={{ 
                                  color: investment.change >= 0 ? theme.palette.success.main : theme.palette.error.main
                                }}
                              >
                                {formatCurrency(Math.abs(investment.change))}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell align="right">
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                color: investment.changePercent >= 0 ? theme.palette.success.main : theme.palette.error.main,
                                fontWeight: 'medium'
                              }}
                            >
                              {formatPercentage(investment.changePercent)}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
              {(!investments || investments.length === 0) && (
                <Box sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="body1" color="text.secondary">
                    No investments available
                  </Typography>
                </Box>
              )}
            </Card>
          </Grid>
        )}
        
        {viewMode === 'chart' && (
          <Grid item xs={12}>
            <Card elevation={0} sx={{ borderRadius: 2 }}>
              <CardHeader
                title="Portfolio Allocation"
                action={
                  <IconButton aria-label="settings">
                    <MoreVertIcon />
                  </IconButton>
                }
              />
              <Divider />
              <CardContent>
                {investments && investments.length > 0 ? (
                  <Box sx={{ height: 400, display: 'flex', justifyContent: 'center' }}>
                    <Box sx={{ width: '70%', height: '100%' }}>
                      <Pie data={allocationChartData} options={allocationChartOptions} />
                    </Box>
                  </Box>
                ) : (
                  <Box sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="body1" color="text.secondary">
                      No investments available
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        )}
        
        {viewMode === 'performance' && (
          <Grid item xs={12}>
            <Card elevation={0} sx={{ borderRadius: 2 }}>
              <CardHeader
                title="Portfolio Performance"
                action={
                  <IconButton aria-label="settings">
                    <MoreVertIcon />
                  </IconButton>
                }
              />
              <Divider />
              <CardContent>
                {loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
                    <CircularProgress />
                  </Box>
                ) : (
                  <Box sx={{ height: 400 }}>
                    <Line data={performanceChartData} options={performanceChartOptions} />
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default Investments;

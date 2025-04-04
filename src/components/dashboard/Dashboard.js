import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Typography,
  Button,
  Divider,
  useTheme,
  CircularProgress,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  Chip,
  LinearProgress,
} from "@mui/material";
import {
  ArrowUpward as ArrowUpIcon,
  ArrowDownward as ArrowDownIcon,
  MoreVert as MoreVertIcon,
  AccountBalance as AccountIcon,
  TrendingUp as TrendingUpIcon,
  Savings as SavingsIcon,
  Receipt as ReceiptIcon,
  ChevronRight as ChevronRightIcon,
} from "@mui/icons-material";
import { useAppContext } from "../../context/AppContext";
import {
  fetchInvestmentPerformance,
  fetchSpendingByCategory,
  fetchMonthlySpending,
} from "../../services/api";
import { Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const { user, balance, transactions, savingsGoals, investments } =
    useAppContext();
  const theme = useTheme();

  const [investmentPerformance, setInvestmentPerformance] = useState([]);
  const [spendingByCategory, setSpendingByCategory] = useState([]);
  const [monthlySpending, setMonthlySpending] = useState([]);
  const [loading, setLoading] = useState({
    investmentPerformance: true,
    spendingByCategory: true,
    monthlySpending: true,
  });

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate percentage change
  const calculatePercentageChange = (current, previous) => {
    if (!previous) return 0;
    return ((current - previous) / previous) * 100;
  };

  // Format percentage
  const formatPercentage = (percentage) => {
    return `${percentage > 0 ? "+" : ""}${percentage.toFixed(1)}%`;
  };

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const investmentData = await fetchInvestmentPerformance();
        setInvestmentPerformance(investmentData);
        setLoading((prev) => ({ ...prev, investmentPerformance: false }));

        const categoryData = await fetchSpendingByCategory();
        setSpendingByCategory(categoryData);
        setLoading((prev) => ({ ...prev, spendingByCategory: false }));

        const monthlyData = await fetchMonthlySpending();
        setMonthlySpending(monthlyData);
        setLoading((prev) => ({ ...prev, monthlySpending: false }));
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchData();
  }, []);

  // Investment performance chart data
  const investmentChartData = {
    labels: investmentPerformance.map((data) => data.date),
    datasets: [
      {
        label: "Portfolio Value",
        data: investmentPerformance.map((data) => data.value),
        borderColor: theme.palette.primary.main,
        backgroundColor: theme.palette.primary.main + "20",
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHitRadius: 10,
        borderWidth: 2,
      },
      {
        label: "Market Index",
        data: investmentPerformance.map((data) => data.marketIndex),
        borderColor: theme.palette.success.main,
        backgroundColor: "transparent",
        borderDash: [5, 5],
        tension: 0.4,
        pointRadius: 0,
        pointHitRadius: 10,
        borderWidth: 2,
      },
    ],
  };

  // Investment chart options
  const investmentChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: "index",
        intersect: false,
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed.y !== null) {
              label += formatCurrency(context.parsed.y);
            }
            return label;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 6,
        },
      },
      y: {
        grid: {
          borderDash: [5, 5],
        },
        ticks: {
          callback: function (value) {
            return formatCurrency(value);
          },
        },
      },
    },
    interaction: {
      mode: "nearest",
      axis: "x",
      intersect: false,
    },
  };

  // Spending by category chart data
  const spendingChartData = {
    labels: spendingByCategory.map((category) => category.name),
    datasets: [
      {
        data: spendingByCategory.map((category) => category.amount),
        backgroundColor: [
          theme.palette.primary.main,
          theme.palette.secondary.main,
          theme.palette.success.main,
          theme.palette.warning.main,
          theme.palette.error.main,
          "#9c27b0",
          "#2196f3",
        ],
        borderWidth: 0,
        hoverOffset: 4,
      },
    ],
  };

  // Spending chart options
  const spendingChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "70%",
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || "";
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${formatCurrency(value)} (${percentage}%)`;
          },
        },
      },
    },
  };

  // Get total savings goal progress
  const getTotalSavingsProgress = () => {
    if (!savingsGoals || savingsGoals.length === 0) return 0;

    const totalCurrent = savingsGoals.reduce(
      (sum, goal) => sum + goal.currentAmount,
      0
    );
    const totalTarget = savingsGoals.reduce(
      (sum, goal) => sum + goal.targetAmount,
      0
    );

    return Math.round((totalCurrent / totalTarget) * 100);
  };

  // Get top 3 savings goals
  const getTopSavingsGoals = () => {
    if (!savingsGoals) return [];

    return [...savingsGoals]
      .sort(
        (a, b) =>
          b.currentAmount / b.targetAmount - a.currentAmount / a.targetAmount
      )
      .slice(0, 3);
  };

  // Get recent transactions
  const getRecentTransactions = () => {
    if (!transactions) return [];

    return [...transactions]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        p: {
          xs: 2,
          ml: "15px 32px 24px 5px", // Reduced left padding from 24px to 5px
        },
        mt: 0,
      }}
    >
      {/* Header Section */}
      <Box
        sx={{
          mb: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Here's an overview of your finances
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          endIcon={<ChevronRightIcon />}
          sx={{ borderRadius: 2 }}
        >
          View Reports
        </Button>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            elevation={0}
            sx={{
              borderRadius: 2,
              height: "100%",
              boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.05)",
            }}
          >
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Avatar
                  sx={{
                    bgcolor: "background.paper",
                    color: "primary.main",
                    mr: 1.5,
                  }}
                >
                  $
                </Avatar>
                <Typography variant="body2" color="text.secondary">
                  Total Balance
                </Typography>
              </Box>
              <Typography
                variant="h4"
                component="div"
                sx={{ fontWeight: "bold", mb: 0.5 }}
              >
                {formatCurrency(balance?.total || 24563)}
              </Typography>
              <Typography
                variant="body2"
                color="success.main"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  fontWeight: 500,
                }}
              >
                <ArrowUpIcon fontSize="small" sx={{ mr: 0.5 }} />
                +12.5%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        {/* Investments Card */}
        <Grid item xs={12} sm={6} md={3}>
          <Card
            elevation={0}
            sx={{
              borderRadius: 2,
              height: "100%",
              boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.05)",
            }}
          >
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Avatar
                  sx={{
                    bgcolor: "background.paper",
                    color: "primary.main",
                    mr: 1.5,
                  }}
                >
                  <TrendingUpIcon />
                </Avatar>
                <Typography variant="body2" color="text.secondary">
                  Investments
                </Typography>
              </Box>
              <Typography
                variant="h4"
                component="div"
                sx={{ fontWeight: "bold", mb: 0.5 }}
              >
                {formatCurrency(investments?.totalValue || 18300)}
              </Typography>
              <Typography
                variant="body2"
                color="success.main"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  fontWeight: 500,
                }}
              >
                <ArrowUpIcon fontSize="small" sx={{ mr: 0.5 }} />
                +8.2%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        {/* Savings Card */}
        <Grid item xs={12} sm={6} md={3}>
          <Card
            elevation={0}
            sx={{
              borderRadius: 2,
              height: "100%",
              boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.05)",
            }}
          >
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Avatar
                  sx={{
                    bgcolor: "background.paper",
                    color: "primary.main",
                    mr: 1.5,
                  }}
                >
                  <SavingsIcon />
                </Avatar>
                <Typography variant="body2" color="text.secondary">
                  Savings
                </Typography>
              </Box>
              <Typography
                variant="h4"
                component="div"
                sx={{ fontWeight: "bold", mb: 0.5 }}
              >
                {formatCurrency(balance?.savings || 6263)}
              </Typography>
              <Typography
                variant="body2"
                color="success.main"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  fontWeight: 500,
                }}
              >
                <ArrowUpIcon fontSize="small" sx={{ mr: 0.5 }} />
                +24.3%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        {/* Monthly Goal Card */}
        <Grid item xs={12} sm={6} md={3}>
          <Card
            elevation={0}
            sx={{
              borderRadius: 2,
              height: "100%",
              boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.05)",
            }}
          >
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Avatar
                  sx={{
                    bgcolor: "background.paper",
                    color: "primary.main",
                    mr: 1.5,
                  }}
                >
                  <SavingsIcon />
                </Avatar>
                <Typography variant="body2" color="text.secondary">
                  Monthly Goal
                </Typography>
              </Box>
              <Typography
                variant="h4"
                component="div"
                sx={{ fontWeight: "bold", mb: 0.5 }}
              >
                78%
              </Typography>
              <LinearProgress
                variant="determinate"
                value={78}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  mb: 0.5,
                }}
              />
              <Typography variant="caption" color="text.secondary">
                $3,500 / $4,500
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Content */}
      <Grid container spacing={2}>
        {" "}
        {/* Reduced from 2.5 to 2 */}
        {/* Left Column */}
        <Grid item xs={12} md={9}>
          {/* Portfolio Performance */}
          <Card
            elevation={0}
            sx={{
              borderRadius: 2,
              mb: 2, // Reduced from 2.5 to 2
              boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.05)",
            }}
          >
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h6" fontWeight="bold">
                  Portfolio Performance
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Your investment growth over time
                </Typography>
              </Box>
              <Box sx={{ height: 300, position: "relative" }}>
                {loading.investmentPerformance ? (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "100%",
                    }}
                  >
                    <CircularProgress size={40} />
                  </Box>
                ) : (
                  <Line
                    data={investmentChartData}
                    options={investmentChartOptions}
                  />
                )}
              </Box>
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card
            elevation={0}
            sx={{
              borderRadius: 2,
              boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.05)",
            }}
          >
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h6" fontWeight="bold">
                  Recent Transactions
                </Typography>
                <Button
                  variant="text"
                  color="primary"
                  endIcon={<ChevronRightIcon />}
                  component="a"
                  href="/transactions"
                  sx={{ fontWeight: 500 }}
                >
                  View All
                </Button>
              </Box>
              <List disablePadding>
                {getRecentTransactions().map((transaction) => (
                  <ListItem
                    key={transaction.id}
                    disablePadding
                    sx={{
                      py: 1.5,
                      borderBottom: "1px solid",
                      borderColor: "divider",
                      "&:last-child": {
                        borderBottom: "none",
                      },
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar
                        sx={{
                          bgcolor: `${
                            transaction.type === "expense"
                              ? theme.palette.error.main
                              : theme.palette.success.main
                          }15`,
                          color:
                            transaction.type === "expense"
                              ? theme.palette.error.main
                              : theme.palette.success.main,
                        }}
                      >
                        {transaction.type === "expense" ? (
                          <ArrowDownIcon />
                        ) : (
                          <ArrowUpIcon />
                        )}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="body2" fontWeight={500}>
                          {transaction.description}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="caption" color="text.secondary">
                          {new Date(transaction.date).toLocaleDateString(
                            "en-US",
                            { month: "short", day: "numeric" }
                          )}{" "}
                          • {transaction.category}
                        </Typography>
                      }
                    />
                    <ListItemSecondaryAction>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: "medium",
                          color:
                            transaction.type === "expense"
                              ? theme.palette.error.main
                              : theme.palette.success.main,
                        }}
                      >
                        {transaction.type === "expense" ? "-" : "+"}
                        {formatCurrency(Math.abs(transaction.amount))}
                      </Typography>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
        {/* Right Column */}
        <Grid item xs={12} md={3}>
          {/* Savings Goals */}
          <Card
            elevation={0}
            sx={{
              borderRadius: 2,
              mb: 2, // Reduced from 2.5 to 2
              boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.05)",
            }}
          >
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h6" fontWeight="bold">
                  Savings Goals
                </Typography>
                <Button
                  variant="text"
                  color="primary"
                  endIcon={<ChevronRightIcon />}
                  component="a"
                  href="/savings"
                  sx={{ fontWeight: 500 }}
                >
                  View All
                </Button>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Track your progress
              </Typography>

              <List disablePadding>
                {getTopSavingsGoals().map((goal) => {
                  const progress = Math.round(
                    (goal.currentAmount / goal.targetAmount) * 100
                  );

                  return (
                    <Box key={goal.id} sx={{ mb: 2 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mb: 0.5,
                        }}
                      >
                        <Typography variant="body2" fontWeight={500}>
                          {goal.name}
                        </Typography>
                        <Typography variant="body2" fontWeight={500}>
                          {formatCurrency(goal.currentAmount)} /{" "}
                          {formatCurrency(goal.targetAmount)}
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={progress}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          mb: 0.5,
                        }}
                      />
                    </Box>
                  );
                })}
              </List>
            </CardContent>
          </Card>

          {/* Spending by Category */}
          <Card
            elevation={0}
            sx={{
              borderRadius: 2,
              boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.05)",
            }}
          >
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h6" fontWeight="bold">
                  Spending by Category
                </Typography>
                <IconButton size="small">
                  <MoreVertIcon fontSize="small" />
                </IconButton>
              </Box>
              <Box sx={{ height: 220, position: "relative", mb: 2 }}>
                {loading.spendingByCategory ? (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "100%",
                    }}
                  >
                    <CircularProgress size={40} />
                  </Box>
                ) : (
                  <Doughnut
                    data={spendingChartData}
                    options={spendingChartOptions}
                  />
                )}
              </Box>
              <List disablePadding>
                {spendingByCategory.slice(0, 4).map((category) => (
                  <ListItem
                    key={category.id}
                    disablePadding
                    sx={{
                      py: 1,
                      px: 0,
                      borderBottom: "1px solid",
                      borderColor: "divider",
                      "&:last-child": {
                        borderBottom: "none",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        bgcolor: category.color || theme.palette.primary.main,
                        mr: 1.5,
                      }}
                    />
                    <ListItemText
                      primary={
                        <Typography variant="body2" fontWeight={500}>
                          {category.name}
                        </Typography>
                      }
                    />
                    <Typography variant="body2" fontWeight={500}>
                      {formatCurrency(category.amount)}
                    </Typography>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;

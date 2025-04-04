// Mock API service for the Fintech Dashboard

// Helper to simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock user data
export const fetchUserData = async () => {
  await delay(800);
  return {
    id: 'usr_12345',
    firstName: 'Alex',
    lastName: 'Johnson',
    email: 'alex.johnson@example.com',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    memberSince: '2022-03-15',
    phoneNumber: '+1 (555) 123-4567',
    notificationPreferences: {
      email: true,
      push: true,
      sms: false
    }
  };
};

// Mock account balance data
export const fetchAccountBalance = async () => {
  await delay(600);
  return {
    total: 24850.75,
    available: 22350.75,
    pending: 2500.00,
    savingsTotal: 15000.00,
    investmentsTotal: 9850.75,
    currency: 'USD',
    lastUpdated: new Date().toISOString()
  };
};

// Mock transaction data
export const fetchTransactions = async () => {
  await delay(1000);
  return [
    {
      id: 'txn_123456',
      date: '2025-03-30T14:22:30Z',
      description: 'Grocery Store',
      amount: -125.40,
      category: 'Groceries',
      type: 'expense'
    },
    {
      id: 'txn_123457',
      date: '2025-03-29T09:15:00Z',
      description: 'Salary Deposit',
      amount: 3200.00,
      category: 'Income',
      type: 'income'
    },
    {
      id: 'txn_123458',
      date: '2025-03-28T18:45:20Z',
      description: 'Coffee Shop',
      amount: -4.50,
      category: 'Dining',
      type: 'expense'
    },
    {
      id: 'txn_123459',
      date: '2025-03-27T12:30:45Z',
      description: 'Electric Bill',
      amount: -95.20,
      category: 'Utilities',
      type: 'expense'
    },
    {
      id: 'txn_123460',
      date: '2025-03-26T16:10:15Z',
      description: 'Transfer to Savings',
      amount: -500.00,
      category: 'Transfer',
      type: 'transfer'
    },
    {
      id: 'txn_123461',
      date: '2025-03-25T08:05:30Z',
      description: 'Online Shopping',
      amount: -78.35,
      category: 'Shopping',
      type: 'expense'
    },
    {
      id: 'txn_123462',
      date: '2025-03-24T20:45:10Z',
      description: 'Ride Share',
      amount: -18.75,
      category: 'Transportation',
      type: 'expense'
    },
    {
      id: 'txn_123463',
      date: '2025-03-23T11:20:40Z',
      description: 'Dividend Payment',
      amount: 25.60,
      category: 'Investment',
      type: 'income'
    }
  ];
};

// Mock savings goals data
export const fetchSavingsGoals = async () => {
  await delay(700);
  return [
    {
      id: 'goal_1',
      name: 'Emergency Fund',
      targetAmount: 10000.00,
      currentAmount: 6500.00,
      deadline: '2025-12-31',
      category: 'Emergency',
      icon: 'shield',
      color: '#2E7D32',
      autoContribution: 200.00,
      frequency: 'monthly'
    },
    {
      id: 'goal_2',
      name: 'Vacation',
      targetAmount: 3000.00,
      currentAmount: 1200.00,
      deadline: '2025-07-15',
      category: 'Travel',
      icon: 'beach_access',
      color: '#1976D2',
      autoContribution: 150.00,
      frequency: 'monthly'
    },
    {
      id: 'goal_3',
      name: 'New Laptop',
      targetAmount: 1500.00,
      currentAmount: 750.00,
      deadline: '2025-05-01',
      category: 'Electronics',
      icon: 'laptop',
      color: '#9C27B0',
      autoContribution: 100.00,
      frequency: 'monthly'
    }
  ];
};

// Mock investments data
export const fetchInvestments = async () => {
  await delay(900);
  return [
    {
      id: 'inv_1',
      name: 'Tech Growth ETF',
      ticker: 'TGRO',
      shares: 10.5,
      buyPrice: 95.20,
      currentPrice: 105.75,
      value: 1110.38,
      change: 10.55,
      changePercent: 11.08,
      type: 'ETF'
    },
    {
      id: 'inv_2',
      name: 'Sustainable Energy Fund',
      ticker: 'SENR',
      shares: 25.0,
      buyPrice: 42.30,
      currentPrice: 48.15,
      value: 1203.75,
      change: 5.85,
      changePercent: 13.83,
      type: 'Mutual Fund'
    },
    {
      id: 'inv_3',
      name: 'Global Index Fund',
      ticker: 'GIDX',
      shares: 15.75,
      buyPrice: 150.00,
      currentPrice: 153.25,
      value: 2413.69,
      change: 3.25,
      changePercent: 2.17,
      type: 'Index Fund'
    },
    {
      id: 'inv_4',
      name: 'Dividend Aristocrats',
      ticker: 'DIVD',
      shares: 20.0,
      buyPrice: 65.40,
      currentPrice: 68.75,
      value: 1375.00,
      change: 3.35,
      changePercent: 5.12,
      type: 'ETF'
    }
  ];
};

// Mock historical performance data for charts
export const fetchInvestmentPerformance = async () => {
  await delay(800);
  const today = new Date();
  const data = [];
  
  // Generate 30 days of data
  for (let i = 30; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Create some realistic looking fluctuations
    const baseValue = 10000;
    const randomFactor = 0.02; // 2% max daily change
    const trendFactor = 0.005; // 0.5% upward trend per day
    
    // Calculate value with some randomness and overall upward trend
    const dayFactor = 1 + (Math.random() * 2 - 1) * randomFactor + (trendFactor * (30 - i));
    const value = baseValue * (1 + (dayFactor - 1) * (30 - i) / 30);
    
    data.push({
      date: date.toISOString().split('T')[0],
      value: Math.round(value * 100) / 100
    });
  }
  
  return data;
};

// Mock spending breakdown by category
export const fetchSpendingByCategory = async () => {
  await delay(700);
  return [
    { category: 'Housing', amount: 1200.00, percentage: 35 },
    { category: 'Food', amount: 450.00, percentage: 13 },
    { category: 'Transportation', amount: 350.00, percentage: 10 },
    { category: 'Entertainment', amount: 250.00, percentage: 7 },
    { category: 'Shopping', amount: 300.00, percentage: 9 },
    { category: 'Utilities', amount: 200.00, percentage: 6 },
    { category: 'Healthcare', amount: 150.00, percentage: 4 },
    { category: 'Other', amount: 550.00, percentage: 16 }
  ];
};

// Mock monthly spending history
export const fetchMonthlySpending = async () => {
  await delay(800);
  return [
    { month: 'Jan', amount: 3200 },
    { month: 'Feb', amount: 3350 },
    { month: 'Mar', amount: 3100 },
    { month: 'Apr', amount: 3450 },
    { month: 'May', amount: 3600 },
    { month: 'Jun', amount: 3200 },
    { month: 'Jul', amount: 3300 },
    { month: 'Aug', amount: 3500 },
    { month: 'Sep', amount: 3700 },
    { month: 'Oct', amount: 3400 },
    { month: 'Nov', amount: 3250 },
    { month: 'Dec', amount: 3800 }
  ];
};

// Mock notifications
export const fetchNotifications = async () => {
  await delay(500);
  return [
    {
      id: 'notif_1',
      type: 'alert',
      title: 'Unusual Activity Detected',
      message: 'We noticed a transaction of $250 at Electronics Store that doesn\'t match your usual spending pattern.',
      date: '2025-03-31T08:15:30Z',
      read: false
    },
    {
      id: 'notif_2',
      type: 'info',
      title: 'Automatic Savings Transfer',
      message: 'Your scheduled transfer of $200 to Emergency Fund has been completed.',
      date: '2025-03-30T10:00:00Z',
      read: true
    },
    {
      id: 'notif_3',
      type: 'success',
      title: 'Investment Goal Reached',
      message: 'Congratulations! Your Tech Growth ETF investment has reached your target return of 10%.',
      date: '2025-03-29T14:30:45Z',
      read: false
    }
  ];
};

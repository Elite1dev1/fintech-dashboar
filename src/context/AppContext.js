import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchUserData, fetchAccountBalance, fetchTransactions, fetchSavingsGoals, fetchInvestments } from '../services/api';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  // User state
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Financial data
  const [balance, setBalance] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [savingsGoals, setSavingsGoals] = useState([]);
  const [investments, setInvestments] = useState([]);
  
  // UI state
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // Initialize app with mock data
  useEffect(() => {
    const initializeApp = async () => {
      try {
        setLoading(true);
        // Simulate authentication
        const userData = await fetchUserData();
        setUser(userData);
        setIsAuthenticated(true);
        
        // Fetch financial data
        const balanceData = await fetchAccountBalance();
        setBalance(balanceData);
        
        const transactionsData = await fetchTransactions();
        setTransactions(transactionsData);
        
        const savingsData = await fetchSavingsGoals();
        setSavingsGoals(savingsData);
        
        const investmentsData = await fetchInvestments();
        setInvestments(investmentsData);
      } catch (error) {
        console.error('Error initializing app:', error);
        // Handle error state
      } finally {
        setLoading(false);
      }
    };

    initializeApp();
  }, []);

  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Add a new notification
  const addNotification = (notification) => {
    setNotifications([...notifications, { ...notification, id: Date.now() }]);
  };

  // Remove a notification
  const removeNotification = (id) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  // Add a new savings goal
  const addSavingsGoal = (goal) => {
    setSavingsGoals([...savingsGoals, { ...goal, id: Date.now() }]);
  };

  // Update a savings goal
  const updateSavingsGoal = (id, updates) => {
    setSavingsGoals(
      savingsGoals.map(goal => goal.id === id ? { ...goal, ...updates } : goal)
    );
  };

  // Delete a savings goal
  const deleteSavingsGoal = (id) => {
    setSavingsGoals(savingsGoals.filter(goal => goal.id !== id));
  };

  // Log out user
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    // Clear other user-specific data if needed
  };

  const value = {
    // User state
    user,
    isAuthenticated,
    loading,
    
    // Financial data
    balance,
    transactions,
    savingsGoals,
    investments,
    
    // UI state
    sidebarOpen,
    darkMode,
    notifications,
    
    // Actions
    toggleSidebar,
    toggleDarkMode,
    addNotification,
    removeNotification,
    addSavingsGoal,
    updateSavingsGoal,
    deleteSavingsGoal,
    logout
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContext;

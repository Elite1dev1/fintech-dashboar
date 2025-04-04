import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import theme from './styles/theme';
import { AppProvider, useAppContext } from './context/AppContext';

// Layout
import Layout from './components/common/Layout';
// Loading Animation
import LoadingAnimation from './components/common/LoadingAnimation';

// Pages
import Dashboard from './components/dashboard/Dashboard';
import SavingsGoals from './components/dashboard/SavingsGoals';
import Investments from './components/dashboard/Investments';
import Transactions from './components/dashboard/Transactions';
import Login from './components/auth/Login';

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAppContext();
  
  if (loading) {
    return <LoadingAnimation message="Loading your financial dashboard..." />;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

// Main App component
const App = () => {
  return (
    <AppProvider>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterLuxon}>
          <CssBaseline />
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              
              <Route 
                path="/" 
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Dashboard />
                    </Layout>
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/savings" 
                element={
                  <ProtectedRoute>
                    <Layout>
                      <SavingsGoals />
                    </Layout>
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/investments" 
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Investments />
                    </Layout>
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/transactions" 
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Transactions />
                    </Layout>
                  </ProtectedRoute>
                } 
              />
              
              {/* Add more routes as needed */}
              
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Router>
        </LocalizationProvider>
      </ThemeProvider>
    </AppProvider>
  );
};

export default App;

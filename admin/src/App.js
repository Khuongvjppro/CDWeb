import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import DashboardPage from './pages/DashboardPage';
import ProductsPage from './pages/ProductsPage';
import OrdersPage from './pages/OrdersPage';
import UsersPage from './pages/UsersPage';
import LoginPage from './pages/LoginPage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem('adminToken')
  );

  return (
    <Router>
      <AuthProvider>
        <div className="flex h-screen bg-gray-100">
          {isAuthenticated && <Sidebar />}
          <main className="flex-1 overflow-auto">
            <Routes>
              <Route
                path="/login"
                element={
                  isAuthenticated ? (
                    <Navigate to="/dashboard" />
                  ) : (
                    <LoginPage onLoginSuccess={() => setIsAuthenticated(true)} />
                  )
                }
              />
              <Route
                path="/dashboard"
                element={isAuthenticated ? <DashboardPage /> : <Navigate to="/login" />}
              />
              <Route
                path="/products"
                element={isAuthenticated ? <ProductsPage /> : <Navigate to="/login" />}
              />
              <Route
                path="/orders"
                element={isAuthenticated ? <OrdersPage /> : <Navigate to="/login" />}
              />
              <Route
                path="/users"
                element={isAuthenticated ? <UsersPage /> : <Navigate to="/login" />}
              />
              <Route path="/" element={<Navigate to="/dashboard" />} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;

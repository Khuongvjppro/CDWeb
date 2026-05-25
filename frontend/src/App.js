import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import AuthPage from "./pages/AuthPage";
import OrdersPage from "./pages/OrdersPage";
import CheckoutPage from "./pages/CheckoutPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminProductsPage from "./pages/AdminProductsPage";
import AdminOrdersPage from "./pages/AdminOrdersPage";
import AdminUsersPage from "./pages/AdminUsersPage";

function AppContent() {
  const { user, isAuthenticated } = useAuth();
  const isAdmin = isAuthenticated() && user?.role === "admin";

  return (
    <CartProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route
              path="/admin"
              element={isAdmin ? <Navigate to="/admin/dashboard" replace /> : <AuthPage />}
            />
            <Route
              path="/"
              element={isAdmin ? <Navigate to="/admin/dashboard" replace /> : <HomePage />}
            />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/login" element={<AuthPage />} />
            <Route path="/register" element={<AuthPage />} />
            <Route
              path="/admin/dashboard"
              element={isAdmin ? <AdminDashboardPage /> : <AuthPage />}
            />
            <Route
              path="/admin/products"
              element={isAdmin ? <AdminProductsPage /> : <AuthPage />}
            />
            <Route
              path="/admin/orders"
              element={isAdmin ? <AdminOrdersPage /> : <AuthPage />}
            />
            <Route
              path="/admin/users"
              element={isAdmin ? <AdminUsersPage /> : <AuthPage />}
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </CartProvider>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;

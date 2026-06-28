import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AdminNavbar from "./components/AdminNavbar";
import AIChatWidget from "./components/AIChatWidget";
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
import AdminCategoriesPage from "./pages/AdminCategoriesPage";
import AboutHighlandsPage from "./pages/AboutHighlandsPage";
import NewsPage from "./pages/NewsPage";
import SupportPage from "./pages/SupportPage";
import ProfilePage from "./pages/ProfilePage";
import ResetPasswordPage from "./pages/ResetPasswordPage";

function AppContent() {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  const isAdmin = isAuthenticated() && user?.role === "admin";
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <CartProvider>
      <div className="flex flex-col min-h-screen">
        {isAdminRoute ? <AdminNavbar /> : <Navbar />}
        <main className="flex-grow">
          <Routes>
            <Route
              path="/admin"
              element={
                isAdmin ? (
                  <Navigate to="/admin/dashboard" replace />
                ) : (
                  <AuthPage />
                )
              }
            />
            <Route
              path="/"
              element={
                isAdmin ? (
                  <Navigate to="/admin/dashboard" replace />
                ) : (
                  <HomePage />
                )
              }
            />
            <Route path="/about-highlands" element={<AboutHighlandsPage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/support" element={<SupportPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/profile" element={isAuthenticated() ? <ProfilePage /> : <AuthPage />} />
            <Route path="/login" element={<AuthPage />} />
            <Route path="/register" element={<AuthPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
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
            <Route
              path="/admin/categories"
              element={isAdmin ? <AdminCategoriesPage /> : <AuthPage />}
            />
          </Routes>
        </main>
        {!isAdminRoute && <Footer />}
        {!isAdminRoute && <AIChatWidget />}
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

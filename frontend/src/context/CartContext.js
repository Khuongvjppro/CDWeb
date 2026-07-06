import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const storageKey = useMemo(() => {
    if (user?.id) {
      return `cart_user_${user.id}`;
    }

    if (user?.email) {
      return `cart_user_${user.email}`;
    }

    return "cart_guest";
  }, [user?.id, user?.email]);

  const [cart, setCart] = useState([]);

  // Load cart when storageKey changes
  useEffect(() => {
    const savedCart = localStorage.getItem(storageKey);
    setCart(savedCart ? JSON.parse(savedCart) : []);
  }, [storageKey]);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      let newCart;

      if (existingItem) {
        newCart = prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + (product.quantity || 1) }
            : item,
        );
      } else {
        newCart = [...prevCart, { ...product, quantity: product.quantity || 1 }];
      }
      localStorage.setItem(storageKey, JSON.stringify(newCart));
      return newCart;
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => {
      const newCart = prevCart.filter((item) => item.id !== productId);
      localStorage.setItem(storageKey, JSON.stringify(newCart));
      return newCart;
    });
  };

  const updateQuantity = (productId, quantity) => {
    setCart((prevCart) => {
      let newCart;
      if (quantity <= 0) {
        newCart = prevCart.filter((item) => item.id !== productId);
      } else {
        newCart = prevCart.map((item) =>
          item.id === productId ? { ...item, quantity } : item,
        );
      }
      localStorage.setItem(storageKey, JSON.stringify(newCart));
      return newCart;
    });
  };

  const clearCart = () => {
    setCart([]);
    localStorage.setItem(storageKey, JSON.stringify([]));
  };

  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalAmount,
        getTotalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};

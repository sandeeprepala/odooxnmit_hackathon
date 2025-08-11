import React, { createContext, useContext, useMemo, useState } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  function addItem(item) {
    setItems((prev) => {
      const exists = prev.find((p) => p.productId === item.productId);
      if (exists) {
        return prev.map((p) => (p.productId === item.productId ? { ...p, quantity: p.quantity + item.quantity } : p));
      }
      return [...prev, item];
    });
  }

  function removeItem(productId) {
    setItems((prev) => prev.filter((p) => p.productId !== productId));
  }

  function clearCart() {
    setItems([]);
  }

  const value = useMemo(() => ({ items, addItem, removeItem, clearCart }), [items]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}



import React, { createContext, useContext, useMemo, useState } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  function addItem(item) {
    console.log('Adding item to cart:', item);
    setItems((prev) => {
      const exists = prev.find((p) => p.productId === item.productId);
      if (exists) {
        console.log('Item already exists, updating quantity');
        return prev.map((p) => (p.productId === item.productId ? { ...p, quantity: p.quantity + item.quantity } : p));
      }
      console.log('Adding new item to cart');
      return [...prev, item];
    });
  }

  function removeItem(productId) {
    console.log('Removing item from cart:', productId);
    setItems((prev) => prev.filter((p) => p.productId !== productId));
  }

  function clearCart() {
    console.log('Clearing cart');
    setItems([]);
  }

  const value = useMemo(() => ({ items, addItem, removeItem, clearCart }), [items]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}



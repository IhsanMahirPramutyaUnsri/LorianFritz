import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const stored = localStorage.getItem('fritzoria_cart');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('fritzoria_cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (book, qty = 1) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === book.id);
      if (existing) {
        return prev.map(i =>
          i.id === book.id ? { ...i, quantity: i.quantity + qty } : i
        );
      }
      return [...prev, { ...book, quantity: qty }];
    });
  };

  const removeFromCart = (bookId) => {
    setItems(prev => prev.filter(i => i.id !== bookId));
  };

  const updateQuantity = (bookId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(bookId);
      return;
    }
    setItems(prev =>
      prev.map(i => (i.id === bookId ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, subtotal }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}

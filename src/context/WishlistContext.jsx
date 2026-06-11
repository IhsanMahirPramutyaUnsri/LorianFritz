import { createContext, useContext, useState, useEffect } from 'react';

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const stored = localStorage.getItem('fritzoria_wishlist');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('fritzoria_wishlist', JSON.stringify(items));
  }, [items]);

  const toggle = (book) => {
    setItems(prev =>
      prev.find(i => i.id === book.id)
        ? prev.filter(i => i.id !== book.id)
        : [...prev, book]
    );
  };

  const isWishlisted = (bookId) => items.some(i => i.id === bookId);

  return (
    <WishlistContext.Provider value={{ items, toggle, isWishlisted }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}

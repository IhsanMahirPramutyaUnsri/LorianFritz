import { createContext, useContext, useState, useEffect } from 'react';

const OrderContext = createContext(null);

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState(() => {
    try {
      const stored = localStorage.getItem('fritzoria_orders');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('fritzoria_orders', JSON.stringify(orders));
  }, [orders]);

  const placeOrder = ({ userId, userName, items, subtotal, tax, total, shipping, payment }) => {
    const order = {
      id: `ORD-${Date.now()}`,
      userId,
      userName,
      items,
      subtotal,
      tax,
      total,
      shipping,
      payment,
      status: 'Processing',
      placedAt: new Date().toISOString(),
    };
    setOrders(prev => [order, ...prev]);
    return order;
  };

  const getOrdersByUser = (userId) => orders.filter(o => o.userId === userId);

  return (
    <OrderContext.Provider value={{ orders, placeOrder, getOrdersByUser }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  return useContext(OrderContext);
}

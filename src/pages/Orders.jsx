import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';

const STATUS_COLORS = {
  Processing: { bg: 'bg-yellow-50', text: 'text-yellow-700', dot: 'bg-yellow-400' },
  Shipped: { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-400' },
  Delivered: { bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-500' },
  Cancelled: { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-400' },
};

export default function Orders() {
  const { user } = useAuth();
  const { getOrdersByUser } = useOrders();
  const orders = getOrdersByUser(user?.id);

  const formatPrice = (p) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(p);

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-6xl mb-4">📦</p>
          <h2 className="text-2xl font-bold mb-2" style={{ color: '#0A2342' }}>No orders yet</h2>
          <p className="text-gray-500 mb-6">Your completed orders will appear here.</p>
          <Link to="/" className="inline-block text-white font-semibold px-8 py-3 rounded-xl no-underline hover:opacity-90" style={{ backgroundColor: '#0A2342' }}>
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div style={{ backgroundColor: '#0A2342' }} className="py-6 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-white">Order History</h1>
          <p className="text-white/60 text-sm mt-1">{orders.length} order{orders.length !== 1 ? 's' : ''} placed</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-5">
        {orders.map(order => {
          const st = STATUS_COLORS[order.status] || STATUS_COLORS.Processing;
          return (
            <div key={order.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
              {/* Order header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 border-b border-gray-100">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-bold text-sm" style={{ color: '#0A2342' }}>{order.id}</span>
                  <span className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${st.bg} ${st.text}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                    {order.status}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">{formatDate(order.placedAt)}</p>
                  <p className="font-bold text-sm mt-0.5" style={{ color: '#0A2342' }}>{formatPrice(order.total)}</p>
                </div>
              </div>

              {/* Order items */}
              <div className="px-6 py-4 space-y-3">
                {order.items.map(item => (
                  <div key={item.id} className="flex items-center gap-3">
                    <img
                      src={item.coverUrl}
                      alt={item.title}
                      className="w-10 h-13 object-cover rounded flex-shrink-0"
                      onError={e => { e.target.src = 'https://via.placeholder.com/40x55/0A2342/ffffff?text=B'; }}
                    />
                    <div className="flex-1 min-w-0">
                      <Link to={`/books/${item.id}`} className="no-underline">
                        <p className="text-sm font-medium line-clamp-1 hover:underline" style={{ color: '#0A2342' }}>{item.title}</p>
                      </Link>
                      <p className="text-xs text-gray-400">{item.author} · ×{item.quantity}</p>
                    </div>
                    <p className="text-sm font-semibold flex-shrink-0" style={{ color: '#0A2342' }}>
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3 text-xs text-gray-500">
                <div className="flex items-center gap-4">
                  <span>📦 {order.shipping?.option?.label || 'Standard Shipping'}</span>
                  <span>💳 {order.payment?.method?.toUpperCase()}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span>Tax: {formatPrice(order.tax)}</span>
                  <span>Shipping: {order.shipping?.option?.price === 0 ? 'Free' : formatPrice(order.shipping?.option?.price)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

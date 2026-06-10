import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

export default function CartItem({ item }) {
  const { updateQuantity, removeFromCart } = useCart();

  const formatPrice = (price) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);

  return (
    <div className="flex items-center gap-4 bg-white border border-gray-200 rounded-xl p-4">
      <Link to={`/books/${item.id}`}>
        <img
          src={item.coverUrl}
          alt={item.title}
          className="w-16 h-20 object-cover rounded-lg flex-shrink-0"
          onError={e => {
            e.target.src = `https://via.placeholder.com/80x100/0A2342/ffffff?text=Book`;
          }}
        />
      </Link>

      <div className="flex-1 min-w-0">
        <Link to={`/books/${item.id}`} className="no-underline">
          <h3 className="font-semibold text-sm leading-tight line-clamp-2" style={{ color: '#0A2342' }}>{item.title}</h3>
        </Link>
        <p className="text-gray-500 text-xs mt-0.5">{item.author}</p>
        <p className="text-gray-400 text-xs mt-0.5">{item.genre}</p>
        <p className="font-semibold text-sm mt-1" style={{ color: '#0A2342' }}>{formatPrice(item.price)}</p>
      </div>

      <div className="flex flex-col items-end gap-2">
        <button
          onClick={() => removeFromCart(item.id)}
          className="text-red-400 hover:text-red-600 transition-colors"
          aria-label="Remove item"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>

        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
          <button
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
            className="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors text-sm font-medium"
          >
            −
          </button>
          <span className="w-8 text-center text-sm font-semibold" style={{ color: '#0A2342' }}>{item.quantity}</span>
          <button
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            className="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors text-sm font-medium"
          >
            +
          </button>
        </div>

        <p className="text-xs font-semibold" style={{ color: '#0A2342' }}>
          {formatPrice(item.price * item.quantity)}
        </p>
      </div>
    </div>
  );
}

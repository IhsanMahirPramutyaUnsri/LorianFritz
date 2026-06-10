import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import StarRating from './StarRating';

export default function BookCard({ book }) {
  const { addToCart } = useCart();

  const formatPrice = (price) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl hover:scale-[1.02] transition-all duration-200 flex flex-col group">
      <Link to={`/books/${book.id}`} className="no-underline">
        <div className="relative overflow-hidden bg-gray-100 h-56">
          <img
            src={book.coverUrl}
            alt={book.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={e => {
              e.target.src = `https://via.placeholder.com/300x400/0A2342/ffffff?text=${encodeURIComponent(book.title)}`;
            }}
          />
          <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm text-xs font-semibold px-2 py-1 rounded-full" style={{ color: '#0A2342' }}>
            {book.genre}
          </div>
        </div>
      </Link>

      <div className="p-4 flex flex-col flex-1">
        <Link to={`/books/${book.id}`} className="no-underline">
          <h3 className="font-semibold text-base leading-tight mb-1 line-clamp-2" style={{ color: '#0A2342' }}>
            {book.title}
          </h3>
          <p className="text-gray-500 text-sm mb-2">{book.author}</p>
        </Link>

        <div className="flex items-center gap-1 mb-3">
          <StarRating rating={book.rating} size="sm" />
          <span className="text-gray-400 text-xs ml-1">{book.rating}</span>
        </div>

        <div className="mt-auto flex items-center justify-between gap-2">
          <span className="font-bold text-base" style={{ color: '#0A2342' }}>
            {formatPrice(book.price)}
          </span>
          <button
            onClick={() => addToCart(book)}
            className="text-white text-sm font-medium px-3 py-2 rounded-lg transition-all duration-150 hover:opacity-90 active:scale-95"
            style={{ backgroundColor: '#0A2342' }}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

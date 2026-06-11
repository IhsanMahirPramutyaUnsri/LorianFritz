import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import StarRating from './StarRating';

export default function BookCard({ book }) {
  const { addToCart } = useCart();
  const { toggle, isWishlisted } = useWishlist();
  const { addToast } = useToast();
  const wishlisted = isWishlisted(book.id);
  const outOfStock = book.stock === 0;

  const formatPrice = (price) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (outOfStock) return;
    addToCart(book);
    addToast(`"${book.title}" added to cart`);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    toggle(book);
    addToast(wishlisted ? 'Removed from wishlist' : 'Added to wishlist ❤️', wishlisted ? 'info' : 'success');
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl hover:scale-[1.02] transition-all duration-200 flex flex-col group">
      <Link to={`/books/${book.id}`} className="no-underline">
        <div className="relative overflow-hidden bg-gray-100 h-56">
          <img
            src={book.coverUrl}
            alt={book.title}
            className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${outOfStock ? 'opacity-60' : ''}`}
            onError={e => {
              e.target.src = `https://via.placeholder.com/300x400/0A2342/ffffff?text=${encodeURIComponent(book.title)}`;
            }}
          />
          {/* Genre badge */}
          <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-xs font-semibold px-2 py-1 rounded-full" style={{ color: '#0A2342' }}>
            {book.genre}
          </div>
          {/* Out of stock overlay */}
          {outOfStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">Out of Stock</span>
            </div>
          )}
        </div>
      </Link>

      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-1 mb-1">
          <Link to={`/books/${book.id}`} className="no-underline flex-1 min-w-0">
            <h3 className="font-semibold text-base leading-tight line-clamp-2" style={{ color: '#0A2342' }}>
              {book.title}
            </h3>
          </Link>
          {/* Wishlist button */}
          <button
            onClick={handleWishlist}
            aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-50 transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill={wishlisted ? '#e11d48' : 'none'} stroke={wishlisted ? '#e11d48' : '#9ca3af'} strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>

        <p className="text-gray-500 text-sm mb-2">{book.author}</p>

        <div className="flex items-center gap-1 mb-3">
          <StarRating rating={book.rating} size="sm" />
          <span className="text-gray-400 text-xs ml-1">{book.rating}</span>
        </div>

        <div className="mt-auto flex items-center justify-between gap-2">
          <span className="font-bold text-base" style={{ color: '#0A2342' }}>
            {formatPrice(book.price)}
          </span>
          <button
            onClick={handleAddToCart}
            disabled={outOfStock}
            className="text-white text-sm font-medium px-3 py-2 rounded-lg transition-all duration-150 hover:opacity-90 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ backgroundColor: '#0A2342' }}
          >
            {outOfStock ? 'Sold Out' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}

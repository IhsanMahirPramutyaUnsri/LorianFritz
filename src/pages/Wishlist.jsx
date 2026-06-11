import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import StarRating from '../components/StarRating';

export default function Wishlist() {
  const { items, toggle } = useWishlist();
  const { addToCart } = useCart();
  const { addToast } = useToast();

  const formatPrice = (price) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-6xl mb-4">❤️</p>
          <h2 className="text-2xl font-bold mb-2" style={{ color: '#0A2342' }}>Your wishlist is empty</h2>
          <p className="text-gray-500 mb-6">Save books you love by clicking the heart icon on any book card.</p>
          <Link
            to="/"
            className="inline-block text-white font-semibold px-8 py-3 rounded-xl no-underline hover:opacity-90"
            style={{ backgroundColor: '#0A2342' }}
          >
            Browse Catalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div style={{ backgroundColor: '#0A2342' }} className="py-6 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-white">My Wishlist</h1>
          <p className="text-white/60 text-sm mt-1">{items.length} saved book{items.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map(book => (
            <div key={book.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
              <Link to={`/books/${book.id}`} className="no-underline">
                <div className="h-48 bg-gray-100 overflow-hidden">
                  <img
                    src={book.coverUrl}
                    alt={book.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    onError={e => { e.target.src = `https://via.placeholder.com/300x400/0A2342/ffffff?text=${encodeURIComponent(book.title)}`; }}
                  />
                </div>
              </Link>
              <div className="p-4 flex flex-col flex-1">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 self-start mb-2" style={{ color: '#0A2342' }}>{book.genre}</span>
                <Link to={`/books/${book.id}`} className="no-underline">
                  <h3 className="font-semibold text-sm leading-tight line-clamp-2 mb-1" style={{ color: '#0A2342' }}>{book.title}</h3>
                  <p className="text-gray-500 text-xs mb-2">{book.author}</p>
                </Link>
                <div className="flex items-center gap-1 mb-3">
                  <StarRating rating={book.rating} size="sm" />
                  <span className="text-gray-400 text-xs">{book.rating}</span>
                </div>
                <div className="mt-auto flex items-center justify-between gap-2">
                  <span className="font-bold text-sm" style={{ color: '#0A2342' }}>{formatPrice(book.price)}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => { toggle(book); addToast('Removed from wishlist', 'info'); }}
                      className="w-8 h-8 flex items-center justify-center rounded-full border border-red-200 hover:bg-red-50 transition-colors"
                      aria-label="Remove from wishlist"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#e11d48" stroke="#e11d48" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => { addToCart(book); addToast(`"${book.title}" added to cart`); }}
                      disabled={book.stock === 0}
                      className="text-white text-xs font-medium px-3 py-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-40"
                      style={{ backgroundColor: '#0A2342' }}
                    >
                      {book.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

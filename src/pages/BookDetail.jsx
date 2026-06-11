import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { books } from '../data/books';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import StarRating from '../components/StarRating';
import BookCard from '../components/BookCard';

export default function BookDetail() {
  const { id } = useParams();
  const book = books.find(b => b.id === parseInt(id));
  const { addToCart } = useCart();
  const { toggle, isWishlisted } = useWishlist();
  const { addToast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const formatPrice = (price) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);

  if (!book) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50">
        <p className="text-5xl">📚</p>
        <h1 className="text-2xl font-bold" style={{ color: '#0A2342' }}>Book not found</h1>
        <Link to="/" className="text-white px-6 py-3 rounded-xl no-underline font-medium" style={{ backgroundColor: '#0A2342' }}>
          Back to Catalog
        </Link>
      </div>
    );
  }

  const relatedBooks = books.filter(b => b.genre === book.genre && b.id !== book.id).slice(0, 4);

  const wishlisted = isWishlisted(book?.id);

  const handleAddToCart = () => {
    addToCart(book, quantity);
    addToast(`"${book.title}" added to cart`);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleWishlist = () => {
    toggle(book);
    addToast(wishlisted ? 'Removed from wishlist' : 'Added to wishlist ❤️', wishlisted ? 'info' : 'success');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div style={{ backgroundColor: '#0A2342' }} className="py-3 px-4">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-sm text-white/60">
          <Link to="/" className="hover:text-white no-underline transition-colors text-white/60">Catalog</Link>
          <span>/</span>
          <span className="text-white">{book.title}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Main detail */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="flex flex-col md:flex-row gap-0">
            {/* Cover */}
            <div className="md:w-72 flex-shrink-0 bg-gray-100 flex items-center justify-center p-8">
              <img
                src={book.coverUrl}
                alt={book.title}
                className="w-48 md:w-full max-w-[200px] rounded-xl shadow-lg object-cover"
                onError={e => {
                  e.target.src = `https://via.placeholder.com/300x400/0A2342/ffffff?text=${encodeURIComponent(book.title)}`;
                }}
              />
            </div>

            {/* Info */}
            <div className="flex-1 p-8">
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-50" style={{ color: '#0A2342' }}>
                  {book.genre}
                </span>
                {book.stock < 10 && (
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-orange-50 text-orange-600">
                    Only {book.stock} left!
                  </span>
                )}
              </div>

              <h1 className="text-3xl font-bold mb-2 leading-tight" style={{ color: '#0A2342' }}>{book.title}</h1>
              <p className="text-gray-500 text-lg mb-4">by {book.author}</p>

              <div className="flex items-center gap-3 mb-4">
                <StarRating rating={book.rating} size="lg" />
                <span className="font-semibold text-lg" style={{ color: '#0A2342' }}>{book.rating}</span>
                <span className="text-gray-400 text-sm">/ 5.0</span>
              </div>

              <p className="text-gray-600 leading-relaxed mb-6">{book.description}</p>

              <div className="grid grid-cols-2 gap-3 mb-6 text-sm">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-gray-400 text-xs mb-1">ISBN</p>
                  <p className="font-medium text-gray-700">{book.isbn}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-gray-400 text-xs mb-1">Published</p>
                  <p className="font-medium text-gray-700">{book.publishedYear}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-gray-400 text-xs mb-1">Genre</p>
                  <p className="font-medium text-gray-700">{book.genre}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-gray-400 text-xs mb-1">In Stock</p>
                  <p className="font-medium text-gray-700">{book.stock} copies</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <p className="text-3xl font-bold" style={{ color: '#0A2342' }}>{formatPrice(book.price)}</p>
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors font-bold"
                    >
                      −
                    </button>
                    <span className="w-12 text-center font-semibold" style={{ color: '#0A2342' }}>{quantity}</span>
                    <button
                      onClick={() => setQuantity(q => Math.min(book.stock, q + 1))}
                      className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors font-bold"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={handleAddToCart}
                    className="flex items-center gap-2 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 hover:opacity-90"
                    style={{ backgroundColor: added ? '#16a34a' : '#0A2342' }}
                  >
                    {added ? (
                      <>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                        Added!
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Add to Cart
                      </>
                    )}
                  </button>
                  {/* Wishlist button */}
                  <button
                    onClick={handleWishlist}
                    aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                    className="flex items-center gap-2 font-semibold px-5 py-3 rounded-xl border-2 transition-all duration-200 hover:bg-red-50"
                    style={{ borderColor: wishlisted ? '#e11d48' : '#e5e7eb', color: wishlisted ? '#e11d48' : '#6b7280' }}
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill={wishlisted ? '#e11d48' : 'none'} stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    {wishlisted ? 'Wishlisted' : 'Wishlist'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Author bio */}
        <div className="mt-6 bg-white rounded-2xl border border-gray-200 p-8">
          <h2 className="text-xl font-bold mb-3" style={{ color: '#0A2342' }}>About the Author</h2>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-lg" style={{ backgroundColor: '#0A2342' }}>
              {book.author[0]}
            </div>
            <div>
              <p className="font-semibold" style={{ color: '#0A2342' }}>{book.author}</p>
              <p className="text-gray-600 mt-1 leading-relaxed text-sm">{book.authorBio}</p>
            </div>
          </div>
        </div>

        {/* Related books */}
        {relatedBooks.length > 0 && (
          <div className="mt-10">
            <h2 className="text-2xl font-bold mb-6" style={{ color: '#0A2342' }}>More in {book.genre}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {relatedBooks.map(b => <BookCard key={b.id} book={b} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

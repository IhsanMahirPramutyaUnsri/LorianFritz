import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { books } from '../data/books';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { useReviews } from '../context/ReviewContext';
import StarRating from '../components/StarRating';
import BookCard from '../components/BookCard';
import ImageWithSkeleton from '../components/ImageWithSkeleton';

export default function BookDetail() {
  const { id } = useParams();
  const book = books.find(b => b.id === parseInt(id));
  const { addToCart } = useCart();
  const { toggle, isWishlisted } = useWishlist();
  const { addToast } = useToast();
  const { user } = useAuth();
  const { getReviewsByBook, addReview, hasUserReviewed, getAverageRating } = useReviews();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 0, comment: '' });
  const [reviewErrors, setReviewErrors] = useState({});
  const [hoverStar, setHoverStar] = useState(0);

  const formatPrice = (price) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);

  if (!book) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50 dark:bg-gray-900">
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
  const hasDiscount = book.discount > 0;
  const discountedPrice = hasDiscount ? Math.round(book.price * (1 - book.discount / 100)) : book.price;
  const bookReviews = getReviewsByBook(book.id);
  const avgRating = getAverageRating(book.id, book.rating);
  const alreadyReviewed = user ? hasUserReviewed(book.id, user.id) : false;

  const handleAddToCart = () => {
    addToCart({ ...book, price: discountedPrice }, quantity);
    addToast(`"${book.title}" added to cart`);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleWishlist = () => {
    toggle(book);
    addToast(wishlisted ? 'Removed from wishlist' : 'Added to wishlist ❤️', wishlisted ? 'info' : 'success');
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    const errs = {};
    if (reviewForm.rating === 0) errs.rating = 'Please select a rating.';
    if (!reviewForm.comment.trim()) errs.comment = 'Please write a comment.';
    setReviewErrors(errs);
    if (Object.keys(errs).length) return;

    addReview({
      bookId: book.id,
      userId: user.id,
      userName: user.name,
      rating: reviewForm.rating,
      comment: reviewForm.comment.trim(),
    });
    setReviewForm({ rating: 0, comment: '' });
    addToast('Review submitted, thank you!', 'success');
  };

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
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
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
          <div className="flex flex-col md:flex-row gap-0">
            {/* Cover */}
            <div className="md:w-72 flex-shrink-0 bg-gray-100 dark:bg-gray-700 flex items-center justify-center p-8">
              <div className="w-48 md:w-full max-w-[200px] aspect-[2/3] rounded-xl shadow-lg overflow-hidden">
                <ImageWithSkeleton
                  src={book.coverUrl}
                  alt={book.title}
                  className="w-full h-full object-cover"
                  fallback={`https://via.placeholder.com/300x400/0A2342/ffffff?text=${encodeURIComponent(book.title)}`}
                />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 p-8">
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/40" style={{ color: '#0A2342' }}>
                  {book.genre}
                </span>
                {book.stock < 10 && book.stock > 0 && (
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400">
                    Only {book.stock} left!
                  </span>
                )}
                {book.stock === 0 && (
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400">
                    Out of Stock
                  </span>
                )}
                {hasDiscount && (
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-red-600 text-white">
                    -{book.discount}% OFF
                  </span>
                )}
              </div>

              <h1 className="text-3xl font-bold mb-2 leading-tight" style={{ color: '#0A2342' }}>{book.title}</h1>
              <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">by {book.author}</p>

              <div className="flex items-center gap-3 mb-4">
                <StarRating rating={avgRating} size="lg" />
                <span className="font-semibold text-lg" style={{ color: '#0A2342' }}>{avgRating}</span>
                <span className="text-gray-400 dark:text-gray-500 text-sm">
                  ({bookReviews.length} review{bookReviews.length !== 1 ? 's' : ''})
                </span>
              </div>

              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">{book.description}</p>

              <div className="grid grid-cols-2 gap-3 mb-6 text-sm">
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                  <p className="text-gray-400 dark:text-gray-500 text-xs mb-1">ISBN</p>
                  <p className="font-medium text-gray-700 dark:text-gray-200">{book.isbn}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                  <p className="text-gray-400 dark:text-gray-500 text-xs mb-1">Published</p>
                  <p className="font-medium text-gray-700 dark:text-gray-200">{book.publishedYear}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                  <p className="text-gray-400 dark:text-gray-500 text-xs mb-1">Genre</p>
                  <p className="font-medium text-gray-700 dark:text-gray-200">{book.genre}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                  <p className="text-gray-400 dark:text-gray-500 text-xs mb-1">In Stock</p>
                  <p className="font-medium text-gray-700 dark:text-gray-200">{book.stock} copies</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex flex-col">
                  {hasDiscount ? (
                    <>
                      <span className="text-gray-400 dark:text-gray-500 text-base line-through">{formatPrice(book.price)}</span>
                      <p className="text-3xl font-bold text-red-600">{formatPrice(discountedPrice)}</p>
                    </>
                  ) : (
                    <p className="text-3xl font-bold" style={{ color: '#0A2342' }}>{formatPrice(book.price)}</p>
                  )}
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex items-center border border-gray-200 dark:border-gray-600 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="w-10 h-10 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-bold"
                    >
                      −
                    </button>
                    <span className="w-12 text-center font-semibold" style={{ color: '#0A2342' }}>{quantity}</span>
                    <button
                      onClick={() => setQuantity(q => Math.min(book.stock, q + 1))}
                      className="w-10 h-10 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-bold"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={handleAddToCart}
                    disabled={book.stock === 0}
                    className="flex items-center gap-2 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{ backgroundColor: added ? '#16a34a' : '#0A2342' }}
                  >
                    {added ? (
                      <>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                        Added!
                      </>
                    ) : book.stock === 0 ? (
                      'Sold Out'
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
                    className="flex items-center gap-2 font-semibold px-5 py-3 rounded-xl border-2 transition-all duration-200 hover:bg-red-50 dark:hover:bg-red-900/20"
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
        <div className="mt-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8">
          <h2 className="text-xl font-bold mb-3" style={{ color: '#0A2342' }}>About the Author</h2>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-lg" style={{ backgroundColor: '#0A2342' }}>
              {book.author[0]}
            </div>
            <div>
              <p className="font-semibold" style={{ color: '#0A2342' }}>{book.author}</p>
              <p className="text-gray-600 dark:text-gray-300 mt-1 leading-relaxed text-sm">{book.authorBio}</p>
            </div>
          </div>
        </div>

        {/* Reviews & Ratings */}
        <div className="mt-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8">
          <h2 className="text-xl font-bold mb-5" style={{ color: '#0A2342' }}>
            Reviews & Ratings ({bookReviews.length})
          </h2>

          {/* Review form */}
          {user ? (
            alreadyReviewed ? (
              <p className="text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 mb-6">
                ✓ You've already reviewed this book. Thanks for your feedback!
              </p>
            ) : (
              <form onSubmit={handleSubmitReview} noValidate className="mb-8 bg-gray-50 dark:bg-gray-700/50 rounded-xl p-5">
                <p className="font-semibold text-sm mb-3" style={{ color: '#0A2342' }}>Write a Review</p>
                <div className="flex items-center gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverStar(star)}
                      onMouseLeave={() => setHoverStar(0)}
                      onClick={() => { setReviewForm(p => ({ ...p, rating: star })); setReviewErrors(p => ({ ...p, rating: '' })); }}
                      className="p-0.5"
                    >
                      <svg className="w-6 h-6" viewBox="0 0 20 20" fill={(hoverStar || reviewForm.rating) >= star ? '#FBBF24' : '#D1D5DB'}>
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </button>
                  ))}
                </div>
                {reviewErrors.rating && <p className="text-red-500 text-xs mb-2">{reviewErrors.rating}</p>}

                <textarea
                  value={reviewForm.comment}
                  onChange={e => { setReviewForm(p => ({ ...p, comment: e.target.value })); setReviewErrors(p => ({ ...p, comment: '' })); }}
                  rows={3}
                  placeholder="Share your thoughts about this book..."
                  className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none resize-none bg-white dark:bg-gray-800 dark:text-gray-100 ${reviewErrors.comment ? 'border-red-400' : 'border-gray-200 dark:border-gray-600'}`}
                />
                {reviewErrors.comment && <p className="text-red-500 text-xs mt-1">{reviewErrors.comment}</p>}

                <button
                  type="submit"
                  className="mt-3 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: '#0A2342' }}
                >
                  Submit Review
                </button>
              </form>
            )
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 mb-6">
              <Link to="/login" className="font-medium underline" style={{ color: '#0A2342' }}>Log in</Link> to write a review.
            </p>
          )}

          {/* Review list */}
          {bookReviews.length === 0 ? (
            <p className="text-gray-400 dark:text-gray-500 text-sm text-center py-6">No reviews yet. Be the first to review this book!</p>
          ) : (
            <div className="space-y-5">
              {bookReviews.map(review => (
                <div key={review.id} className="border-b border-gray-100 dark:border-gray-700 pb-5 last:border-0 last:pb-0">
                  <div className="flex items-center gap-3 mb-1.5">
                    <div className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: '#0A2342' }}>
                      {review.userName[0].toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-gray-800 dark:text-gray-100">{review.userName}</p>
                      <div className="flex items-center gap-2">
                        <StarRating rating={review.rating} size="sm" />
                        <span className="text-gray-400 dark:text-gray-500 text-xs">{formatDate(review.date)}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed ml-12">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
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

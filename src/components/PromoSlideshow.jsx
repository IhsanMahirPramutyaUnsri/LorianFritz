import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { books } from '../data/books';

const promoBooks = books.filter(b => b.discount > 0);

export default function PromoSlideshow() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (promoBooks.length <= 1) return;
    const t = setInterval(() => setIndex(i => (i + 1) % promoBooks.length), 5000);
    return () => clearInterval(t);
  }, []);

  if (promoBooks.length === 0) return null;

  const formatPrice = (price) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);

  const goTo = (i) => setIndex((i + promoBooks.length) % promoBooks.length);
  const book = promoBooks[index];
  const discountedPrice = Math.round(book.price * (1 - book.discount / 100));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-2 py-6">
      <div className="relative rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #102a4c 0%, #0A2342 100%)' }}>
        <div className="flex flex-col sm:flex-row items-center gap-6 p-6 sm:p-10">
          <div className="flex-1 text-white text-center sm:text-left">
            <span className="inline-block bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
              -{book.discount}% OFF
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold mb-2 line-clamp-2">{book.title}</h2>
            <p className="text-white/60 text-sm mb-4">{book.author}</p>
            <div className="flex items-center justify-center sm:justify-start gap-3 mb-5">
              <span className="text-white/50 text-sm line-through">{formatPrice(book.price)}</span>
              <span className="text-xl font-bold text-white">{formatPrice(discountedPrice)}</span>
            </div>
            <Link
              to={`/books/${book.id}`}
              className="inline-block bg-white text-sm font-semibold px-6 py-3 rounded-xl no-underline hover:opacity-90 transition-opacity"
              style={{ color: '#0A2342' }}
            >
              Shop Now →
            </Link>
          </div>
          <Link to={`/books/${book.id}`} className="flex-shrink-0">
            <img
              src={book.coverUrl}
              alt={book.title}
              className="w-32 sm:w-40 h-44 sm:h-56 object-cover rounded-xl shadow-lg"
              onError={e => { e.target.src = `https://via.placeholder.com/300x400/0A2342/ffffff?text=${encodeURIComponent(book.title)}`; }}
            />
          </Link>
        </div>

        {/* Prev/Next arrows */}
        {promoBooks.length > 1 && (
          <>
            <button
              onClick={() => goTo(index - 1)}
              aria-label="Previous promo"
              className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            >
              ‹
            </button>
            <button
              onClick={() => goTo(index + 1)}
              aria-label="Next promo"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            >
              ›
            </button>
          </>
        )}

        {/* Dots */}
        {promoBooks.length > 1 && (
          <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-2">
            {promoBooks.map((b, i) => (
              <button
                key={b.id}
                onClick={() => goTo(i)}
                aria-label={`Go to promo ${i + 1}`}
                className={`w-2 h-2 rounded-full transition-all ${i === index ? 'bg-white w-6' : 'bg-white/40'}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

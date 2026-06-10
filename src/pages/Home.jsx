import { useState, useMemo } from 'react';
import { books, genres } from '../data/books';
import BookCard from '../components/BookCard';

const ITEMS_PER_PAGE = 8;

export default function Home() {
  const [search, setSearch] = useState('');
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 300000]);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleGenre = (genre) => {
    setSelectedGenres(prev =>
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    );
    setPage(1);
  };

  const filtered = useMemo(() => {
    let result = books.filter(b => {
      const q = search.toLowerCase();
      const matchSearch = !q || b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q);
      const matchGenre = selectedGenres.length === 0 || selectedGenres.includes(b.genre);
      const matchPrice = b.price >= priceRange[0] && b.price <= priceRange[1];
      const matchRating = b.rating >= minRating;
      return matchSearch && matchGenre && matchPrice && matchRating;
    });

    switch (sortBy) {
      case 'price-asc': result = [...result].sort((a, b) => a.price - b.price); break;
      case 'price-desc': result = [...result].sort((a, b) => b.price - a.price); break;
      case 'rating': result = [...result].sort((a, b) => b.rating - a.rating); break;
      case 'newest': result = [...result].sort((a, b) => b.id - a.id); break;
    }
    return result;
  }, [search, selectedGenres, priceRange, minRating, sortBy]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const formatPrice = (p) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(p);

  const clearFilters = () => {
    setSelectedGenres([]);
    setPriceRange([0, 300000]);
    setMinRating(0);
    setSearch('');
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #0A2342 0%, #0d2d55 100%)' }} className="text-white py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Discover Your Next Great Read</h1>
          <p className="text-white/70 text-lg mb-8 max-w-xl mx-auto">
            Explore thousands of books across every genre, from timeless classics to modern bestsellers.
          </p>
          <div className="max-w-2xl mx-auto relative">
            <input
              type="text"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search by title or author..."
              className="w-full px-5 py-4 pr-12 rounded-xl text-gray-800 text-base shadow-lg focus:outline-none focus:ring-2"
              style={{ '--tw-ring-color': '#0A2342' }}
            />
            <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mobile filter toggle */}
        <div className="md:hidden mb-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="flex items-center gap-2 text-white px-4 py-2 rounded-lg text-sm font-medium"
            style={{ backgroundColor: '#0A2342' }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
            </svg>
            Filters {(selectedGenres.length > 0 || minRating > 0) && `(${selectedGenres.length + (minRating > 0 ? 1 : 0)})`}
          </button>
        </div>

        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className={`${sidebarOpen ? 'block' : 'hidden'} md:block w-full md:w-64 flex-shrink-0`}>
            <div className="bg-white rounded-xl border border-gray-200 p-5 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-base" style={{ color: '#0A2342' }}>Filters</h2>
                <button onClick={clearFilters} className="text-xs text-gray-400 hover:text-gray-600 underline">Clear all</button>
              </div>

              {/* Genre filter */}
              <div className="mb-5">
                <h3 className="font-semibold text-sm mb-3" style={{ color: '#0A2342' }}>Genre</h3>
                <div className="space-y-2">
                  {genres.map(genre => (
                    <label key={genre} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={selectedGenres.includes(genre)}
                        onChange={() => toggleGenre(genre)}
                        className="w-4 h-4 rounded"
                        style={{ accentColor: '#0A2342' }}
                      />
                      <span className="text-sm text-gray-600 group-hover:text-gray-900">{genre}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price range */}
              <div className="mb-5">
                <h3 className="font-semibold text-sm mb-3" style={{ color: '#0A2342' }}>Max Price</h3>
                <input
                  type="range"
                  min={0}
                  max={300000}
                  step={5000}
                  value={priceRange[1]}
                  onChange={e => { setPriceRange([0, +e.target.value]); setPage(1); }}
                  className="w-full"
                  style={{ accentColor: '#0A2342' }}
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Rp 0</span>
                  <span>{formatPrice(priceRange[1])}</span>
                </div>
              </div>

              {/* Rating filter */}
              <div>
                <h3 className="font-semibold text-sm mb-3" style={{ color: '#0A2342' }}>Min Rating</h3>
                <div className="space-y-1">
                  {[0, 3, 3.5, 4, 4.5].map(r => (
                    <label key={r} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="rating"
                        checked={minRating === r}
                        onChange={() => { setMinRating(r); setPage(1); }}
                        style={{ accentColor: '#0A2342' }}
                      />
                      <span className="text-sm text-gray-600">
                        {r === 0 ? 'All ratings' : `${r}+ ⭐`}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Sort + results count */}
            <div className="flex items-center justify-between mb-6 gap-4">
              <p className="text-gray-500 text-sm">
                <span className="font-semibold" style={{ color: '#0A2342' }}>{filtered.length}</span> books found
              </p>
              <select
                value={sortBy}
                onChange={e => { setSortBy(e.target.value); setPage(1); }}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none bg-white"
              >
                <option value="newest">Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>

            {/* Books grid */}
            {paginated.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {paginated.map(book => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-4xl mb-4">📚</p>
                <p className="text-gray-500 text-lg">No books found matching your criteria.</p>
                <button onClick={clearFilters} className="mt-4 text-sm underline" style={{ color: '#0A2342' }}>Clear filters</button>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-2 rounded-lg border border-gray-200 text-sm disabled:opacity-40 hover:bg-gray-50 transition-colors"
                >
                  ← Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className="w-9 h-9 rounded-lg text-sm font-medium transition-colors"
                    style={p === page
                      ? { backgroundColor: '#0A2342', color: 'white' }
                      : { border: '1px solid #e5e7eb', color: '#374151' }
                    }
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-2 rounded-lg border border-gray-200 text-sm disabled:opacity-40 hover:bg-gray-50 transition-colors"
                >
                  Next →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

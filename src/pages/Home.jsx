import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { books, genres } from '../data/books';
import BookCard from '../components/BookCard';
import PromoSlideshow from '../components/PromoSlideshow';

const ITEMS_PER_PAGE = 8;

const authors = [...new Set(books.map(b => b.author))].sort();

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedAuthors, setSelectedAuthors] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 300000]);
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authorSearchQ, setAuthorSearchQ] = useState('');

  useEffect(() => {
    setSearch(searchParams.get('q') || '');
  }, [searchParams]);

  const updateSearch = (value) => {
    setSearch(value);
    setSearchParams(value ? { q: value } : {}, { replace: true });
  };

  const toggleGenre = (genre) => {
    setSelectedGenres(prev =>
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    );
    setPage(1);
  };

  const toggleAuthor = (author) => {
    setSelectedAuthors(prev =>
      prev.includes(author) ? prev.filter(a => a !== author) : [...prev, author]
    );
    setPage(1);
  };

  const filtered = useMemo(() => {
    let result = books.filter(b => {
      const q = search.toLowerCase();
      const matchSearch = !q || b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q);
      const matchGenre = selectedGenres.length === 0 || selectedGenres.includes(b.genre);
      const matchAuthor = selectedAuthors.length === 0 || selectedAuthors.includes(b.author);
      const matchPrice = b.price >= priceRange[0] && b.price <= priceRange[1];
      const matchRating = b.rating >= minRating;
      const matchStock = !inStockOnly || b.stock > 0;
      return matchSearch && matchGenre && matchAuthor && matchPrice && matchRating && matchStock;
    });

    switch (sortBy) {
      case 'price-asc': result = [...result].sort((a, b) => a.price - b.price); break;
      case 'price-desc': result = [...result].sort((a, b) => b.price - a.price); break;
      case 'rating': result = [...result].sort((a, b) => b.rating - a.rating); break;
      case 'title-az': result = [...result].sort((a, b) => a.title.localeCompare(b.title)); break;
      case 'newest': result = [...result].sort((a, b) => b.id - a.id); break;
    }
    return result;
  }, [search, selectedGenres, selectedAuthors, priceRange, minRating, inStockOnly, sortBy]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const formatPrice = (p) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(p);

  const clearFilters = () => {
    setSelectedGenres([]);
    setSelectedAuthors([]);
    setPriceRange([0, 300000]);
    setMinRating(0);
    setInStockOnly(false);
    updateSearch('');
    setPage(1);
  };

  const activeFilterCount =
    selectedGenres.length +
    selectedAuthors.length +
    (minRating > 0 ? 1 : 0) +
    (inStockOnly ? 1 : 0) +
    (priceRange[1] < 300000 ? 1 : 0);

  const filteredAuthors = authors.filter(a =>
    !authorSearchQ || a.toLowerCase().includes(authorSearchQ.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Promo slideshow */}
      <PromoSlideshow />

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
            Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
          </button>
        </div>

        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className={`${sidebarOpen ? 'block' : 'hidden'} md:block w-full md:w-64 flex-shrink-0`}>
            <div className="bg-white rounded-xl border border-gray-200 p-5 sticky top-24 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-base" style={{ color: '#0A2342' }}>Filters</h2>
                {activeFilterCount > 0 && (
                  <button onClick={clearFilters} className="text-xs text-gray-400 hover:text-gray-600 underline">
                    Clear all ({activeFilterCount})
                  </button>
                )}
              </div>

              {/* Stock availability */}
              <div>
                <h3 className="font-semibold text-sm mb-3" style={{ color: '#0A2342' }}>Availability</h3>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={e => { setInStockOnly(e.target.checked); setPage(1); }}
                    className="w-4 h-4 rounded"
                    style={{ accentColor: '#0A2342' }}
                  />
                  <span className="text-sm text-gray-600">In Stock Only</span>
                </label>
              </div>

              {/* Genre filter */}
              <div>
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

              {/* Author filter */}
              <div>
                <h3 className="font-semibold text-sm mb-3" style={{ color: '#0A2342' }}>Author</h3>
                <input
                  type="text"
                  value={authorSearchQ}
                  onChange={e => setAuthorSearchQ(e.target.value)}
                  placeholder="Search authors..."
                  className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs mb-2 focus:outline-none"
                />
                <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                  {filteredAuthors.map(author => (
                    <label key={author} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={selectedAuthors.includes(author)}
                        onChange={() => toggleAuthor(author)}
                        className="w-4 h-4 rounded flex-shrink-0"
                        style={{ accentColor: '#0A2342' }}
                      />
                      <span className="text-xs text-gray-600 group-hover:text-gray-900 line-clamp-1">{author}</span>
                    </label>
                  ))}
                  {filteredAuthors.length === 0 && (
                    <p className="text-xs text-gray-400">No authors found.</p>
                  )}
                </div>
              </div>

              {/* Price range */}
              <div>
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
                <div className="space-y-1.5">
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
            <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
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
                <option value="title-az">Title: A–Z</option>
              </select>
            </div>

            {/* Active filter tags */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-5">
                {selectedGenres.map(g => (
                  <span key={g} className="flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-full bg-blue-50 cursor-pointer hover:bg-blue-100" style={{ color: '#0A2342' }} onClick={() => toggleGenre(g)}>
                    {g} ×
                  </span>
                ))}
                {selectedAuthors.map(a => (
                  <span key={a} className="flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-full bg-purple-50 text-purple-700 cursor-pointer hover:bg-purple-100 truncate max-w-[160px]" onClick={() => toggleAuthor(a)}>
                    {a} ×
                  </span>
                ))}
                {inStockOnly && (
                  <span className="flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-full bg-green-50 text-green-700 cursor-pointer hover:bg-green-100" onClick={() => setInStockOnly(false)}>
                    In Stock ×
                  </span>
                )}
                {minRating > 0 && (
                  <span className="flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-full bg-yellow-50 text-yellow-700 cursor-pointer hover:bg-yellow-100" onClick={() => setMinRating(0)}>
                    {minRating}+ ⭐ ×
                  </span>
                )}
                {priceRange[1] < 300000 && (
                  <span className="flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-full bg-gray-100 text-gray-700 cursor-pointer hover:bg-gray-200" onClick={() => setPriceRange([0, 300000])}>
                    Max {formatPrice(priceRange[1])} ×
                  </span>
                )}
              </div>
            )}

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
              <div className="flex items-center justify-center gap-2 mt-10 flex-wrap">
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

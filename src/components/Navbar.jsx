import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useState, useEffect, useRef } from 'react';

export default function Navbar() {
  const { totalItems } = useCart();
  const { items: wishlistItems } = useWishlist();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const accountMenuRef = useRef(null);

  useEffect(() => {
    setQuery(searchParams.get('q') || '');
  }, [searchParams]);

  useEffect(() => {
    if (!accountMenuOpen) return;
    const handleClickOutside = (e) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(e.target)) {
        setAccountMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [accountMenuOpen]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
    setAccountMenuOpen(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(query.trim() ? `/?q=${encodeURIComponent(query.trim())}` : '/');
    setMenuOpen(false);
  };

  return (
    <nav style={{ backgroundColor: '#0A2342' }} className="sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 no-underline flex-shrink-0">
            <span className="text-white text-2xl font-bold tracking-tight">📚 Fritzoria</span>
          </Link>

          {/* Center search bar - desktop */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-md mx-6 relative">
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search by title or author..."
              className="w-full pl-4 pr-10 py-2 rounded-lg text-sm text-gray-800 bg-white focus:outline-none"
            />
            <button type="submit" aria-label="Search" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </form>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-white/80 hover:text-white transition-colors text-sm font-medium no-underline">
              Catalog
            </Link>

            {/* Dark mode toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
              className="text-white/80 hover:text-white transition-colors"
            >
              {theme === 'dark' ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            {/* Wishlist icon */}
            <Link to="/wishlist" className="relative text-white no-underline" aria-label="Wishlist">
              <svg className="h-6 w-6" fill={wishlistItems.length > 0 ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {wishlistItems.length > 0 && (
                <span className="absolute -top-2 -right-2 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center bg-red-500 text-white">
                  {wishlistItems.length > 9 ? '9+' : wishlistItems.length}
                </span>
              )}
            </Link>

            {/* Cart icon */}
            <Link to="/cart" className="relative text-white no-underline" aria-label="Cart">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center bg-red-500 text-white">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </Link>

            {/* Account menu */}
            <div className="relative" ref={accountMenuRef}>
              <button
                onClick={() => setAccountMenuOpen(o => !o)}
                aria-label="Account menu"
                className="text-white/80 hover:text-white transition-colors"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              {accountMenuOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 py-2 text-sm">
                  {user ? (
                    <>
                      <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                        <p className="text-gray-400 dark:text-gray-500 text-xs">Signed in as</p>
                        <p className="font-semibold truncate" style={{ color: '#0A2342' }}>{user.name}</p>
                      </div>
                      <Link to="/profile" onClick={() => setAccountMenuOpen(false)} className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 no-underline">
                        Profile
                      </Link>
                      <Link to="/orders" onClick={() => setAccountMenuOpen(false)} className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 no-underline">
                        Orders
                      </Link>
                      {user.role === 'admin' && (
                        <Link to="/admin" onClick={() => setAccountMenuOpen(false)} className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 no-underline">
                          Admin
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-50 dark:hover:bg-gray-700 border-t border-gray-100 dark:border-gray-700"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link to="/login" onClick={() => setAccountMenuOpen(false)} className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 no-underline">
                        Login
                      </Link>
                      <Link to="/register" onClick={() => setAccountMenuOpen(false)} className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 no-underline">
                        Register
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Mobile icons + hamburger */}
          <div className="md:hidden flex items-center gap-3">
            <button onClick={toggleTheme} aria-label="Toggle dark mode" className="text-white">
              {theme === 'dark' ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
            <Link to="/wishlist" className="relative text-white no-underline">
              <svg className="h-5 w-5" fill={wishlistItems.length > 0 ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center bg-red-500 text-white text-[10px]">
                  {wishlistItems.length}
                </span>
              )}
            </Link>
            <Link to="/cart" className="relative text-white no-underline">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center bg-red-500 text-white text-[10px]">
                  {totalItems}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-white focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div style={{ backgroundColor: '#0d2d55' }} className="md:hidden px-4 py-4 flex flex-col gap-3 border-t border-white/10">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search by title or author..."
              className="w-full pl-4 pr-10 py-2 rounded-lg text-sm text-gray-800 bg-white focus:outline-none"
            />
            <button type="submit" aria-label="Search" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </form>
          <Link to="/" onClick={() => setMenuOpen(false)} className="text-white/80 hover:text-white text-sm font-medium no-underline">Catalog</Link>
          {user && (
            <Link to="/orders" onClick={() => setMenuOpen(false)} className="text-white/80 hover:text-white text-sm font-medium no-underline">Orders</Link>
          )}
          {user && (
            <Link to="/profile" onClick={() => setMenuOpen(false)} className="text-white/80 hover:text-white text-sm font-medium no-underline">Profile</Link>
          )}
          {user?.role === 'admin' && (
            <Link to="/admin" onClick={() => setMenuOpen(false)} className="text-white/80 hover:text-white text-sm font-medium no-underline">Admin</Link>
          )}
          {user ? (
            <>
              <span className="text-white/50 text-sm">Hi, {user.name}</span>
              <button onClick={handleLogout} className="text-white/80 hover:text-white text-sm font-medium text-left">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)} className="text-white/80 hover:text-white text-sm font-medium no-underline">Login</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="text-white/80 hover:text-white text-sm font-medium no-underline">Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

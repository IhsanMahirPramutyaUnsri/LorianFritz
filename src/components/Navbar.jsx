import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

export default function Navbar() {
  const { totalItems } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <nav style={{ backgroundColor: '#0A2342' }} className="sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 no-underline">
            <span className="text-white text-2xl font-bold tracking-tight">
              📚 Fritzoria
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-white/80 hover:text-white transition-colors text-sm font-medium no-underline">
              Catalog
            </Link>
            {user?.role === 'admin' && (
              <Link to="/admin" className="text-white/80 hover:text-white transition-colors text-sm font-medium no-underline">
                Admin
              </Link>
            )}
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-white/60 text-sm">Hi, {user.name}</span>
                <button
                  onClick={handleLogout}
                  className="text-white/80 hover:text-white text-sm font-medium transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-white/80 hover:text-white text-sm font-medium no-underline transition-colors">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-sm font-medium px-4 py-2 rounded-lg transition-colors no-underline"
                  style={{ color: '#0A2342' }}
                >
                  Register
                </Link>
              </div>
            )}
            <Link to="/cart" className="relative text-white no-underline">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {totalItems > 0 && (
                <span
                  className="absolute -top-2 -right-2 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#e74c3c', color: 'white' }}
                >
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-4">
            <Link to="/cart" className="relative text-white no-underline">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {totalItems > 0 && (
                <span
                  className="absolute -top-2 -right-2 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#e74c3c', color: 'white' }}
                >
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

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{ backgroundColor: '#0d2d55' }} className="md:hidden px-4 py-4 flex flex-col gap-3 border-t border-white/10">
          <Link to="/" onClick={() => setMenuOpen(false)} className="text-white/80 hover:text-white text-sm font-medium no-underline">Catalog</Link>
          {user?.role === 'admin' && (
            <Link to="/admin" onClick={() => setMenuOpen(false)} className="text-white/80 hover:text-white text-sm font-medium no-underline">Admin</Link>
          )}
          {user ? (
            <>
              <span className="text-white/60 text-sm">Hi, {user.name}</span>
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

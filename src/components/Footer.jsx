import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#071a32' }} className="text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-3">📚 Fritzoria</h3>
            <p className="text-white/60 text-sm leading-relaxed">
              Your premium destination for books across every genre. Discover, explore, and build your personal library.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-white/90">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="text-white/60 hover:text-white no-underline transition-colors">Catalog</Link></li>
              <li><Link to="/cart" className="text-white/60 hover:text-white no-underline transition-colors">Cart</Link></li>
              <li><Link to="/login" className="text-white/60 hover:text-white no-underline transition-colors">Login</Link></li>
              <li><Link to="/register" className="text-white/60 hover:text-white no-underline transition-colors">Register</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-white/90">Genres</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li>Fiction</li>
              <li>Non-Fiction</li>
              <li>Science & Technology</li>
              <li>History & Self-Help</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-white/40 text-sm">© 2025 Fritzoria. All rights reserved.</p>
          <p className="text-white/40 text-sm">Built with React & Tailwind CSS</p>
        </div>
      </div>
    </footer>
  );
}

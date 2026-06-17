import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function NotFound() {
  const navigate = useNavigate();
  const [count, setCount] = useState(10);

  useEffect(() => {
    if (count <= 0) { navigate('/'); return; }
    const t = setTimeout(() => setCount(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [count, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* Large 404 */}
        <div className="relative mb-6">
          <p className="text-[120px] md:text-[160px] font-black leading-none select-none" style={{ color: '#0A2342', opacity: 0.07 }}>
            404
          </p>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-6xl mb-2">📚</p>
            <p className="text-3xl font-bold" style={{ color: '#0A2342' }}>Page Not Found</p>
          </div>
        </div>

        <p className="text-gray-500 dark:text-gray-400 mb-2">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <p className="text-gray-400 text-sm mb-8">
          Redirecting to home in <span className="font-bold" style={{ color: '#0A2342' }}>{count}s</span>…
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="text-white font-semibold px-8 py-3 rounded-xl no-underline hover:opacity-90 transition-opacity"
            style={{ backgroundColor: '#0A2342' }}
          >
            Go Home
          </Link>
          <button
            onClick={() => navigate(-1)}
            className="font-medium px-8 py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { books as initialBooks, genres } from '../data/books';
import { useAuth } from '../context/AuthContext';

const EMPTY_FORM = {
  title: '', author: '', genre: '', price: '', coverUrl: '', description: '', stock: '', rating: '',
};

export default function Admin() {
  const { users } = useAuth();
  const [books, setBooks] = useState(initialBooks);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  const formatPrice = (price) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const validateForm = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required.';
    if (!form.author.trim()) e.author = 'Author is required.';
    if (!form.genre) e.genre = 'Genre is required.';
    if (!form.price || isNaN(+form.price) || +form.price <= 0) e.price = 'Enter a valid price.';
    if (!form.description.trim()) e.description = 'Description is required.';
    if (!form.stock || isNaN(+form.stock) || +form.stock < 0) e.stock = 'Enter a valid stock.';
    if (!form.rating || isNaN(+form.rating) || +form.rating < 0 || +form.rating > 5) e.rating = 'Rating must be between 0 and 5.';
    return e;
  };

  const startEdit = (book) => {
    setEditingId(book.id);
    setForm({
      title: book.title,
      author: book.author,
      genre: book.genre,
      price: String(book.price),
      coverUrl: book.coverUrl || '',
      description: book.description,
      stock: String(book.stock),
      rating: String(book.rating),
    });
    setFormErrors({});
    setActiveTab('add');
  };

  const handleDelete = (id) => {
    setBooks(prev => prev.filter(b => b.id !== id));
    setDeleteConfirm(null);
    showSuccess('Book deleted successfully.');
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    const e = validateForm();
    setFormErrors(e);
    if (Object.keys(e).length) return;

    const bookData = {
      title: form.title.trim(),
      author: form.author.trim(),
      genre: form.genre,
      price: +form.price,
      coverUrl: form.coverUrl.trim() || `https://via.placeholder.com/300x400/0A2342/ffffff?text=${encodeURIComponent(form.title)}`,
      description: form.description.trim(),
      stock: +form.stock,
      rating: +form.rating,
      isbn: 'N/A',
      publishedYear: new Date().getFullYear(),
      authorBio: 'No bio available.',
    };

    if (editingId) {
      setBooks(prev => prev.map(b => b.id === editingId ? { ...b, ...bookData } : b));
      showSuccess('Book updated successfully.');
    } else {
      const newBook = { id: Date.now(), ...bookData };
      setBooks(prev => [...prev, newBook]);
      showSuccess('Book added successfully.');
    }

    setForm(EMPTY_FORM);
    setEditingId(null);
    setFormErrors({});
    setActiveTab('books');
  };

  const cancelEdit = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setFormErrors({});
    setActiveTab('books');
  };

  const Field = ({ label, name, type = 'text', as, options, ...props }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      {as === 'select' ? (
        <select
          value={form[name]}
          onChange={e => { setForm(prev => ({ ...prev, [name]: e.target.value })); setFormErrors(prev => ({ ...prev, [name]: '' })); }}
          className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none ${formErrors[name] ? 'border-red-400' : 'border-gray-200'}`}
          {...props}
        >
          <option value="">Select genre...</option>
          {genres.map(g => <option key={g} value={g}>{g}</option>)}
        </select>
      ) : as === 'textarea' ? (
        <textarea
          value={form[name]}
          onChange={e => { setForm(prev => ({ ...prev, [name]: e.target.value })); setFormErrors(prev => ({ ...prev, [name]: '' })); }}
          rows={4}
          className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none resize-none ${formErrors[name] ? 'border-red-400' : 'border-gray-200'}`}
          {...props}
        />
      ) : (
        <input
          type={type}
          value={form[name]}
          onChange={e => { setForm(prev => ({ ...prev, [name]: e.target.value })); setFormErrors(prev => ({ ...prev, [name]: '' })); }}
          className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none ${formErrors[name] ? 'border-red-400' : 'border-gray-200'}`}
          {...props}
        />
      )}
      {formErrors[name] && <p className="text-red-500 text-xs mt-1.5">{formErrors[name]}</p>}
    </div>
  );

  const tabs = [
    { id: 'dashboard', label: '📊 Dashboard' },
    { id: 'books', label: '📚 Books' },
    { id: 'add', label: editingId ? '✏️ Edit Book' : '➕ Add Book' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin header */}
      <div style={{ backgroundColor: '#0A2342' }} className="py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
          <p className="text-white/60 text-sm mt-1">Manage your bookstore</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-0">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); if (tab.id !== 'add') cancelEdit(); }}
                className={`px-5 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id ? 'border-current' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                style={activeTab === tab.id ? { color: '#0A2342', borderColor: '#0A2342' } : {}}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success message */}
        {successMsg && (
          <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-xl mb-6 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
            {successMsg}
          </div>
        )}

        {/* Dashboard tab */}
        {activeTab === 'dashboard' && (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
              {[
                { label: 'Total Books', value: books.length, icon: '📚', color: '#0A2342' },
                { label: 'Total Users', value: users.length, icon: '👥', color: '#16a085' },
                { label: 'Total Value', value: formatPrice(books.reduce((s, b) => s + b.price * b.stock, 0)), icon: '💰', color: '#8e44ad' },
              ].map(stat => (
                <div key={stat.label} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-3xl">{stat.icon}</span>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: stat.color + '15' }}>
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: stat.color }} />
                    </div>
                  </div>
                  <p className="text-2xl font-bold" style={{ color: '#0A2342' }}>{stat.value}</p>
                  <p className="text-gray-500 text-sm mt-1">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Genre distribution */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="font-bold text-lg mb-5" style={{ color: '#0A2342' }}>Books by Genre</h2>
              <div className="space-y-3">
                {genres.map(genre => {
                  const count = books.filter(b => b.genre === genre).length;
                  const pct = Math.round((count / books.length) * 100);
                  return (
                    <div key={genre}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-700 font-medium">{genre}</span>
                        <span className="text-gray-400">{count} books ({pct}%)</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: '#0A2342' }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Books tab */}
        {activeTab === 'books' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-xl" style={{ color: '#0A2342' }}>All Books ({books.length})</h2>
              <button
                onClick={() => { setForm(EMPTY_FORM); setEditingId(null); setFormErrors({}); setActiveTab('add'); }}
                className="text-white text-sm font-medium px-4 py-2 rounded-xl flex items-center gap-2 hover:opacity-90"
                style={{ backgroundColor: '#0A2342' }}
              >
                <span>+</span> Add Book
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ backgroundColor: '#f8fafc' }} className="border-b border-gray-200">
                      <th className="text-left px-6 py-3 font-semibold text-gray-600">Book</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden sm:table-cell">Genre</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden md:table-cell">Price</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden lg:table-cell">Stock</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden lg:table-cell">Rating</th>
                      <th className="text-right px-6 py-3 font-semibold text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {books.map((book, i) => (
                      <tr key={book.id} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${i % 2 === 0 ? '' : ''}`}>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={book.coverUrl}
                              alt={book.title}
                              className="w-8 h-10 object-cover rounded"
                              onError={e => { e.target.src = 'https://via.placeholder.com/40x50/0A2342/ffffff?text=B'; }}
                            />
                            <div>
                              <p className="font-semibold text-gray-800 line-clamp-1">{book.title}</p>
                              <p className="text-gray-400 text-xs">{book.author}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 hidden sm:table-cell">
                          <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-50" style={{ color: '#0A2342' }}>{book.genre}</span>
                        </td>
                        <td className="px-4 py-4 text-gray-700 hidden md:table-cell">{formatPrice(book.price)}</td>
                        <td className="px-4 py-4 hidden lg:table-cell">
                          <span className={`text-xs font-medium ${book.stock < 10 ? 'text-orange-600' : 'text-green-600'}`}>
                            {book.stock}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-gray-700 hidden lg:table-cell">⭐ {book.rating}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => startEdit(book)}
                              className="text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors hover:bg-gray-50"
                              style={{ color: '#0A2342', borderColor: '#0A2342' }}
                            >
                              Edit
                            </button>
                            {deleteConfirm === book.id ? (
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => handleDelete(book.id)}
                                  className="text-xs font-medium px-3 py-1.5 rounded-lg bg-red-600 text-white"
                                >
                                  Confirm
                                </button>
                                <button
                                  onClick={() => setDeleteConfirm(null)}
                                  className="text-xs font-medium px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setDeleteConfirm(book.id)}
                                className="text-xs font-medium px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                              >
                                Delete
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Add/Edit Book tab */}
        {activeTab === 'add' && (
          <div className="max-w-2xl">
            <h2 className="font-bold text-xl mb-6" style={{ color: '#0A2342' }}>
              {editingId ? 'Edit Book' : 'Add New Book'}
            </h2>
            <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Field label="Title *" name="title" placeholder="Book title" />
                  <Field label="Author *" name="author" placeholder="Author name" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Field label="Genre *" name="genre" as="select" />
                  <Field label="Price (IDR) *" name="price" type="number" placeholder="e.g. 120000" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Field label="Stock *" name="stock" type="number" placeholder="e.g. 20" />
                  <Field label="Rating (0-5) *" name="rating" type="number" placeholder="e.g. 4.5" step="0.1" min="0" max="5" />
                </div>
                <Field label="Cover Image URL" name="coverUrl" placeholder="https://example.com/cover.jpg" />
                <Field label="Description *" name="description" as="textarea" placeholder="Book description..." />

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="submit"
                    className="text-white font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: '#0A2342' }}
                  >
                    {editingId ? 'Update Book' : 'Add Book'}
                  </button>
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="font-medium px-6 py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

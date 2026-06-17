import { useState } from 'react';
import { books as initialBooks, genres } from '../data/books';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';
import { useToast } from '../context/ToastContext';

const EMPTY_FORM = {
  title: '', author: '', genre: '', price: '', coverUrl: '', description: '', stock: '', rating: '', discount: '',
};

const ORDER_STATUSES = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];
const STATUS_COLORS = {
  Processing: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  Shipped: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  Delivered: 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  Cancelled: 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

export default function Admin() {
  const { user: currentUser, users, updateUserRole, deleteUser } = useAuth();
  const { orders, updateOrderStatus } = useOrders();
  const { addToast } = useToast();
  const [books, setBooks] = useState(initialBooks);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [userDeleteConfirm, setUserDeleteConfirm] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  const formatPrice = (price) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' });

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
    if (form.discount && (isNaN(+form.discount) || +form.discount < 0 || +form.discount > 90)) e.discount = 'Discount must be between 0 and 90.';
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
      discount: book.discount ? String(book.discount) : '',
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
      discount: form.discount ? +form.discount : 0,
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

  const handleRoleToggle = (u) => {
    const newRole = u.role === 'admin' ? 'user' : 'admin';
    updateUserRole(u.id, newRole);
    addToast(`${u.name} is now ${newRole === 'admin' ? 'an admin' : 'a regular user'}.`);
  };

  const handleDeleteUser = (u) => {
    deleteUser(u.id);
    setUserDeleteConfirm(null);
    addToast(`User "${u.name}" deleted.`, 'info');
  };

  const handleStatusChange = (orderId, status) => {
    updateOrderStatus(orderId, status);
    addToast(`Order ${orderId} marked as ${status}.`);
  };

  const Field = ({ label, name, type = 'text', as, ...props }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{label}</label>
      {as === 'select' ? (
        <select
          value={form[name]}
          onChange={e => { setForm(prev => ({ ...prev, [name]: e.target.value })); setFormErrors(prev => ({ ...prev, [name]: '' })); }}
          className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none bg-white dark:bg-gray-700 dark:text-gray-100 ${formErrors[name] ? 'border-red-400' : 'border-gray-200 dark:border-gray-600'}`}
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
          className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none resize-none bg-white dark:bg-gray-700 dark:text-gray-100 ${formErrors[name] ? 'border-red-400' : 'border-gray-200 dark:border-gray-600'}`}
          {...props}
        />
      ) : (
        <input
          type={type}
          value={form[name]}
          onChange={e => { setForm(prev => ({ ...prev, [name]: e.target.value })); setFormErrors(prev => ({ ...prev, [name]: '' })); }}
          className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none bg-white dark:bg-gray-700 dark:text-gray-100 ${formErrors[name] ? 'border-red-400' : 'border-gray-200 dark:border-gray-600'}`}
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
    { id: 'users', label: '👥 Users' },
    { id: 'orders', label: '📦 Orders' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Admin header */}
      <div style={{ backgroundColor: '#0A2342' }} className="py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
          <p className="text-white/60 text-sm mt-1">Manage your bookstore</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-x-auto">
          <div className="flex gap-0">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); if (tab.id !== 'add') cancelEdit(); }}
                className={`px-5 py-4 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${activeTab === tab.id ? 'border-current' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
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
          <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 text-sm px-4 py-3 rounded-xl mb-6 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
            {successMsg}
          </div>
        )}

        {/* Dashboard tab */}
        {activeTab === 'dashboard' && (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-8">
              {[
                { label: 'Total Books', value: books.length, icon: '📚', color: '#0A2342' },
                { label: 'Total Users', value: users.length, icon: '👥', color: '#16a085' },
                { label: 'Total Orders', value: orders.length, icon: '📦', color: '#e67e22' },
                { label: 'Total Value', value: formatPrice(books.reduce((s, b) => s + b.price * b.stock, 0)), icon: '💰', color: '#8e44ad' },
              ].map(stat => (
                <div key={stat.label} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-3xl">{stat.icon}</span>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: stat.color + '15' }}>
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: stat.color }} />
                    </div>
                  </div>
                  <p className="text-2xl font-bold" style={{ color: '#0A2342' }}>{stat.value}</p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Genre distribution */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="font-bold text-lg mb-5" style={{ color: '#0A2342' }}>Books by Genre</h2>
              <div className="space-y-3">
                {genres.map(genre => {
                  const count = books.filter(b => b.genre === genre).length;
                  const pct = Math.round((count / books.length) * 100);
                  return (
                    <div key={genre}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-700 dark:text-gray-300 font-medium">{genre}</span>
                        <span className="text-gray-400 dark:text-gray-500">{count} books ({pct}%)</span>
                      </div>
                      <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
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

            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left px-6 py-3 font-semibold text-gray-600 dark:text-gray-300">Book</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300 hidden sm:table-cell">Genre</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300 hidden md:table-cell">Price</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300 hidden lg:table-cell">Stock</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300 hidden lg:table-cell">Rating</th>
                      <th className="text-right px-6 py-3 font-semibold text-gray-600 dark:text-gray-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {books.map((book) => (
                      <tr key={book.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={book.coverUrl}
                              alt={book.title}
                              className="w-8 h-10 object-cover rounded"
                              onError={e => { e.target.src = 'https://via.placeholder.com/40x50/0A2342/ffffff?text=B'; }}
                            />
                            <div>
                              <p className="font-semibold text-gray-800 dark:text-gray-100 line-clamp-1">{book.title}</p>
                              <p className="text-gray-400 dark:text-gray-500 text-xs">{book.author}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 hidden sm:table-cell">
                          <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-50 dark:bg-blue-900/40" style={{ color: '#0A2342' }}>{book.genre}</span>
                        </td>
                        <td className="px-4 py-4 text-gray-700 dark:text-gray-300 hidden md:table-cell">{formatPrice(book.price)}</td>
                        <td className="px-4 py-4 hidden lg:table-cell">
                          <span className={`text-xs font-medium ${book.stock < 10 ? 'text-orange-600' : 'text-green-600'}`}>
                            {book.stock}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-gray-700 dark:text-gray-300 hidden lg:table-cell">⭐ {book.rating}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => startEdit(book)}
                              className="text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors hover:bg-gray-50 dark:hover:bg-gray-700"
                              style={{ color: '#0A2342', borderColor: '#0A2342' }}
                            >
                              Edit
                            </button>
                            {deleteConfirm === book.id ? (
                              <div className="flex items-center gap-1">
                                <button onClick={() => handleDelete(book.id)} className="text-xs font-medium px-3 py-1.5 rounded-lg bg-red-600 text-white">Confirm</button>
                                <button onClick={() => setDeleteConfirm(null)} className="text-xs font-medium px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300">Cancel</button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setDeleteConfirm(book.id)}
                                className="text-xs font-medium px-3 py-1.5 rounded-lg border border-red-200 dark:border-red-800 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
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
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 shadow-sm">
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Field label="Title *" name="title" placeholder="Book title" />
                  <Field label="Author *" name="author" placeholder="Author name" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Field label="Genre *" name="genre" as="select" />
                  <Field label="Price (IDR) *" name="price" type="number" placeholder="e.g. 120000" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <Field label="Stock *" name="stock" type="number" placeholder="e.g. 20" />
                  <Field label="Rating (0-5) *" name="rating" type="number" placeholder="e.g. 4.5" step="0.1" min="0" max="5" />
                  <Field label="Discount % (optional)" name="discount" type="number" placeholder="e.g. 20" min="0" max="90" />
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
                    className="font-medium px-6 py-3 rounded-xl border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Users tab */}
        {activeTab === 'users' && (
          <div>
            <h2 className="font-bold text-xl mb-6" style={{ color: '#0A2342' }}>All Users ({users.length})</h2>
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left px-6 py-3 font-semibold text-gray-600 dark:text-gray-300">Name</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300 hidden sm:table-cell">Email</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Role</th>
                      <th className="text-right px-6 py-3 font-semibold text-gray-600 dark:text-gray-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0" style={{ backgroundColor: '#0A2342' }}>
                              {u.name[0].toUpperCase()}
                            </div>
                            <p className="font-semibold text-gray-800 dark:text-gray-100">{u.name}</p>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-gray-600 dark:text-gray-400 hidden sm:table-cell">{u.email}</td>
                        <td className="px-4 py-4">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${u.role === 'admin' ? 'bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
                            {u.role === 'admin' ? 'Admin' : 'User'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleRoleToggle(u)}
                              disabled={u.id === currentUser.id}
                              className="text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed"
                              style={{ color: '#0A2342', borderColor: '#0A2342' }}
                            >
                              {u.role === 'admin' ? 'Demote' : 'Promote'}
                            </button>
                            {userDeleteConfirm === u.id ? (
                              <div className="flex items-center gap-1">
                                <button onClick={() => handleDeleteUser(u)} className="text-xs font-medium px-3 py-1.5 rounded-lg bg-red-600 text-white">Confirm</button>
                                <button onClick={() => setUserDeleteConfirm(null)} className="text-xs font-medium px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300">Cancel</button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setUserDeleteConfirm(u.id)}
                                disabled={u.id === currentUser.id}
                                className="text-xs font-medium px-3 py-1.5 rounded-lg border border-red-200 dark:border-red-800 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
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

        {/* Orders tab */}
        {activeTab === 'orders' && (
          <div>
            <h2 className="font-bold text-xl mb-6" style={{ color: '#0A2342' }}>All Orders ({orders.length})</h2>
            {orders.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-12 text-center">
                <p className="text-4xl mb-3">📦</p>
                <p className="text-gray-500 dark:text-gray-400">No orders have been placed yet.</p>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left px-6 py-3 font-semibold text-gray-600 dark:text-gray-300">Order ID</th>
                        <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300 hidden sm:table-cell">Customer</th>
                        <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300 hidden md:table-cell">Date</th>
                        <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Total</th>
                        <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map(order => (
                        <tr key={order.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                          <td className="px-6 py-4 font-semibold" style={{ color: '#0A2342' }}>{order.id}</td>
                          <td className="px-4 py-4 text-gray-600 dark:text-gray-400 hidden sm:table-cell">{order.userName}</td>
                          <td className="px-4 py-4 text-gray-500 dark:text-gray-500 hidden md:table-cell">{formatDate(order.placedAt)}</td>
                          <td className="px-4 py-4 text-gray-700 dark:text-gray-300 font-medium">{formatPrice(order.total)}</td>
                          <td className="px-4 py-4">
                            <select
                              value={order.status}
                              onChange={e => handleStatusChange(order.id, e.target.value)}
                              className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border-0 focus:outline-none cursor-pointer ${STATUS_COLORS[order.status]}`}
                            >
                              {ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

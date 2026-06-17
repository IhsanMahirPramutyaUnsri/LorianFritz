import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import CartItem from '../components/CartItem';

const TAX_RATE = 0.11;

export default function Cart() {
  const { items, subtotal } = useCart();

  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  const formatPrice = (price) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-6xl mb-4">🛒</p>
          <h2 className="text-2xl font-bold mb-2" style={{ color: '#0A2342' }}>Your cart is empty</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Looks like you haven't added any books yet.</p>
          <Link
            to="/"
            className="inline-block text-white font-semibold px-8 py-3 rounded-xl no-underline transition-opacity hover:opacity-90"
            style={{ backgroundColor: '#0A2342' }}
          >
            Browse Catalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div style={{ backgroundColor: '#0A2342' }} className="py-6 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-white">Shopping Cart</h1>
          <p className="text-white/60 text-sm mt-1">{items.length} item{items.length !== 1 ? 's' : ''} in your cart</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart items */}
          <div className="flex-1 space-y-4">
            {items.map(item => <CartItem key={item.id} item={item} />)}
          </div>

          {/* Order summary */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 sticky top-24">
              <h2 className="font-bold text-lg mb-5" style={{ color: '#0A2342' }}>Order Summary</h2>

              <div className="space-y-3 mb-5">
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>Tax (11%)</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-400 dark:text-gray-500">
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">Calculated at checkout</span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between font-bold text-base" style={{ color: '#0A2342' }}>
                  <span>Estimated Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              <Link
                to="/checkout"
                className="block text-center text-white font-semibold py-3.5 rounded-xl transition-opacity hover:opacity-90 mb-3 no-underline"
                style={{ backgroundColor: '#0A2342' }}
              >
                Proceed to Checkout →
              </Link>
              <Link
                to="/"
                className="block text-center text-sm font-medium no-underline transition-colors py-2 rounded-xl border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                style={{ color: '#0A2342' }}
              >
                Continue Shopping
              </Link>

              {/* Trust badges */}
              <div className="mt-5 pt-5 border-t border-gray-100 grid grid-cols-3 gap-3 text-center">
                <div>
                  <p className="text-lg">🔒</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">Secure Payment</p>
                </div>
                <div>
                  <p className="text-lg">🚚</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">Fast Shipping</p>
                </div>
                <div>
                  <p className="text-lg">↩️</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">Easy Returns</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

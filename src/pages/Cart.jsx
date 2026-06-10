import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import CartItem from '../components/CartItem';

const TAX_RATE = 0.11;

export default function Cart() {
  const { items, subtotal, clearCart } = useCart();
  const [checkedOut, setCheckedOut] = useState(false);

  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  const formatPrice = (price) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);

  const handleCheckout = () => {
    setCheckedOut(true);
    clearCart();
  };

  if (checkedOut) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center max-w-md w-full shadow-sm">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#e8f5e9' }}>
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: '#0A2342' }}>Order Placed!</h2>
          <p className="text-gray-500 mb-6">Thank you for your purchase. Your books will be shipped soon.</p>
          <Link
            to="/"
            className="inline-block text-white font-semibold px-8 py-3 rounded-xl no-underline transition-opacity hover:opacity-90"
            style={{ backgroundColor: '#0A2342' }}
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-6xl mb-4">🛒</p>
          <h2 className="text-2xl font-bold mb-2" style={{ color: '#0A2342' }}>Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Looks like you haven't added any books yet.</p>
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
    <div className="min-h-screen bg-gray-50">
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
            <div className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-24">
              <h2 className="font-bold text-lg mb-5" style={{ color: '#0A2342' }}>Order Summary</h2>

              <div className="space-y-3 mb-5">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Tax (11%)</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between font-bold text-base" style={{ color: '#0A2342' }}>
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full text-white font-semibold py-3.5 rounded-xl transition-opacity hover:opacity-90 mb-3"
                style={{ backgroundColor: '#0A2342' }}
              >
                Checkout →
              </button>
              <Link
                to="/"
                className="block text-center text-sm font-medium no-underline transition-colors py-2 rounded-xl border border-gray-200 hover:bg-gray-50"
                style={{ color: '#0A2342' }}
              >
                Continue Shopping
              </Link>

              {/* Trust badges */}
              <div className="mt-5 pt-5 border-t border-gray-100 grid grid-cols-3 gap-3 text-center">
                <div>
                  <p className="text-lg">🔒</p>
                  <p className="text-xs text-gray-400">Secure Payment</p>
                </div>
                <div>
                  <p className="text-lg">🚚</p>
                  <p className="text-xs text-gray-400">Free Shipping</p>
                </div>
                <div>
                  <p className="text-lg">↩️</p>
                  <p className="text-xs text-gray-400">Easy Returns</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';
import { useToast } from '../context/ToastContext';

const TAX_RATE = 0.11;
const SHIPPING_OPTIONS = [
  { id: 'regular', label: 'Regular Shipping', duration: '5–7 business days', price: 0 },
  { id: 'express', label: 'Express Shipping', duration: '2–3 business days', price: 35000 },
  { id: 'same-day', label: 'Same-Day Delivery', duration: 'Today (order before 12:00)', price: 65000 },
];
const PAYMENT_METHODS = [
  { id: 'gopay', label: 'GoPay', icon: '💚' },
  { id: 'shopeepay', label: 'ShopeePay', icon: '🧡' },
];
const PAYMENT_NUMBER = '085349851329';

const STEPS = ['Shipping', 'Payment', 'Confirmation'];

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const { placeOrder } = useOrders();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [shipping, setShipping] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    province: '',
    postalCode: '',
    shippingOption: 'regular',
  });
  const [shippingErrors, setShippingErrors] = useState({});
  const [payment, setPayment] = useState({ method: '' });
  const [paymentErrors, setPaymentErrors] = useState({});
  const [placing, setPlacing] = useState(false);

  const selectedShipping = SHIPPING_OPTIONS.find(o => o.id === shipping.shippingOption) || SHIPPING_OPTIONS[0];
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax + selectedShipping.price;

  const formatPrice = (p) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(p);

  // ── Validation ──────────────────────────────────────────────────────────────
  const validateShipping = () => {
    const e = {};
    if (!shipping.fullName.trim()) e.fullName = 'Full name is required.';
    if (!shipping.email.trim()) e.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shipping.email)) e.email = 'Enter a valid email.';
    if (!shipping.phone.trim()) e.phone = 'Phone number is required.';
    else if (!/^\d{8,15}$/.test(shipping.phone.replace(/[\s-]/g, ''))) e.phone = 'Enter a valid phone number.';
    if (!shipping.address.trim()) e.address = 'Address is required.';
    if (!shipping.city.trim()) e.city = 'City is required.';
    if (!shipping.province.trim()) e.province = 'Province is required.';
    if (!shipping.postalCode.trim()) e.postalCode = 'Postal code is required.';
    else if (!/^\d{5}$/.test(shipping.postalCode)) e.postalCode = 'Enter a valid 5-digit postal code.';
    return e;
  };

  const validatePayment = () => {
    const e = {};
    if (!payment.method) e.method = 'Please select a payment method.';
    return e;
  };

  const handleShippingNext = (e) => {
    e.preventDefault();
    const errs = validateShipping();
    setShippingErrors(errs);
    if (!Object.keys(errs).length) setStep(1);
  };

  const handlePaymentNext = (e) => {
    e.preventDefault();
    const errs = validatePayment();
    setPaymentErrors(errs);
    if (!Object.keys(errs).length) setStep(2);
  };

  const handlePlaceOrder = () => {
    setPlacing(true);
    setTimeout(() => {
      placeOrder({
        userId: user?.id || 'guest',
        userName: user?.name || shipping.fullName,
        items,
        subtotal,
        tax,
        total,
        shipping: { ...shipping, option: selectedShipping },
        payment: { method: payment.method },
      });
      clearCart();
      addToast('Order placed successfully! 🎉', 'success', 4000);
      navigate('/orders');
    }, 800);
  };

  if (items.length === 0 && step < 2) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-6xl mb-4">🛒</p>
          <h2 className="text-2xl font-bold mb-2" style={{ color: '#0A2342' }}>Your cart is empty</h2>
          <Link to="/" className="inline-block text-white font-semibold px-8 py-3 rounded-xl no-underline hover:opacity-90 mt-4" style={{ backgroundColor: '#0A2342' }}>
            Browse Catalog
          </Link>
        </div>
      </div>
    );
  }

  const FieldErr = ({ msg }) => msg ? <p className="text-red-500 text-xs mt-1">{msg}</p> : null;
  const inputCls = (hasErr) =>
    `w-full px-4 py-3 rounded-xl border text-sm focus:outline-none transition-colors ${hasErr ? 'border-red-400' : 'border-gray-200 focus:border-blue-300'}`;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div style={{ backgroundColor: '#0A2342' }} className="py-6 px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-bold text-white">Checkout</h1>
          {/* Step indicator */}
          <div className="flex items-center gap-0 mt-4">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center">
                <div className="flex items-center gap-2">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors"
                    style={{
                      backgroundColor: i <= step ? 'white' : 'rgba(255,255,255,0.2)',
                      color: i <= step ? '#0A2342' : 'rgba(255,255,255,0.5)',
                    }}
                  >
                    {i < step ? '✓' : i + 1}
                  </div>
                  <span className={`text-sm font-medium ${i <= step ? 'text-white' : 'text-white/40'}`}>{s}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="mx-3 h-px w-10 md:w-16" style={{ backgroundColor: i < step ? 'white' : 'rgba(255,255,255,0.2)' }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left panel: steps */}
          <div className="flex-1">

            {/* ── Step 0: Shipping ── */}
            {step === 0 && (
              <form onSubmit={handleShippingNext} noValidate className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-7 space-y-5">
                <h2 className="text-lg font-bold" style={{ color: '#0A2342' }}>Shipping Address</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name *</label>
                    <input className={inputCls(shippingErrors.fullName)} value={shipping.fullName}
                      onChange={e => setShipping(p => ({ ...p, fullName: e.target.value }))} placeholder="John Doe" />
                    <FieldErr msg={shippingErrors.fullName} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email *</label>
                    <input className={inputCls(shippingErrors.email)} value={shipping.email} type="email"
                      onChange={e => setShipping(p => ({ ...p, email: e.target.value }))} placeholder="you@example.com" />
                    <FieldErr msg={shippingErrors.email} />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Phone Number *</label>
                  <input className={inputCls(shippingErrors.phone)} value={shipping.phone} type="tel"
                    onChange={e => setShipping(p => ({ ...p, phone: e.target.value }))} placeholder="e.g. 08123456789" />
                  <FieldErr msg={shippingErrors.phone} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Street Address *</label>
                  <input className={inputCls(shippingErrors.address)} value={shipping.address}
                    onChange={e => setShipping(p => ({ ...p, address: e.target.value }))} placeholder="Jl. Example No. 1" />
                  <FieldErr msg={shippingErrors.address} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">City *</label>
                    <input className={inputCls(shippingErrors.city)} value={shipping.city}
                      onChange={e => setShipping(p => ({ ...p, city: e.target.value }))} placeholder="Jakarta" />
                    <FieldErr msg={shippingErrors.city} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Province *</label>
                    <input className={inputCls(shippingErrors.province)} value={shipping.province}
                      onChange={e => setShipping(p => ({ ...p, province: e.target.value }))} placeholder="DKI Jakarta" />
                    <FieldErr msg={shippingErrors.province} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Postal Code *</label>
                    <input className={inputCls(shippingErrors.postalCode)} value={shipping.postalCode}
                      onChange={e => setShipping(p => ({ ...p, postalCode: e.target.value }))} placeholder="10110" maxLength={5} />
                    <FieldErr msg={shippingErrors.postalCode} />
                  </div>
                </div>

                {/* Shipping option */}
                <div>
                  <h3 className="font-semibold text-sm mb-3" style={{ color: '#0A2342' }}>Shipping Method</h3>
                  <div className="space-y-3">
                    {SHIPPING_OPTIONS.map(opt => (
                      <label key={opt.id} className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-colors ${shipping.shippingOption === opt.id ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30' : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="shipping"
                            value={opt.id}
                            checked={shipping.shippingOption === opt.id}
                            onChange={() => setShipping(p => ({ ...p, shippingOption: opt.id }))}
                            style={{ accentColor: '#0A2342' }}
                          />
                          <div>
                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{opt.label}</p>
                            <p className="text-xs text-gray-400 dark:text-gray-500">{opt.duration}</p>
                          </div>
                        </div>
                        <span className="text-sm font-semibold" style={{ color: '#0A2342' }}>
                          {opt.price === 0 ? <span className="text-green-600">Free</span> : formatPrice(opt.price)}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <button type="submit" className="w-full text-white font-semibold py-3.5 rounded-xl hover:opacity-90 transition-opacity" style={{ backgroundColor: '#0A2342' }}>
                  Continue to Payment →
                </button>
              </form>
            )}

            {/* ── Step 1: Payment ── */}
            {step === 1 && (
              <form onSubmit={handlePaymentNext} noValidate className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-7 space-y-5">
                <h2 className="text-lg font-bold" style={{ color: '#0A2342' }}>Payment Method</h2>

                {paymentErrors.method && (
                  <p className="text-red-500 text-sm bg-red-50 border border-red-200 px-4 py-2 rounded-lg">{paymentErrors.method}</p>
                )}

                <div className="space-y-3">
                  {PAYMENT_METHODS.map(m => (
                    <label key={m.id} className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${payment.method === m.id ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30' : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                      <input
                        type="radio"
                        name="payment"
                        value={m.id}
                        checked={payment.method === m.id}
                        onChange={() => setPayment(p => ({ ...p, method: m.id }))}
                        style={{ accentColor: '#0A2342' }}
                      />
                      <span className="text-lg">{m.icon}</span>
                      <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{m.label}</span>
                    </label>
                  ))}
                </div>

                {/* Payment instructions */}
                {payment.method && (
                  <div className="border-t border-gray-100 dark:border-gray-700 pt-4">
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 text-sm text-gray-600 dark:text-gray-400">
                      Send your payment via <strong style={{ color: '#0A2342' }}>{PAYMENT_METHODS.find(m => m.id === payment.method)?.label}</strong> to the number below, then continue to review your order.
                      <p className="text-lg font-bold mt-2" style={{ color: '#0A2342' }}>{PAYMENT_NUMBER}</p>
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setStep(0)} className="flex-1 font-semibold py-3.5 rounded-xl border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    ← Back
                  </button>
                  <button type="submit" className="flex-1 text-white font-semibold py-3.5 rounded-xl hover:opacity-90 transition-opacity" style={{ backgroundColor: '#0A2342' }}>
                    Review Order →
                  </button>
                </div>
              </form>
            )}

            {/* ── Step 2: Confirmation ── */}
            {step === 2 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-7 space-y-6">
                <h2 className="text-lg font-bold" style={{ color: '#0A2342' }}>Order Confirmation</h2>

                {/* Shipping summary */}
                <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 space-y-1 text-sm">
                  <p className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Shipping to:</p>
                  <p className="text-gray-600 dark:text-gray-400">{shipping.fullName}</p>
                  <p className="text-gray-600 dark:text-gray-400">{shipping.address}</p>
                  <p className="text-gray-600 dark:text-gray-400">{shipping.city}, {shipping.province} {shipping.postalCode}</p>
                  <p className="text-gray-600 dark:text-gray-400">{shipping.phone} · {shipping.email}</p>
                  <p className="text-gray-500 text-xs mt-2">📦 {selectedShipping.label} — {selectedShipping.duration}</p>
                </div>

                {/* Payment summary */}
                <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 text-sm">
                  <p className="font-semibold text-gray-700 dark:text-gray-300 mb-1">Payment via:</p>
                  <p className="text-gray-600 dark:text-gray-400">{PAYMENT_METHODS.find(m => m.id === payment.method)?.label}</p>
                </div>

                {/* Items */}
                <div>
                  <p className="font-semibold text-gray-700 dark:text-gray-300 mb-3 text-sm">Items ({items.reduce((s, i) => s + i.quantity, 0)})</p>
                  <div className="space-y-3">
                    {items.map(item => (
                      <div key={item.id} className="flex items-center gap-3">
                        <img
                          src={item.coverUrl}
                          alt={item.title}
                          className="w-10 h-12 object-cover rounded flex-shrink-0"
                          onError={e => { e.target.src = 'https://via.placeholder.com/40x50/0A2342/ffffff?text=B'; }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800 dark:text-gray-200 line-clamp-1">{item.title}</p>
                          <p className="text-xs text-gray-400 dark:text-gray-500">x{item.quantity}</p>
                        </div>
                        <p className="text-sm font-semibold flex-shrink-0" style={{ color: '#0A2342' }}>
                          {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(item.price * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button type="button" onClick={() => setStep(1)} className="flex-1 font-semibold py-3.5 rounded-xl border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    ← Back
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={placing}
                    className="flex-1 text-white font-semibold py-3.5 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-60"
                    style={{ backgroundColor: '#0A2342' }}
                  >
                    {placing ? 'Placing Order...' : '✓ Place Order'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right panel: order summary */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 sticky top-24">
              <h2 className="font-bold text-base mb-4" style={{ color: '#0A2342' }}>Order Summary</h2>
              <div className="space-y-3 max-h-52 overflow-y-auto mb-4">
                {items.map(item => (
                  <div key={item.id} className="flex items-center gap-2 text-sm">
                    <img src={item.coverUrl} alt={item.title} className="w-8 h-10 object-cover rounded flex-shrink-0"
                      onError={e => { e.target.src = 'https://via.placeholder.com/40x50/0A2342/ffffff?text=B'; }} />
                    <span className="flex-1 text-gray-600 line-clamp-2 text-xs">{item.title} ×{item.quantity}</span>
                    <span className="font-medium text-xs flex-shrink-0" style={{ color: '#0A2342' }}>
                      {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Subtotal</span><span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Tax (11%)</span><span>{formatPrice(tax)}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Shipping</span>
                  <span>{selectedShipping.price === 0 ? <span className="text-green-600">Free</span> : formatPrice(selectedShipping.price)}</span>
                </div>
                <div className="flex justify-between font-bold text-base border-t border-gray-100 pt-2" style={{ color: '#0A2342' }}>
                  <span>Total</span><span>{formatPrice(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

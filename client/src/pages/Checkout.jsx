import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useCart } from '../context/CartContext';
import axios from 'axios';
import toast from 'react-hot-toast';

import { CreditCard, Truck, ShieldCheck, ChevronLeft, Loader2 } from 'lucide-react';

const Checkout = () => {
  const { refreshCart } = useCart();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    address: '',
    city: '',
    pincode: ''
  });
  const navigate = useNavigate();
  const razorpayLoaded = useRef(false);

  const userInfo = localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null;

  const fetchCart = async () => {
    if (!userInfo) {
      navigate('/login');
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const { data } = await axios.get(`${apiUrl}/api/users/cart`, config);
      const validItems = data.filter(item => item.product !== null);
      setCartItems(validItems);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const calculateTotal = () => {
    return cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  };

  const handleInputChange = (e) => {
    setShippingAddress({
      ...shippingAddress,
      [e.target.name]: e.target.value
    });
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve();
      document.body.appendChild(script);
    });
  };

  const handleRazorpayPayment = async (razorpayOrder) => {
    await loadRazorpayScript();

    return new Promise((resolve, reject) => {
      const razorpayKeyId = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_your_key_id';
      if (!razorpayKeyId) {
        reject(new Error('Missing Razorpay public key. Add VITE_RAZORPAY_KEY_ID to client/.env.local.'));
        return;
      }

      const options = {
        key: razorpayKeyId,
        amount: razorpayOrder.amount,
        currency: 'INR',
        name: 'ESP32 Shop',
        description: 'Order Payment',
        order_id: razorpayOrder.id,
        handler: async (response) => {
          try {
            const verifyConfig = {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`,
              },
            };
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            await axios.post(`${apiUrl}/api/orders/verify-payment`, {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature
            }, verifyConfig);
            resolve(response);
          } catch (error) {
            reject(error);
          }
        },
        theme: {
          color: '#2563eb'
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
      rzp.on('payment.failed', () => {
        reject(new Error('Payment failed'));
      });
    });
  };

  const handlePlaceOrder = async () => {
    if (!shippingAddress.fullName || !shippingAddress.address || !shippingAddress.city || !shippingAddress.pincode) {
      toast.error('Please fill in all shipping details');
      return;
    }

    try {
      setPlacingOrder(true);
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

      const orderItems = cartItems.map(item => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price
      }));

      let razorpayOrder = null;
      let razorpayPaymentId = null;

      if (paymentMethod === 'cashless') {
        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo.token}`,
          },
        };

        razorpayOrder = await axios.post(`${apiUrl}/api/orders/create-razorpay-order`, {
          amount: calculateTotal()
        }, config);

        const paymentResponse = await handleRazorpayPayment(razorpayOrder.data);
        razorpayPaymentId = paymentResponse.razorpay_payment_id;
      }

      const orderConfig = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const orderData = {
        orderItems,
        shippingAddress,
        paymentMethod,
        razorpayOrderId: razorpayOrder?.data?.id,
        razorpayPaymentId,
        totalAmount: calculateTotal()
      };

      await axios.post(`${apiUrl}/api/orders`, orderData, orderConfig);

      await axios.delete(`${apiUrl}/api/users/cart/clear`, {
        headers: { Authorization: `Bearer ${userInfo.token}` }
      });

      refreshCart();
      toast.success('Order placed successfully!');
      setOrderSuccess(true);
    } catch (error) {
      console.error('Order error:', error);
      if (error.message !== 'Payment failed') {
        toast.error('Failed to place order');
      }
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-40 gap-4">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
          <p className="text-gray-500 font-medium italic">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <Link to="/" className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-blue-600 transition-colors mb-8">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Continue Shopping
          </Link>
          <div className="bg-white rounded-[32px] overflow-hidden shadow-2xl shadow-gray-200/50 border border-gray-100 p-12 text-center">
            <p className="text-xl text-gray-500 mb-6">Your cart is empty</p>
            <Link to="/" className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 transition-all">
              Start Shopping
            </Link>
          </div>
        </main>
      </div>
    );
  }

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <Navbar />
        <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 text-center">
          <div className="bg-white rounded-[32px] overflow-hidden shadow-2xl shadow-green-200/50 border border-green-100 p-12 flex flex-col items-center">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <ShieldCheck className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">Order Placed Successfully!</h1>
            <p className="text-gray-500 text-lg mb-8 max-w-md">
              Thank you for shopping with us. Your order has been placed and is being processed. 
            </p>
            <div className="flex gap-4">
              <Link 
                to="/dashboard" 
                className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 transition-all shadow-xl shadow-blue-200"
              >
                View Orders
              </Link>
              <Link 
                to="/" 
                className="px-8 py-4 bg-gray-100 text-gray-700 rounded-2xl font-black hover:bg-gray-200 transition-all"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Link to="/cart" className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-blue-600 transition-colors mb-8">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Cart
        </Link>

        <div className="bg-white rounded-[32px] overflow-hidden shadow-2xl shadow-gray-200/50 border border-gray-100 p-8 md:p-12">
          <h1 className="text-3xl font-black text-gray-900 mb-8 tracking-tight">Checkout</h1>

          <div className="space-y-8">
            {/* Shipping Address */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Truck className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-bold text-gray-900">Shipping Address</h2>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  value={shippingAddress.fullName}
                  onChange={handleInputChange}
                  className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none"
                />
                <input
                  type="text"
                  name="address"
                  placeholder="Address Line 1"
                  value={shippingAddress.address}
                  onChange={handleInputChange}
                  className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={shippingAddress.city}
                    onChange={handleInputChange}
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none"
                  />
                  <input
                    type="text"
                    name="pincode"
                    placeholder="Pincode"
                    value={shippingAddress.pincode}
                    onChange={handleInputChange}
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none"
                  />
                </div>
              </div>
            </section>

            {/* Payment Method */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-bold text-gray-900">Payment Method</h2>
              </div>
              <button
                onClick={() => setPaymentMethod('cod')}
                className={`w-full p-6 border-2 rounded-2xl flex items-center justify-between transition-all ${paymentMethod === 'cod' ? 'border-blue-600 bg-blue-50' : 'border-gray-100 bg-gray-50 hover:border-gray-200'}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full border-4 ${paymentMethod === 'cod' ? 'border-blue-600 bg-white' : 'border-gray-300 bg-white'}`}></div>
                  <span className={`font-bold ${paymentMethod === 'cod' ? 'text-blue-900' : 'text-gray-700'}`}>Cash on Delivery</span>
                </div>
                <Truck className={paymentMethod === 'cod' ? 'text-blue-600' : 'text-gray-400'} />
              </button>
              <button
                onClick={() => setPaymentMethod('cashless')}
                className={`w-full p-6 border-2 rounded-2xl flex items-center justify-between mt-2 transition-all ${paymentMethod === 'cashless' ? 'border-blue-600 bg-blue-50' : 'border-gray-100 bg-gray-50 hover:border-gray-200'}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full border-4 ${paymentMethod === 'cashless' ? 'border-blue-600 bg-white' : 'border-gray-300 bg-white'}`}></div>
                  <span className={`font-bold ${paymentMethod === 'cashless' ? 'text-blue-900' : 'text-gray-700'}`}>Cashless / Online Payment</span>
                </div>
                <CreditCard className={paymentMethod === 'cashless' ? 'text-blue-600' : 'text-gray-400'} />
              </button>
            </section>

            {/* Order Summary */}
            <div className="pt-8 border-t border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>
              <div className="space-y-3 mb-6">
                {cartItems.map((item) => (
                  <div key={item.product._id} className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <img src={item.product.image} alt={item.product.name} className="w-12 h-12 object-cover rounded-lg" />
                      <div>
                        <p className="text-sm font-bold text-gray-900">{item.product.name}</p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="font-bold text-gray-900">₹{item.product.price * item.quantity}</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-green-600 font-bold">
                    <ShieldCheck className="w-5 h-5" />
                    Secure Transaction
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500 font-medium">Total Amount</p>
                    <p className="text-3xl font-black text-gray-900">₹{calculateTotal()}</p>
                  </div>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={placingOrder}
                className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {placingOrder ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                {placingOrder ? 'Processing...' : 'PLACE ORDER'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Checkout;
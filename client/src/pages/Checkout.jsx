import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useCart } from '../context/CartContext';
import axios from 'axios';
import { CreditCard, Truck, ShieldCheck, ChevronLeft, Loader2 } from 'lucide-react';

const Checkout = () => {
  const { refreshCart } = useCart();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const navigate = useNavigate();

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
      const { data } = await axios.get('/api/users/cart', config);
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
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Navbar />
      
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Link to="/" className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-blue-600 transition-colors mb-8">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Continue Shopping
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
                <input type="text" placeholder="Full Name" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none" />
                <input type="text" placeholder="Address Line 1" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none" />
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="City" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none" />
                  <input type="text" placeholder="Pincode" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none" />
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
              
              <button className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 active:scale-[0.98]">
                PLACE ORDER
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Checkout;

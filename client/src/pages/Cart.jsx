import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { useCart } from '../context/CartContext';
import { ShoppingCart, Trash2, Plus, Minus, ChevronLeft, Loader2, CreditCard } from 'lucide-react';
import toast from 'react-hot-toast';

const Cart = () => {
  const { refreshCart } = useCart();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const userInfo = localStorage.getItem('userInfo') 
    ? JSON.parse(localStorage.getItem('userInfo')) 
    : null;

  const fetchCart = async (showLoading = true) => {
    if (!userInfo) {
      navigate('/login');
      return;
    }

    try {
      if (showLoading) setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const { data } = await axios.get(`${apiUrl}/api/users/cart`, config);
      console.log('Cart data fetched:', data);
      const validItems = data.filter(item => item.product !== null);
      setCartItems(validItems);
    } catch (error) {
      console.error('Error fetching cart:', error);
      toast.error('Failed to load cart');
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  const handleUpdateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      await axios.put(`${apiUrl}/api/users/cart`, { productId, quantity }, config);
      fetchCart(false);
      refreshCart();
    } catch (error) {
      toast.error('Failed to update quantity');
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      await axios.delete(`${apiUrl}/api/users/cart/${productId}`, config);
      fetchCart(false);
      refreshCart();
      toast.success('Item removed');
    } catch (error) {
      toast.error('Failed to remove item');
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
          <p className="text-gray-500 font-medium italic">Loading your cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Link to="/" className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-blue-600 transition-colors mb-8">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Continue Shopping
        </Link>

        <h1 className="text-3xl font-black text-gray-900 mb-8 tracking-tight flex items-center gap-3">
          <ShoppingCart className="w-8 h-8 text-blue-600" />
          Your Shopping Cart
        </h1>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-[32px] p-12 text-center border border-dashed border-gray-200">
            <p className="text-xl text-gray-500 mb-6">Your cart is as empty as a fresh silicon wafer.</p>
            <Link to="/" className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 transition-all shadow-xl shadow-blue-200">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div key={item.product._id} className="bg-white p-6 rounded-3xl border border-gray-100 flex items-center gap-6 hover:shadow-xl hover:shadow-gray-100 transition-all">
                  <img 
                    src={item.product.image} 
                    alt={item.product.name}
                    className="w-24 h-24 object-cover rounded-2xl bg-gray-50"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900">{item.product.name}</h3>
                    <p className="text-sm text-gray-500 mb-2">{item.product.category || 'ESP32 Module'}</p>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center bg-gray-50 rounded-xl border border-gray-100 p-1">
                        <button 
                          onClick={() => handleUpdateQuantity(item.product._id, item.quantity - 1)}
                          className="p-1 hover:text-blue-600 transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-4 font-bold text-sm">{item.quantity}</span>
                        <button 
                          onClick={() => handleUpdateQuantity(item.product._id, item.quantity + 1)}
                          className="p-1 hover:text-blue-600 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <button 
                        onClick={() => handleRemoveItem(item.product._id)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-black text-gray-900">₹{item.product.price * item.quantity}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">₹{item.product.price} / unit</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary Card */}
            <div className="lg:col-span-1">
              <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-2xl shadow-gray-200/50 sticky top-24">
                <h2 className="text-xl font-black text-gray-900 mb-6">Order Summary</h2>
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-gray-500 font-medium">
                    <span>Subtotal</span>
                    <span>₹{calculateTotal()}</span>
                  </div>
                  <div className="flex justify-between text-gray-500 font-medium">
                    <span>Shipping</span>
                    <span className="text-green-600 font-bold uppercase text-xs">Free</span>
                  </div>
                  <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">Total</span>
                    <span className="text-3xl font-black text-blue-600">₹{calculateTotal()}</span>
                  </div>
                </div>
                
                <Link 
                  to="/checkout"
                  className="w-full flex items-center justify-center gap-3 py-5 bg-gray-900 text-white rounded-2xl font-black text-lg hover:bg-gray-800 transition-all shadow-xl shadow-gray-200 active:scale-[0.98]"
                >
                  <CreditCard className="w-6 h-6" />
                  CHECKOUT
                </Link>
                
                <p className="mt-6 text-[10px] text-gray-400 text-center font-medium leading-relaxed">
                  Shipping and taxes calculated at checkout. <br/>
                  Secure payment powered by ESP32 Shop.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Cart;

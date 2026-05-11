import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import { useCart } from '../context/CartContext';
import { ShoppingCart, Bolt, ChevronLeft, Loader2, CheckCircle2, ShieldCheck, Truck } from 'lucide-react';

const ProductDetail = () => {
  const { refreshCart } = useCart();
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);

  const userInfo = localStorage.getItem('userInfo') 
    ? JSON.parse(localStorage.getItem('userInfo')) 
    : null;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const apiUrl = import.meta.env.VITE_API_URL || '';
        const { data } = await axios.get(`${apiUrl}/api/products/${id}`);
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!userInfo) {
      navigate('/login');
      return;
    }

    try {
      setAddingToCart(true);
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const apiUrl = import.meta.env.VITE_API_URL || '';
      await axios.post(`${apiUrl}/api/users/cart`, { productId: product._id, quantity: 1 }, config);
      toast.success('Added to your cart!');
      refreshCart();
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (!userInfo) {
      navigate('/login');
      return;
    }

    try {
      setAddingToCart(true);
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const apiUrl = import.meta.env.VITE_API_URL || '';
      await axios.post(`${apiUrl}/api/users/cart`, { productId: product._id, quantity: 1 }, config);
      refreshCart();
      navigate('/checkout');
    } catch (error) {
      console.error('Error buying now:', error);
      toast.error('Failed to process order');
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-40 gap-4">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
          <p className="text-gray-500 font-medium italic">Fetching chip details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <h2 className="text-2xl font-bold text-gray-900">Product not found</h2>
          <Link to="/" className="mt-4 text-blue-600 font-bold inline-block">Back to Shop</Link>
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
          Back to products
        </Link>

        <div className="bg-white rounded-[32px] overflow-hidden shadow-2xl shadow-gray-200/50 border border-gray-100">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Image Section */}
            <div className="p-8 lg:p-12 bg-gray-50 flex items-center justify-center border-b lg:border-b-0 lg:border-r border-gray-100">
              <div className="relative group">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="rounded-2xl shadow-2xl group-hover:scale-105 transition-transform duration-500 max-w-full h-auto"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-4 py-2 bg-blue-600 text-white text-xs font-black rounded-full shadow-lg">
                    {product.category || 'ESP32'}
                  </span>
                </div>
              </div>
            </div>

            {/* Info Section */}
            <div className="p-8 lg:p-12">
              <div className="flex items-center gap-2 text-green-600 font-bold text-xs uppercase tracking-widest mb-4">
                <CheckCircle2 className="w-4 h-4" />
                In Stock & Ready to Ship
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6 leading-tight">
                {product.name}
              </h1>
              
              <div className="flex items-baseline gap-4 mb-8">
                <span className="text-4xl font-black text-blue-600">₹{product.price}</span>
                <span className="text-gray-400 line-through text-lg font-medium">₹{Math.round(product.price * 1.2)}</span>
                <span className="text-green-600 font-bold text-sm bg-green-50 px-2 py-1 rounded-lg">20% OFF</span>
              </div>

              <p className="text-gray-600 text-lg leading-relaxed mb-10 border-l-4 border-blue-100 pl-6 italic">
                {product.description}
              </p>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-4 mb-10">
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <Truck className="w-6 h-6 text-blue-600" />
                  <div>
                    <p className="text-xs font-bold text-gray-900">Fast Delivery</p>
                    <p className="text-[10px] text-gray-500 font-medium">Ships in 24 hours</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <ShieldCheck className="w-6 h-6 text-blue-600" />
                  <div>
                    <p className="text-xs font-bold text-gray-900">Secure Chip</p>
                    <p className="text-[10px] text-gray-500 font-medium">Authentic Hardware</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={handleAddToCart}
                  disabled={addingToCart}
                  className="flex-1 flex items-center justify-center gap-3 py-4 bg-gray-900 text-white rounded-2xl font-black hover:bg-gray-800 transition-all active:scale-95 shadow-xl shadow-gray-200 disabled:opacity-50"
                >
                  {addingToCart ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShoppingCart className="w-5 h-5" />}
                  ADD TO CART
                </button>
                <button 
                  onClick={handleBuyNow}
                  className="flex-1 flex items-center justify-center gap-3 py-4 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 transition-all active:scale-95 shadow-xl shadow-blue-200"
                >
                  <Bolt className="w-5 h-5 fill-current" />
                  BUY NOW
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetail;

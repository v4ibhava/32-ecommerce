import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Package, ChevronLeft, Loader2, ChevronRight } from 'lucide-react';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const userInfo = localStorage.getItem('userInfo') 
    ? JSON.parse(localStorage.getItem('userInfo')) 
    : null;

  const fetchOrders = async () => {
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
      const { data } = await axios.get('/api/orders', config);
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      case 'confirmed': return 'text-blue-600 bg-blue-50';
      case 'shipped': return 'text-purple-600 bg-purple-50';
      case 'delivered': return 'text-green-600 bg-green-50';
      case 'cancelled': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-40 gap-4">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
          <p className="text-gray-500 font-medium italic">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Link to="/profile" className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-blue-600 transition-colors mb-8">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Profile
        </Link>

        <h1 className="text-3xl font-black text-gray-900 mb-8 tracking-tight flex items-center gap-3">
          <Package className="w-8 h-8 text-blue-600" />
          My Orders
        </h1>
        
        {orders.length === 0 ? (
          <div className="bg-white rounded-[32px] p-12 text-center border border-dashed border-gray-200">
            <p className="text-xl text-gray-500 mb-6">No orders yet</p>
            <Link to="/" className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 transition-all shadow-xl shadow-blue-200">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-xl shadow-gray-100/50">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-lg font-black text-gray-900">Order #{order._id.slice(-8)}</p>
                    <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString('en-IN', { 
                      day: 'numeric', 
                      month: 'long', 
                      year: 'numeric'
                    })}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-4 py-2 rounded-full text-sm font-bold ${getStatusColor(order.status)}`}>
                      {order.status.toUpperCase()}
                    </span>
                    {order.paymentMethod === 'cashless' && order.paymentStatus === 'paid' && (
                      <p className="text-xs text-green-600 font-bold mt-1">PAID</p>
                    )}
                  </div>
                </div>

                <div className="border-t border-b border-gray-100 py-4 my-4">
                  <div className="flex items-center gap-4 overflow-x-auto">
                    {order.orderItems.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 flex-shrink-0">
                        <img 
                          src={item.product?.image} 
                          alt={item.product?.name} 
                          className="w-16 h-16 object-cover rounded-xl" 
                        />
                        <div>
                          <p className="font-bold text-gray-900 text-sm">{item.product?.name}</p>
                          <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                          <p className="text-sm font-black text-gray-900">₹{item.price * item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Shipping to</p>
                    <p className="text-sm text-gray-900">{order.shippingAddress.fullName}</p>
                    <p className="text-sm text-gray-500">{order.shippingAddress.address}, {order.shippingAddress.city} - {order.shippingAddress.pincode}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Total</p>
                    <p className="text-2xl font-black text-blue-600">₹{order.totalAmount}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Orders;
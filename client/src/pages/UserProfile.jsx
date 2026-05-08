import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import axios from 'axios';
import toast from 'react-hot-toast';
import { User, Package, Settings, LogOut, ChevronRight, Loader2, MapPin, CreditCard } from 'lucide-react';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const userInfo = localStorage.getItem('userInfo') 
    ? JSON.parse(localStorage.getItem('userInfo')) 
    : null;

  const fetchData = async () => {
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
      
      const [userRes, ordersRes] = await Promise.all([
        axios.get('/api/users/profile', config),
        axios.get('/api/orders', config)
      ]);
      
      setUser(userRes.data);
      setOrders(ordersRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    toast.success('Logged out successfully');
    navigate('/login');
  };

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
          <p className="text-gray-500 font-medium italic">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <h1 className="text-3xl font-black text-gray-900 mb-8">My Account</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-[32px] p-6 border border-gray-100 shadow-xl shadow-gray-100/50">
              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <User className="w-10 h-10 text-blue-600" />
                </div>
                <h2 className="text-xl font-black text-gray-900">{user?.name}</h2>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
              
              <div className="space-y-2">
                <Link to="/profile" className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 text-blue-900 font-bold">
                  <User className="w-5 h-5" />
                  My Profile
                </Link>
                <Link to="/orders" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 text-gray-700 font-medium transition-colors">
                  <Package className="w-5 h-5" />
                  My Orders
                </Link>
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 text-red-600 font-medium transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {/* User Info */}
            <div className="bg-white rounded-[32px] p-6 border border-gray-100 shadow-xl shadow-gray-100/50">
              <div className="flex items-center gap-2 mb-6">
                <User className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-black text-gray-900">Profile Information</h2>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Name</p>
                  <p className="font-bold text-gray-900">{user?.name}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Email</p>
                  <p className="font-bold text-gray-900">{user?.email}</p>
                </div>
              </div>
            </div>

            {/* Order History */}
            <div className="bg-white rounded-[32px] p-6 border border-gray-100 shadow-xl shadow-gray-100/50">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-black text-gray-900">Order History</h2>
                </div>
                {orders.length > 0 && (
                  <Link to="/orders" className="text-sm text-blue-600 font-bold hover:underline">
                    View All
                  </Link>
                )}
              </div>
              
              {orders.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No orders yet</p>
              ) : (
                <div className="space-y-4">
                  {orders.slice(0, 3).map((order) => (
                    <div key={order._id} className="p-4 border border-gray-100 rounded-xl">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-bold text-gray-900">Order #{order._id.slice(-8)}</p>
                          <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                          {order.razorpayPaymentId && (
                            <p className="text-xs text-gray-400 mt-1 font-mono flex items-center gap-1">
                              <span className="font-semibold">Txn:</span> {order.razorpayPaymentId}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            order.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 
                            order.paymentStatus === 'failed' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            Payment: {order.paymentStatus.toUpperCase()}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}>
                            Delivery: {order.status.toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          {order.orderItems.slice(0, 2).map((item, idx) => (
                            <img 
                              key={idx} 
                              src={item.product?.image} 
                              alt={item.product?.name} 
                              className="w-10 h-10 object-cover rounded-lg" 
                            />
                          ))}
                          {order.orderItems.length > 2 && (
                            <span className="text-xs text-gray-500">+{order.orderItems.length - 2} more</span>
                          )}
                        </div>
                        <p className="font-black text-gray-900">₹{order.totalAmount}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserProfile;
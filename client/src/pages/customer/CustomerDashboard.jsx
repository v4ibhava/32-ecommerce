import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  User, Package, ShoppingCart, CreditCard, Loader2,
  ChevronRight, CheckCircle2, Clock, XCircle, AlertCircle,
  TrendingUp, IndianRupee
} from 'lucide-react';

const CustomerDashboard = () => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || 'null');

  useEffect(() => {
    if (!userInfo) { navigate('/login'); return; }
    if (userInfo.role === 'admin') { navigate('/admin'); return; }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const [userRes, ordersRes] = await Promise.all([
        axios.get('/api/users/profile', config),
        axios.get('/api/orders', config)
      ]);
      setUser(userRes.data);
      setOrders(ordersRes.data);
    } catch (error) {
      console.error('Error:', error);
    } finally { setLoading(false); }
  };

  const getStatusIcon = (status) => {
    const icons = { pending: Clock, confirmed: CheckCircle2, shipped: Package, delivered: CheckCircle2, cancelled: XCircle };
    return icons[status] || AlertCircle;
  };
  const getStatusColor = (s) => {
    const map = { pending:'text-yellow-600 bg-yellow-50 border-yellow-100', confirmed:'text-blue-600 bg-blue-50 border-blue-100', shipped:'text-purple-600 bg-purple-50 border-purple-100', delivered:'text-green-600 bg-green-50 border-green-100', cancelled:'text-red-600 bg-red-50 border-red-100' };
    return map[s] || 'text-gray-600 bg-gray-50 border-gray-100';
  };
  const getPaymentBadge = (status) => {
    const map = { paid: { color: 'text-green-700 bg-green-100 border-green-200', icon: CheckCircle2, label: 'Paid' }, pending: { color: 'text-yellow-700 bg-yellow-100 border-yellow-200', icon: Clock, label: 'Pending' }, failed: { color: 'text-red-700 bg-red-100 border-red-200', icon: XCircle, label: 'Failed' } };
    return map[status] || map.pending;
  };

  const filteredOrders = activeTab === 'all' ? orders : orders.filter(o => {
    if (activeTab === 'paid') return o.paymentStatus === 'paid';
    if (activeTab === 'pending') return o.paymentStatus === 'pending';
    if (activeTab === 'failed') return o.paymentStatus === 'failed';
    return true;
  });

  const totalSpent = orders.filter(o => o.paymentStatus === 'paid').reduce((acc, o) => acc + o.totalAmount, 0);

  if (loading) return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Navbar />
      <div className="flex flex-col items-center justify-center py-40 gap-4">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        <p className="text-gray-500 font-medium italic">Loading dashboard...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">My Dashboard</h1>
            <p className="text-gray-500 mt-1">Welcome back, {user?.name}</p>
          </div>
          <Link to="/profile" className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
            <User className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-bold text-gray-700">Profile</span>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-lg shadow-gray-100/50">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-xl bg-blue-50"><ShoppingCart className="w-5 h-5 text-blue-600" /></div>
              <span className="text-sm text-gray-500 font-medium">Total Orders</span>
            </div>
            <p className="text-3xl font-black text-gray-900">{orders.length}</p>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-lg shadow-gray-100/50">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-xl bg-green-50"><IndianRupee className="w-5 h-5 text-green-600" /></div>
              <span className="text-sm text-gray-500 font-medium">Total Spent</span>
            </div>
            <p className="text-3xl font-black text-gray-900">₹{totalSpent.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-lg shadow-gray-100/50">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-xl bg-yellow-50"><Clock className="w-5 h-5 text-yellow-600" /></div>
              <span className="text-sm text-gray-500 font-medium">Pending</span>
            </div>
            <p className="text-3xl font-black text-gray-900">{orders.filter(o => o.paymentStatus === 'pending').length}</p>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-lg shadow-gray-100/50">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-xl bg-emerald-50"><CheckCircle2 className="w-5 h-5 text-emerald-600" /></div>
              <span className="text-sm text-gray-500 font-medium">Delivered</span>
            </div>
            <p className="text-3xl font-black text-gray-900">{orders.filter(o => o.status === 'delivered').length}</p>
          </div>
        </div>

        {/* Order Log */}
        <div className="bg-white rounded-[32px] border border-gray-100 shadow-xl shadow-gray-100/50">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                <Package className="w-6 h-6 text-blue-600" /> Order History
              </h2>
            </div>
            {/* Filter Tabs */}
            <div className="flex items-center gap-2">
              {['all', 'paid', 'pending', 'failed'].map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${activeTab === tab ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                  {tab.charAt(0).toUpperCase() + tab.slice(1)} {tab !== 'all' && `(${orders.filter(o => tab === 'all' ? true : o.paymentStatus === tab).length})`}
                </button>
              ))}
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {filteredOrders.length === 0 ? (
              <div className="p-12 text-center">
                <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-400 text-lg font-medium">No orders found</p>
                <Link to="/" className="text-blue-600 font-bold mt-2 inline-block hover:underline">Start Shopping</Link>
              </div>
            ) : (
              filteredOrders.map((order) => {
                const StatusIcon = getStatusIcon(order.status);
                const paymentBadge = getPaymentBadge(order.paymentStatus);
                const PaymentIcon = paymentBadge.icon;
                return (
                  <div key={order._id} className="p-6 hover:bg-gray-50/50 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-3">
                          <p className="font-black text-gray-900">Order #{order._id.slice(-8)}</p>
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(order.status)}`}>
                            <StatusIcon className="w-3 h-3" /> {order.status.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                        {order.razorpayPaymentId && (
                          <p className="text-xs text-gray-400 mt-1 font-mono">
                            <span className="font-semibold">Txn:</span> {order.razorpayPaymentId}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-black text-blue-600">₹{order.totalAmount.toLocaleString()}</p>
                        <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border mt-1 ${paymentBadge.color}`}>
                          <PaymentIcon className="w-3 h-3" /> {paymentBadge.label}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 mt-3">
                      {order.orderItems?.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 bg-gray-50 rounded-xl p-2 pr-4">
                          <img src={item.product?.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                          <div>
                            <p className="text-xs font-bold text-gray-900">{item.product?.name}</p>
                            <p className="text-[10px] text-gray-500">Qty: {item.quantity} • ₹{item.price * item.quantity}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <CreditCard className="w-3 h-3" />
                          {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
                        </span>
                        {order.shippingAddress && (
                          <span>📍 {order.shippingAddress.city}, {order.shippingAddress.pincode}</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CustomerDashboard;

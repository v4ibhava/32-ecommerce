import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  LayoutDashboard, Package, ShoppingCart, Users, TrendingUp,
  Plus, Loader2, LogOut, Cpu, ChevronRight, IndianRupee,
  AlertTriangle, Clock
} from 'lucide-react';
import AdminSidebar from './AdminSidebar';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || 'null');

  useEffect(() => {
    if (!userInfo || userInfo.role !== 'admin') { navigate('/login'); return; }
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await axios.get('/api/admin/stats', {
        headers: { Authorization: `Bearer ${userInfo.token}` }
      });
      setStats(data);
    } catch (error) {
      toast.error('Failed to load dashboard');
    } finally { setLoading(false); }
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
    </div>
  );

  const statCards = [
    { label: 'Products', value: stats?.totalProducts || 0, icon: Package, bg: 'bg-blue-500/10' },
    { label: 'Orders', value: stats?.totalOrders || 0, icon: ShoppingCart, bg: 'bg-emerald-500/10' },
    { label: 'Customers', value: stats?.totalUsers || 0, icon: Users, bg: 'bg-violet-500/10' },
    { label: 'Revenue', value: `₹${(stats?.totalRevenue || 0).toLocaleString()}`, icon: IndianRupee, bg: 'bg-amber-500/10' },
  ];

  const getStatusColor = (s) => {
    const map = { pending:'text-yellow-400 bg-yellow-400/10', confirmed:'text-blue-400 bg-blue-400/10', shipped:'text-purple-400 bg-purple-400/10', delivered:'text-green-400 bg-green-400/10', cancelled:'text-red-400 bg-red-400/10' };
    return map[s] || 'text-gray-400 bg-gray-400/10';
  };
  const getPaymentColor = (s) => {
    const map = { paid:'text-green-400 bg-green-400/10', pending:'text-yellow-400 bg-yellow-400/10', failed:'text-red-400 bg-red-400/10' };
    return map[s] || 'text-gray-400 bg-gray-400/10';
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <AdminSidebar active="dashboard" />
      <main className="ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-black">Dashboard</h1>
              <p className="text-gray-500 mt-1">Welcome back, {userInfo?.name?.split(' ')[0]}</p>
            </div>
            <Link to="/admin/products/new" className="flex items-center gap-2 px-5 py-3 bg-blue-600 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20">
              <Plus className="w-5 h-5" /> Add Product
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((s) => (
              <div key={s.label} className="bg-gray-900 rounded-2xl p-6 border border-gray-800 hover:border-gray-700 transition-all">
                <div className={`p-3 rounded-xl ${s.bg} w-fit mb-4`}><s.icon className="w-6 h-6" /></div>
                <p className="text-2xl font-black">{s.value}</p>
                <p className="text-sm text-gray-500 font-medium mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-yellow-500/10"><Clock className="w-6 h-6 text-yellow-400" /></div>
              <div><p className="text-2xl font-black">{stats?.pendingOrders || 0}</p><p className="text-sm text-gray-500">Pending Orders</p></div>
            </div>
            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-red-500/10"><AlertTriangle className="w-6 h-6 text-red-400" /></div>
              <div><p className="text-2xl font-black">{stats?.failedPayments || 0}</p><p className="text-sm text-gray-500">Failed Payments</p></div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-2xl border border-gray-800">
            <div className="flex items-center justify-between p-6 border-b border-gray-800">
              <h2 className="text-lg font-black">Recent Orders</h2>
              <Link to="/admin/orders" className="text-sm text-blue-400 font-bold hover:underline flex items-center gap-1">View All <ChevronRight className="w-4 h-4" /></Link>
            </div>
            <div className="divide-y divide-gray-800">
              {!stats?.recentOrders?.length ? <div className="p-12 text-center text-gray-500">No orders yet</div> :
                stats.recentOrders.map((order) => (
                  <div key={order._id} className="p-4 px-6 flex items-center justify-between hover:bg-gray-800/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="flex -space-x-2">
                        {order.orderItems?.slice(0, 2).map((item, idx) => (
                          <img key={idx} src={item.product?.image} alt="" className="w-10 h-10 rounded-lg object-cover border-2 border-gray-900" />
                        ))}
                      </div>
                      <div>
                        <p className="font-bold text-sm">#{order._id?.slice(-8)}</p>
                        <p className="text-xs text-gray-500">{order.user?.name} • {new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}>{order.status}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getPaymentColor(order.paymentStatus)}`}>{order.paymentStatus}</span>
                      <p className="font-black min-w-[80px] text-right">₹{order.totalAmount}</p>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;

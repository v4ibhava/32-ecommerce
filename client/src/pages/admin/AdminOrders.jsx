import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { ShoppingCart, Loader2, ChevronDown } from 'lucide-react';
import AdminSidebar from './AdminSidebar';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || 'null');

  useEffect(() => {
    if (!userInfo || userInfo.role !== 'admin') { navigate('/login'); return; }
    fetchOrders();
  }, []);

  const config = { headers: { Authorization: `Bearer ${userInfo?.token}` } };

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get('/api/admin/orders', config);
      setOrders(data);
    } catch (error) {
      toast.error('Failed to load orders');
    } finally { setLoading(false); }
  };

  const handleStatusChange = async (orderId, field, value) => {
    setUpdating(orderId);
    try {
      await axios.put(`/api/admin/orders/${orderId}`, { [field]: value }, config);
      setOrders(orders.map(o => o._id === orderId ? { ...o, [field]: value } : o));
      toast.success('Order updated');
    } catch (error) {
      toast.error('Failed to update order');
    } finally { setUpdating(null); }
  };

  const getStatusColor = (s) => {
    const map = { pending:'text-yellow-400 bg-yellow-400/10', confirmed:'text-blue-400 bg-blue-400/10', shipped:'text-purple-400 bg-purple-400/10', delivered:'text-green-400 bg-green-400/10', cancelled:'text-red-400 bg-red-400/10' };
    return map[s] || 'text-gray-400 bg-gray-400/10';
  };
  const getPaymentColor = (s) => {
    const map = { paid:'text-green-400 bg-green-400/10', pending:'text-yellow-400 bg-yellow-400/10', failed:'text-red-400 bg-red-400/10' };
    return map[s] || 'text-gray-400 bg-gray-400/10';
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <AdminSidebar active="orders" />
      <main className="ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-black flex items-center gap-3"><ShoppingCart className="w-8 h-8 text-blue-400" /> All Orders</h1>
            <p className="text-gray-500 mt-1">{orders.length} total orders</p>
          </div>

          {orders.length === 0 ? (
            <div className="bg-gray-900 rounded-2xl p-12 text-center border border-dashed border-gray-700">
              <p className="text-gray-400 text-lg">No orders yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order._id} className="bg-gray-900 rounded-2xl border border-gray-800 p-6 hover:border-gray-700 transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="font-black text-lg">#{order._id.slice(-8)}</p>
                      <p className="text-sm text-gray-500">{order.user?.name} • {order.user?.email}</p>
                      <p className="text-xs text-gray-600">{new Date(order.createdAt).toLocaleString('en-IN')}</p>
                    </div>
                    <p className="text-2xl font-black text-blue-400">₹{order.totalAmount}</p>
                  </div>

                  <div className="flex items-center gap-3 mb-4 overflow-x-auto pb-2">
                    {order.orderItems?.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 flex-shrink-0 bg-gray-800 rounded-xl p-2 pr-4">
                        <img src={item.product?.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                        <div>
                          <p className="text-xs font-bold">{item.product?.name}</p>
                          <p className="text-[10px] text-gray-500">Qty: {item.quantity} • ₹{item.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-4 pt-4 border-t border-gray-800">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-500">Order Status:</span>
                      <div className="relative">
                        <select value={order.status} onChange={(e) => handleStatusChange(order._id, 'status', e.target.value)}
                          disabled={updating === order._id}
                          className={`appearance-none pl-3 pr-8 py-1.5 rounded-lg text-xs font-bold cursor-pointer focus:outline-none ${getStatusColor(order.status)}`}>
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none" />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-500">Payment:</span>
                      <div className="relative">
                        <select value={order.paymentStatus} onChange={(e) => handleStatusChange(order._id, 'paymentStatus', e.target.value)}
                          disabled={updating === order._id}
                          className={`appearance-none pl-3 pr-8 py-1.5 rounded-lg text-xs font-bold cursor-pointer focus:outline-none ${getPaymentColor(order.paymentStatus)}`}>
                          <option value="pending">Pending</option>
                          <option value="paid">Paid</option>
                          <option value="failed">Failed</option>
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none" />
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 ml-auto">
                      {order.paymentMethod === 'cod' ? '💵 COD' : '💳 Online'}
                    </span>
                    {order.shippingAddress && (
                      <span className="text-xs text-gray-600">
                        📍 {order.shippingAddress.city}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminOrders;

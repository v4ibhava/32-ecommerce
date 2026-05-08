import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, LogOut, Cpu } from 'lucide-react';

const AdminSidebar = ({ active }) => {
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || 'null');

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  const links = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, to: '/admin' },
    { id: 'products', label: 'Products', icon: Package, to: '/admin/products' },
    { id: 'orders', label: 'Orders', icon: ShoppingCart, to: '/admin/orders' },
  ];

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-gray-900 border-r border-gray-800 flex flex-col z-50">
      <div className="p-6 border-b border-gray-800">
        <Link to="/" className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-xl"><Cpu className="w-6 h-6 text-white" /></div>
          <div>
            <span className="text-lg font-black bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">ESP32 Shop</span>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Admin Panel</p>
          </div>
        </Link>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {links.map((l) => (
          <Link key={l.id} to={l.to}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${active === l.id ? 'bg-blue-600/10 text-blue-400 font-bold' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>
            <l.icon className="w-5 h-5" /> {l.label}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
            <span className="text-sm font-bold text-gray-300">{userInfo?.name?.charAt(0)}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white truncate">{userInfo?.name}</p>
            <p className="text-xs text-gray-500 truncate">{userInfo?.email}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 font-medium transition-all">
          <LogOut className="w-5 h-5" /> Logout
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;

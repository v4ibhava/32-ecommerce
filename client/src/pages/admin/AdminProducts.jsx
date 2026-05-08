import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Plus, Trash2, Edit3, Loader2, Package, Search, ImageIcon } from 'lucide-react';
import AdminSidebar from './AdminSidebar';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || 'null');

  useEffect(() => {
    if (!userInfo || userInfo.role !== 'admin') { navigate('/login'); return; }
    fetchProducts();
  }, []);

  const config = { headers: { Authorization: `Bearer ${userInfo?.token}` } };

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get('/api/admin/products', config);
      setProducts(data);
    } catch (error) {
      toast.error('Failed to load products');
    } finally { setLoading(false); }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      await axios.delete(`/api/admin/products/${id}`, config);
      setProducts(products.filter(p => p._id !== id));
      toast.success('Product deleted');
    } catch (error) {
      toast.error('Failed to delete product');
    } finally { setDeleting(null); }
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <AdminSidebar active="products" />
      <main className="ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-black flex items-center gap-3"><Package className="w-8 h-8 text-blue-400" /> Products</h1>
              <p className="text-gray-500 mt-1">{products.length} total products</p>
            </div>
            <Link to="/admin/products/new" className="flex items-center gap-2 px-5 py-3 bg-blue-600 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20">
              <Plus className="w-5 h-5" /> Add Product
            </Link>
          </div>

          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input type="text" placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-gray-900 border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
          </div>

          {filtered.length === 0 ? (
            <div className="bg-gray-900 rounded-2xl p-12 text-center border border-dashed border-gray-700">
              <Package className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No products found</p>
              <Link to="/admin/products/new" className="text-blue-400 font-bold mt-2 inline-block hover:underline">Add your first product</Link>
            </div>
          ) : (
            <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
              <div className="grid grid-cols-[80px_1fr_100px_80px_100px_120px] gap-4 p-4 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-800">
                <span>Image</span><span>Product</span><span>Price</span><span>Stock</span><span>Category</span><span className="text-right">Actions</span>
              </div>
              {filtered.map((product) => (
                <div key={product._id} className="grid grid-cols-[80px_1fr_100px_80px_100px_120px] gap-4 p-4 items-center border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-800">
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center"><ImageIcon className="w-6 h-6 text-gray-600" /></div>
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-white">{product.name}</p>
                    <p className="text-xs text-gray-500 line-clamp-1">{product.description}</p>
                  </div>
                  <p className="font-black text-white">₹{product.price}</p>
                  <p className={`font-bold ${product.stock > 0 ? 'text-green-400' : 'text-red-400'}`}>{product.stock}</p>
                  <span className="px-2 py-1 rounded-lg bg-blue-500/10 text-blue-400 text-xs font-bold text-center">{product.category}</span>
                  <div className="flex items-center gap-2 justify-end">
                    <Link to={`/admin/products/edit/${product._id}`} className="p-2 rounded-lg bg-gray-800 hover:bg-blue-600/20 text-gray-400 hover:text-blue-400 transition-all">
                      <Edit3 className="w-4 h-4" />
                    </Link>
                    <button onClick={() => handleDelete(product._id, product.name)} disabled={deleting === product._id}
                      className="p-2 rounded-lg bg-gray-800 hover:bg-red-600/20 text-gray-400 hover:text-red-400 transition-all disabled:opacity-50">
                      {deleting === product._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    </button>
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

export default AdminProducts;

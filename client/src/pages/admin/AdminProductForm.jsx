import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Loader2, ChevronLeft, ImageIcon, Save, Link as LinkIcon } from 'lucide-react';
import AdminSidebar from './AdminSidebar';

const AdminProductForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || 'null');

  const [form, setForm] = useState({ name: '', description: '', price: '', stock: '', category: 'ESP32', image: '' });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  useEffect(() => {
    if (!userInfo || userInfo.role !== 'admin') { navigate('/login'); return; }
    if (isEdit) fetchProduct();
  }, [id]);

  const config = { headers: { Authorization: `Bearer ${userInfo?.token}` } };

  const fetchProduct = async () => {
    try {
      const { data } = await axios.get(`/api/products/${id}`);
      setForm({ 
        name: data.name, 
        description: data.description, 
        price: data.price, 
        stock: data.stock, 
        category: data.category || 'ESP32',
        image: data.image
      });
    } catch (error) {
      toast.error('Product not found');
      navigate('/admin/products');
    } finally { setFetching(false); }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.image) { toast.error('Please provide a product image URL'); return; }

    setLoading(true);
    try {
      if (isEdit) {
        await axios.put(`/api/admin/products/${id}`, form, config);
        toast.success('Product updated!');
      } else {
        await axios.post('/api/admin/products', form, config);
        toast.success('Product created!');
      }
      navigate('/admin/products');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save product');
    } finally { setLoading(false); }
  };

  if (fetching) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <AdminSidebar active="products" />
      <main className="ml-64 p-8">
        <div className="max-w-3xl mx-auto">
          <button onClick={() => navigate('/admin/products')} className="flex items-center gap-1 text-sm text-gray-400 hover:text-blue-400 font-bold mb-6 transition-colors">
            <ChevronLeft className="w-4 h-4" /> Back to Products
          </button>

          <h1 className="text-3xl font-black mb-8">{isEdit ? 'Edit Product' : 'Add New Product'}</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image URL Input */}
            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
              <label className="block text-sm font-bold text-gray-400 mb-3">Product Image URL</label>
              <div className="flex items-start gap-6">
                <div className="w-32 h-32 rounded-2xl bg-gray-800 border-2 border-dashed border-gray-700 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {form.image ? (
                    <img src={form.image} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-10 h-10 text-gray-600" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="relative">
                    <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input type="text" name="image" value={form.image} onChange={handleChange} required placeholder="https://example.com/image.jpg"
                      className="w-full pl-12 pr-4 py-4 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                  </div>
                  <p className="text-[10px] text-gray-500 mt-2 uppercase font-bold tracking-widest">Provide a direct image URL (Unsplash, Cloudinary, etc.)</p>
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-400 mb-2">Product Name</label>
                <input type="text" name="name" value={form.name} onChange={handleChange} required placeholder="e.g., ESP32-DevKitV1"
                  className="w-full p-4 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-400 mb-2">Description</label>
                <textarea name="description" value={form.description} onChange={handleChange} required rows="3" placeholder="Product description..."
                  className="w-full p-4 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2">Price (₹)</label>
                  <input type="number" name="price" value={form.price} onChange={handleChange} required min="1" placeholder="450"
                    className="w-full p-4 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2">Stock</label>
                  <input type="number" name="stock" value={form.stock} onChange={handleChange} min="0" placeholder="100"
                    className="w-full p-4 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2">Category</label>
                  <input type="text" name="category" value={form.category} onChange={handleChange} placeholder="ESP32"
                    className="w-full p-4 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-4 bg-blue-600 rounded-xl font-black text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              {loading ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AdminProductForm;

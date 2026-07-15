'use client';

import { useEffect, useState } from 'react';
import { formatPrice } from '../../lib/utils';
import {
  TrendingUp,
  Package,
  ShoppingBag,
  Users,
  AlertTriangle,
  RefreshCw,
  Plus,
  Settings,
  Activity,
  Layers,
  Percent,
  BookOpen,
  LayoutGrid,
  Sparkles,
  Flame,
  FileText
} from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'marketing'>('dashboard');

  const [metrics, setMetrics] = useState({
    revenue: 1249.99,
    orders: 3,
    sales: 4,
    customers: 2
  });

  const [lowStock, setLowStock] = useState<any[]>([
    { id: '1', name: 'iPhone 15 Pro Max (Space Black)', sku: 'IPHONE15PM-BLK', stock: 5, warehouse: 'San Francisco Main Depot' },
    { id: '2', name: 'Nike Air Max (US 10)', sku: 'NIKE-AM-BLK-10', stock: 8, warehouse: 'San Francisco Main Depot' }
  ]);

  const [ordersList, setOrdersList] = useState<any[]>([
    { id: 'ORD-001', customer: 'Jane Doe Storefront', total: 1099.00, status: 'CONFIRMED', gateway: 'STRIPE', date: 'Just now' },
    { id: 'ORD-002', customer: 'Jane Doe Storefront', total: 149.99, status: 'PENDING', gateway: 'COD', date: '10 mins ago' }
  ]);

  // Adjust Stock Form
  const [adjustVariant, setAdjustVariant] = useState('IPHONE15PM-BLK');
  const [adjustQty, setAdjustQty] = useState(25);
  const [adjustType, setAdjustType] = useState<'IN' | 'OUT'>('IN');
  const [adjustReason, setAdjustReason] = useState('Restock import shipment');
  const [stockSuccess, setStockSuccess] = useState('');

  // Coupon Form
  const [couponCode, setCouponCode] = useState('');
  const [couponType, setCouponType] = useState<'PERCENTAGE' | 'FIXED'>('PERCENTAGE');
  const [couponValue, setCouponValue] = useState(15);
  const [couponMin, setCouponMin] = useState(60);
  const [couponSuccess, setCouponSuccess] = useState('');

  // Marketing Builder States
  const [lpSlug, setLpSlug] = useState('summer-electronics');
  const [lpTitle, setLpTitle] = useState('Summer Electronics Splash');
  const [lpSeoTitle, setLpSeoTitle] = useState('Summer Electronics Sale - Shopora');
  const [lpMetaDesc, setLpMetaDesc] = useState('Save up to 35% on latest headphones and mobile phones.');
  const [lpCanonical, setLpCanonical] = useState('http://localhost:3001/landing/summer-electronics');
  const [lpOgImage, setLpOgImage] = useState('https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1200');
  const [lpSuccess, setLpSuccess] = useState('');

  // Campaign States
  const [campTitle, setCampTitle] = useState('Winter Mega Deals');
  const [campSlug, setCampSlug] = useState('winter-deals');
  const [campCoupon, setCampCoupon] = useState('WINTER30');
  const [campBanner, setCampBanner] = useState('https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1200');
  const [campContent, setCampContent] = useState('30% off all catalog items for winter season.');
  const [campSuccess, setCampSuccess] = useState('');

  // Blog Creator States
  const [blogTitle, setBlogTitle] = useState('Maximizing Checkout Conversions');
  const [blogSlug, setBlogSlug] = useState('maximizing-checkout-conversions');
  const [blogAuthor, setBlogAuthor] = useState('Sarah Jenkins');
  const [blogImage, setBlogImage] = useState('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800');
  const [blogContent, setBlogContent] = useState('<h2>Tip 1: Clear trust badges</h2><p>Display secure payment logos right next to checking buttons.</p>');
  const [blogSuccess, setBlogSuccess] = useState('');

  const handleAdjustStockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStockSuccess('');
    setLowStock(prev =>
      prev.map(item => {
        if (item.sku === adjustVariant) {
          const delta = adjustType === 'IN' ? adjustQty : -adjustQty;
          return { ...item, stock: Math.max(0, item.stock + delta) };
        }
        return item;
      })
    );
    setStockSuccess(`Successfully updated stock for ${adjustVariant} (${adjustType} ${adjustQty}).`);
    setTimeout(() => setStockSuccess(''), 3000);
  };

  const handleCreateCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode) return;
    setCouponSuccess(`Coupon ${couponCode.toUpperCase()} (${couponType} ${couponValue}) created successfully!`);
    setCouponCode('');
    setTimeout(() => setCouponSuccess(''), 3000);
  };

  const handleLpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate successful creation
    setLpSuccess(`Landing page "/landing/${lpSlug}" created and published successfully!`);
    setTimeout(() => setLpSuccess(''), 4000);
  };

  const handleCampSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCampSuccess(`Campaign page "/campaign/${campSlug}" activated successfully!`);
    setTimeout(() => setCampSuccess(''), 4000);
  };

  const handleBlogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBlogSuccess(`Blog post "/blog/${blogSlug}" published successfully!`);
    setTimeout(() => setBlogSuccess(''), 4000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-900 pb-6 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold font-display tracking-tight text-white">Admin Dashboard</h1>
            <p className="text-sm text-slate-400">Manage Shopora inventory, coupons, and marketing campaigns.</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex bg-slate-900 border border-slate-850 p-1 rounded-xl">
              <button 
                onClick={() => setActiveTab('dashboard')}
                className={`py-1.5 px-3 text-xs font-bold rounded-lg transition-all ${activeTab === 'dashboard' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
              >
                Operational
              </button>
              <button 
                onClick={() => setActiveTab('marketing')}
                className={`py-1.5 px-3 text-xs font-bold rounded-lg transition-all ${activeTab === 'marketing' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
              >
                Marketing CMS
              </button>
            </div>

            <div className="hidden sm:flex items-center space-x-2 text-xs font-semibold text-slate-450 uppercase tracking-widest bg-slate-900 border border-slate-800 rounded-xl px-4 py-2">
              <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span>Operational Mode: Active</span>
            </div>
          </div>
        </div>

        {activeTab === 'dashboard' ? (
          <>
            {/* Metrics Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { name: 'Total Revenue', value: formatPrice(metrics.revenue), icon: TrendingUp, color: 'text-emerald-400' },
                { name: 'Orders Placed', value: metrics.orders, icon: ShoppingBag, color: 'text-blue-400' },
                { name: 'Products Sold', value: metrics.sales, icon: Package, color: 'text-purple-400' },
                { name: 'Active Customers', value: metrics.customers, icon: Users, color: 'text-pink-400' }
              ].map((m, i) => (
                <div key={i} className="glass rounded-2xl p-5 border border-slate-850 flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">{m.name}</span>
                    <span className="text-2xl font-bold block text-white">{m.value}</span>
                  </div>
                  <div className={`w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center border border-slate-800 ${m.color}`}>
                    <m.icon className="w-5 h-5" />
                  </div>
                </div>
              ))}
            </div>

            {/* Dynamic Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left/Middle Column (Low Stock and Orders) */}
              <div className="lg:col-span-2 space-y-8">
                {/* Low Stock Alerts */}
                <div className="glass rounded-2xl p-6 border border-slate-850 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="w-5 h-5 text-amber-500" />
                      <h2 className="text-base font-bold font-display text-white">Low Stock Inventory Alerts</h2>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                      <thead>
                        <tr className="text-slate-400 border-b border-slate-900 text-xs font-semibold uppercase">
                          <th className="py-2.5">Variant SKU</th>
                          <th className="py-2.5">Product Title</th>
                          <th className="py-2.5">Qty Left</th>
                          <th className="py-2.5">Warehouse Location</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-900">
                        {lowStock.map((item) => (
                          <tr key={item.id} className="text-slate-300 font-medium">
                            <td className="py-3 font-mono text-xs text-blue-400">{item.sku}</td>
                            <td className="py-3">{item.name}</td>
                            <td className="py-3">
                              <span className={`px-2 py-0.5 rounded text-xs ${item.stock < 6 ? 'bg-rose-500/10 text-rose-400' : 'bg-amber-500/10 text-amber-400'}`}>
                                {item.stock} left
                              </span>
                            </td>
                            <td className="py-3 text-xs text-slate-400">{item.warehouse}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Recent Orders Timeline */}
                <div className="glass rounded-2xl p-6 border border-slate-850 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                    <div className="flex items-center space-x-2">
                      <Layers className="w-5 h-5 text-blue-400" />
                      <h2 className="text-base font-bold font-display text-white">Recent Order Management</h2>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {ordersList.map((order) => (
                      <div key={order.id} className="flex justify-between items-center p-4 bg-slate-900/60 border border-slate-850 rounded-xl hover:border-slate-800 transition text-sm">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-white font-mono">{order.id}</span>
                            <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                              order.status === 'CONFIRMED' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400">{order.customer} • {order.gateway} • {order.date}</p>
                        </div>
                        <span className="font-bold text-white text-base">{formatPrice(order.total)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column (Action Forms) */}
              <div className="space-y-6">
                {/* Stock Adjuster Form */}
                <div className="glass rounded-2xl p-6 border border-slate-850 space-y-4">
                  <h3 className="text-base font-bold font-display text-white border-b border-slate-900 pb-3 flex items-center space-x-2">
                    <RefreshCw className="w-4 h-4 text-blue-400" />
                    <span>Adjust Stock Levels</span>
                  </h3>

                  {stockSuccess && (
                    <p className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded p-2">{stockSuccess}</p>
                  )}

                  <form onSubmit={handleAdjustStockSubmit} className="space-y-4 text-xs font-semibold text-slate-400">
                    <div className="space-y-1">
                      <label className="block">Select SKU Variant</label>
                      <select
                        value={adjustVariant}
                        onChange={(e) => setAdjustVariant(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white"
                      >
                        <option value="IPHONE15PM-BLK">IPHONE15PM-BLK (iPhone 15 Pro Max)</option>
                        <option value="NIKE-AM-BLK-10">NIKE-AM-BLK-10 (Nike Air Max)</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="block">Type</label>
                        <select
                          value={adjustType}
                          onChange={(e: any) => setAdjustType(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white font-bold"
                        >
                          <option value="IN">STOCK IN (+)</option>
                          <option value="OUT">STOCK OUT (-)</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="block">Quantity</label>
                        <input
                          type="number"
                          value={adjustQty}
                          onChange={(e) => setAdjustQty(Number(e.target.value))}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white font-mono"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition"
                    >
                      Confirm Stock Adjustment
                    </button>
                  </form>
                </div>

                {/* Coupon Builder Form */}
                <div className="glass rounded-2xl p-6 border border-slate-850 space-y-4">
                  <h3 className="text-base font-bold font-display text-white border-b border-slate-900 pb-3 flex items-center space-x-2">
                    <Percent className="w-4 h-4 text-blue-400" />
                    <span>Create Discount Coupon</span>
                  </h3>

                  {couponSuccess && (
                    <p className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded p-2">{couponSuccess}</p>
                  )}

                  <form onSubmit={handleCreateCouponSubmit} className="space-y-4 text-xs font-semibold text-slate-400">
                    <div className="space-y-1">
                      <label className="block">Coupon Code</label>
                      <input
                        type="text"
                        required
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="WINTER15"
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white font-bold placeholder-slate-650"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="block">Type</label>
                        <select
                          value={couponType}
                          onChange={(e: any) => setCouponType(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white font-bold"
                        >
                          <option value="PERCENTAGE">PERCENTAGE (%)</option>
                          <option value="FIXED">FIXED DISCOUNT ($)</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="block">Value</label>
                        <input
                          type="number"
                          value={couponValue}
                          onChange={(e) => setCouponValue(Number(e.target.value))}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white font-mono"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition"
                    >
                      Create Promotional Code
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Landing Page Builder */}
            <div className="glass border border-slate-850 rounded-2xl p-6 space-y-4">
              <h3 className="text-base font-bold font-display text-white border-b border-slate-900 pb-3 flex items-center space-x-2">
                <LayoutGrid className="w-4 h-4 text-blue-400" />
                <span>Landing Page Builder</span>
              </h3>

              {lpSuccess && (
                <p className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded p-2">{lpSuccess}</p>
              )}

              <form onSubmit={handleLpSubmit} className="space-y-3.5 text-xs font-semibold text-slate-450">
                <div className="space-y-1">
                  <label className="block text-slate-400">Custom URL Slug</label>
                  <input 
                    type="text" 
                    required
                    value={lpSlug}
                    onChange={(e) => setLpSlug(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white" 
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-slate-400">Page Title</label>
                  <input 
                    type="text" 
                    required
                    value={lpTitle}
                    onChange={(e) => setLpTitle(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white" 
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-slate-400">SEO Meta Title</label>
                  <input 
                    type="text" 
                    value={lpSeoTitle}
                    onChange={(e) => setLpSeoTitle(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white" 
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-slate-400">Meta Description</label>
                  <textarea 
                    value={lpMetaDesc}
                    onChange={(e) => setLpMetaDesc(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white" 
                    rows={2}
                  />
                </div>

                <button 
                  type="submit" 
                  className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition"
                >
                  Publish Landing Page
                </button>
              </form>
            </div>

            {/* Campaign Manager */}
            <div className="glass border border-slate-850 rounded-2xl p-6 space-y-4">
              <h3 className="text-base font-bold font-display text-white border-b border-slate-900 pb-3 flex items-center space-x-2">
                <Flame className="w-4 h-4 text-rose-500 animate-pulse" />
                <span>Campaign Manager</span>
              </h3>

              {campSuccess && (
                <p className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded p-2">{campSuccess}</p>
              )}

              <form onSubmit={handleCampSubmit} className="space-y-3.5 text-xs font-semibold text-slate-450">
                <div className="space-y-1">
                  <label className="block text-slate-400">Campaign Title</label>
                  <input 
                    type="text" 
                    required
                    value={campTitle}
                    onChange={(e) => setCampTitle(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white" 
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-slate-400">Campaign Slug</label>
                  <input 
                    type="text" 
                    required
                    value={campSlug}
                    onChange={(e) => setCampSlug(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white" 
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-slate-400">Coupon Code</label>
                  <input 
                    type="text" 
                    value={campCoupon}
                    onChange={(e) => setCampCoupon(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white font-bold" 
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-slate-400">Promo Content</label>
                  <textarea 
                    value={campContent}
                    onChange={(e) => setCampContent(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white" 
                    rows={2}
                  />
                </div>

                <button 
                  type="submit" 
                  className="w-full py-2.5 px-4 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg transition"
                >
                  Activate Campaign Page
                </button>
              </form>
            </div>

            {/* Blog CMS Manager */}
            <div className="glass border border-slate-850 rounded-2xl p-6 space-y-4">
              <h3 className="text-base font-bold font-display text-white border-b border-slate-900 pb-3 flex items-center space-x-2">
                <BookOpen className="w-4 h-4 text-purple-400" />
                <span>Blog Articles Manager</span>
              </h3>

              {blogSuccess && (
                <p className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded p-2">{blogSuccess}</p>
              )}

              <form onSubmit={handleBlogSubmit} className="space-y-3.5 text-xs font-semibold text-slate-450">
                <div className="space-y-1">
                  <label className="block text-slate-400">Article Title</label>
                  <input 
                    type="text" 
                    required
                    value={blogTitle}
                    onChange={(e) => setBlogTitle(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white font-bold" 
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-slate-400">Slug</label>
                  <input 
                    type="text" 
                    required
                    value={blogSlug}
                    onChange={(e) => setBlogSlug(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white" 
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-slate-400">Author Name</label>
                  <input 
                    type="text" 
                    required
                    value={blogAuthor}
                    onChange={(e) => setBlogAuthor(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white" 
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-slate-400">Post Content (HTML)</label>
                  <textarea 
                    value={blogContent}
                    onChange={(e) => setBlogContent(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white" 
                    rows={2}
                  />
                </div>

                <button 
                  type="submit" 
                  className="w-full py-2.5 px-4 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg transition"
                >
                  Publish Article
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

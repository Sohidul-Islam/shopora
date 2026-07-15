'use client';

import { useEffect, useState, useRef } from 'react';
import { formatPrice } from '../../lib/utils';
import Link from 'next/link';
import {
  TrendingUp, Package, ShoppingBag, Users, AlertTriangle, RefreshCw, 
  Plus, Settings, Activity, Layers, Percent, BookOpen, LayoutGrid, 
  Sparkles, Flame, FileText, Search, Bell, HelpCircle, Shield, 
  MapPin, CheckCircle2, ChevronRight, Copy, Download, Trash, UserCheck, Key
} from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [paletteOpen, setPaletteOpen] = useState(false);

  // Notifications state
  const [notifications, setNotifications] = useState([
    { id: '1', title: 'Low Stock Alert', msg: 'Sony WH-1000XM5 is below reorder level (3 left)', read: false },
    { id: '2', title: 'New Customer Registered', msg: 'Elena Rostova created an account.', read: false }
  ]);

  // Operational metrics
  const [metrics] = useState({
    revenueToday: 1397.99,
    revenueMonth: 28450.00,
    aov: 145.50,
    abandonmentRate: '28.4%',
    ordersCount: 142,
    customersCount: 89
  });

  // Database collections (mock states for interactive CMS updates)
  const [productsList, setProductsList] = useState([
    { id: '1', name: 'iPhone 15 Pro Max', sku: 'IPHONE15PM-BLK', brand: 'Apple', price: 1199, salePrice: 1099, stock: 5, status: 'PUBLISHED' },
    { id: '2', name: 'Nike Air Max Running Shoes', sku: 'NIKE-AM-BLK-10', brand: 'Nike', price: 180, salePrice: 149.99, stock: 8, status: 'PUBLISHED' },
    { id: '3', name: 'Sony WH-1000XM5 Wireless Headphones', sku: 'SONY-XM5-SLV', brand: 'Sony', price: 398, salePrice: 348, stock: 3, status: 'PUBLISHED' }
  ]);

  const [ordersList, setOrdersList] = useState([
    { id: 'ORD-1049', customer: 'Sarah Jenkins', total: 1099.00, status: 'CONFIRMED', gateway: 'STRIPE', date: '5 mins ago' },
    { id: 'ORD-1048', customer: 'David Chen', total: 149.99, status: 'PENDING', gateway: 'COD', date: '25 mins ago' },
    { id: 'ORD-1047', customer: 'Elena Rostova', total: 348.00, status: 'DELIVERED', gateway: 'PAYPAL', date: '2 hours ago' }
  ]);

  const [customersList] = useState([
    { id: 'CUST-001', name: 'Sarah Jenkins', email: 'sarah@example.com', points: 420, orders: 4, joined: 'Jun 12, 2026' },
    { id: 'CUST-002', name: 'David Chen', email: 'david.c@example.com', points: 150, orders: 1, joined: 'Jun 24, 2026' },
    { id: 'CUST-003', name: 'Elena Rostova', email: 'elena.r@example.com', points: 780, orders: 7, joined: 'Jul 01, 2026' }
  ]);

  const [supportTickets] = useState([
    { id: 'TKT-102', subject: 'Refund delay status', customer: 'Sarah Jenkins', priority: 'HIGH', status: 'OPEN' },
    { id: 'TKT-101', subject: 'Variant SKU mismatch', customer: 'David Chen', priority: 'MEDIUM', status: 'RESOLVED' }
  ]);

  // Inventory adjustment states
  const [adjustSku, setAdjustSku] = useState('SONY-XM5-SLV');
  const [adjustQty, setAdjustQty] = useState(10);
  const [stockSuccess, setStockSuccess] = useState('');

  // Page builder block templates state
  const [landingPagesList, setLandingPagesList] = useState([
    { id: '1', title: 'Eid Sale 2026', url: 'eid-sale-2026', status: 'PUBLISHED' },
    { id: '2', title: 'Summer Season Launch', url: 'summer-sale', status: 'DRAFT' }
  ]);

  const [newPageTitle, setNewPageTitle] = useState('');
  const [newPageUrl, setNewPageUrl] = useState('');
  const [newPageSuccess, setNewPageSuccess] = useState('');

  // Hotkey listener for Command Palette (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleAdjustStock = (e: React.FormEvent) => {
    e.preventDefault();
    setProductsList(prev =>
      prev.map(p => {
        if (p.sku === adjustSku) {
          return { ...p, stock: p.stock + adjustQty };
        }
        return p;
      })
    );
    setStockSuccess(`Restocked ${adjustSku} with ${adjustQty} units.`);
    setTimeout(() => setStockSuccess(''), 3000);
  };

  const handleCreateLp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPageTitle || !newPageUrl) return;
    const newLp = {
      id: String(landingPagesList.length + 1),
      title: newPageTitle,
      url: newPageUrl,
      status: 'PUBLISHED'
    };
    setLandingPagesList([newLp, ...landingPagesList]);
    setNewPageSuccess(`Published custom page at /landing/${newPageUrl}`);
    setNewPageTitle('');
    setNewPageUrl('');
    setTimeout(() => setNewPageSuccess(''), 3000);
  };

  // Filter sections inside command palette
  const commandPaletteLinks = [
    { title: 'Overview Dashboard', tab: 'dashboard', category: 'General' },
    { title: 'Recent Orders Listing', tab: 'orders', category: 'Sales' },
    { title: 'Products Catalogue', tab: 'catalog', category: 'Catalog' },
    { title: 'Customers Directory', tab: 'customers', category: 'Customers' },
    { title: 'Marketing Campaigns', tab: 'marketing', category: 'Marketing' },
    { title: 'Blog CMS Publisher', tab: 'marketing', category: 'Marketing' },
    { title: 'Sales Reports & Analytics', tab: 'analytics', category: 'Analytics' },
    { title: 'Admin & Role Permissions', tab: 'users', category: 'Users' },
    { title: 'System Settings', tab: 'settings', category: 'Settings' }
  ];

  const filteredPaletteLinks = commandPaletteLinks.filter(lnk =>
    lnk.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lnk.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#05060b] via-[#090b11] to-[#040508] text-slate-100 flex">
      
      {/* 1. Left Sidebar Navigation */}
      <aside className="w-64 bg-[#06080e]/95 border-r border-slate-900/60 p-6 flex flex-col justify-between shrink-0 hidden md:flex">
        <div className="space-y-8">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-blue-400" />
            <span className="text-lg font-black font-display tracking-tight text-white">SHOPORA ADMIN</span>
          </div>

          <nav className="space-y-6">
            <div className="space-y-1.5">
              <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest block px-3">General</span>
              <button 
                onClick={() => setActiveTab('dashboard')}
                className={`w-full flex items-center space-x-3 py-2 px-3 text-xs font-bold rounded-xl transition ${
                  activeTab === 'dashboard' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
                }`}
              >
                <Activity className="w-4 h-4" />
                <span>Dashboard</span>
              </button>
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest block px-3">Sales</span>
              <button 
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center space-x-3 py-2 px-3 text-xs font-bold rounded-xl transition ${
                  activeTab === 'orders' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Orders</span>
              </button>
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest block px-3">Catalog</span>
              <button 
                onClick={() => setActiveTab('catalog')}
                className={`w-full flex items-center space-x-3 py-2 px-3 text-xs font-bold rounded-xl transition ${
                  activeTab === 'catalog' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
                }`}
              >
                <Package className="w-4 h-4" />
                <span>Inventory & Catalog</span>
              </button>
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest block px-3">Customers</span>
              <button 
                onClick={() => setActiveTab('customers')}
                className={`w-full flex items-center space-x-3 py-2 px-3 text-xs font-bold rounded-xl transition ${
                  activeTab === 'customers' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Customers</span>
              </button>
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest block px-3">Marketing</span>
              <button 
                onClick={() => setActiveTab('marketing')}
                className={`w-full flex items-center space-x-3 py-2 px-3 text-xs font-bold rounded-xl transition ${
                  activeTab === 'marketing' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
                }`}
              >
                <Flame className="w-4 h-4" />
                <span>Marketing & CMS</span>
              </button>
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest block px-3">Reports</span>
              <button 
                onClick={() => setActiveTab('analytics')}
                className={`w-full flex items-center space-x-3 py-2 px-3 text-xs font-bold rounded-xl transition ${
                  activeTab === 'analytics' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                <span>Analytics Reports</span>
              </button>
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest block px-3">System</span>
              <button 
                onClick={() => setActiveTab('users')}
                className={`w-full flex items-center space-x-3 py-2 px-3 text-xs font-bold rounded-xl transition ${
                  activeTab === 'users' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
                }`}
              >
                <Shield className="w-4 h-4" />
                <span>Security RBAC</span>
              </button>
              <button 
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center space-x-3 py-2 px-3 text-xs font-bold rounded-xl transition ${
                  activeTab === 'settings' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>Store Settings</span>
              </button>
            </div>
          </nav>
        </div>

        <div className="pt-6 border-t border-slate-900/60 flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-blue-650 flex items-center justify-center text-xs font-black text-white">AD</div>
          <div>
            <h4 className="text-xs font-bold text-white leading-none">Admin User</h4>
            <span className="text-[10px] text-slate-500">Super Administrator</span>
          </div>
        </div>
      </aside>

      {/* 2. Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header */}
        <header className="glass border-b border-slate-900/60 py-4 px-6 sm:px-10 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center space-x-4 flex-1">
            <button 
              onClick={() => setPaletteOpen(true)}
              className="flex items-center space-x-2.5 bg-[#0a0c14] border border-slate-800 rounded-2xl py-2 px-4 max-w-md w-full text-slate-500 hover:text-slate-400 text-xs transition"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Global Search... (Press ⌘+K)</span>
            </button>
          </div>

          <div className="flex items-center space-x-4">
            {/* Active Mode Tag */}
            <span className="hidden sm:inline-flex items-center space-x-1.5 text-[10px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-extrabold uppercase px-2.5 py-1 rounded-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>Live Mode</span>
            </span>

            {/* Notification Bell */}
            <div className="relative group cursor-pointer">
              <div className="p-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-white transition">
                <Bell className="w-4 h-4" />
              </div>
              <div className="absolute right-0 mt-2 w-72 glass border border-slate-850 rounded-2xl p-4 space-y-3 shadow-xl hidden group-hover:block z-50">
                <h4 className="font-extrabold text-xs text-white border-b border-slate-900 pb-2">Recent Notifications</h4>
                <div className="space-y-2.5">
                  {notifications.map(n => (
                    <div key={n.id} className="text-xs space-y-0.5">
                      <span className="font-bold text-slate-350">{n.title}</span>
                      <p className="text-slate-450 text-[10px] text-slate-450">{n.msg}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Panels Area */}
        <main className="flex-1 py-8 px-6 sm:px-10 overflow-y-auto space-y-8">
          
          {/* TAB 1: OVERVIEW DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              <div className="space-y-1">
                <h2 className="text-2xl font-black font-display text-white">Business Health Overview</h2>
                <p className="text-xs text-slate-400">Real-time store metrics, top-selling products, and system conversion rates.</p>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { name: 'Revenue Today', value: formatPrice(metrics.revenueToday), icon: TrendingUp, color: 'text-emerald-400' },
                  { name: 'Total Orders', value: metrics.ordersCount, icon: ShoppingBag, color: 'text-blue-400' },
                  { name: 'Average Order Value', value: formatPrice(metrics.aov), icon: Package, color: 'text-purple-400' },
                  { name: 'Abandonment Rate', value: metrics.abandonmentRate, icon: Users, color: 'text-rose-400' }
                ].map((m, idx) => (
                  <div key={idx} className="glass rounded-2xl p-5 border border-slate-850 flex items-center justify-between shadow-lg shadow-black/10">
                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider">{m.name}</span>
                      <span className="text-2xl font-bold block text-white font-display">{m.value}</span>
                    </div>
                    <div className={`w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center border border-slate-800 ${m.color}`}>
                      <m.icon className="w-5 h-5" />
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Orders Table */}
                <div className="lg:col-span-2 glass rounded-3xl p-6 border border-slate-850 space-y-4 shadow-lg shadow-black/10">
                  <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                    <h3 className="font-bold text-white text-base font-display">Recent Order Management</h3>
                    <button onClick={() => setActiveTab('orders')} className="text-xs text-blue-400 font-bold hover:underline">View All Orders &rarr;</button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="text-slate-500 border-b border-slate-900 font-extrabold uppercase tracking-wider">
                          <th className="py-2.5">Order ID</th>
                          <th className="py-2.5">Customer</th>
                          <th className="py-2.5">Gateway</th>
                          <th className="py-2.5">Total</th>
                          <th className="py-2.5">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-900/60">
                        {ordersList.map(o => (
                          <tr key={o.id} className="text-slate-300 font-semibold">
                            <td className="py-3 font-mono text-blue-400">{o.id}</td>
                            <td className="py-3">{o.customer}</td>
                            <td className="py-3">{o.gateway}</td>
                            <td className="py-3">{formatPrice(o.total)}</td>
                            <td className="py-3">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                o.status === 'CONFIRMED' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                              }`}>{o.status}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* System Low Stock widget */}
                <div className="glass rounded-3xl p-6 border border-slate-850 space-y-4 shadow-lg shadow-black/10">
                  <h3 className="font-bold text-white text-base font-display border-b border-slate-900 pb-3 flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    <span>Low Stock Inventory</span>
                  </h3>
                  <div className="space-y-3">
                    {productsList.filter(p => p.stock < 6).map(p => (
                      <div key={p.id} className="flex justify-between items-center p-3 bg-slate-900/40 border border-slate-850 rounded-2xl text-xs">
                        <div>
                          <h4 className="font-bold text-white truncate max-w-[150px]">{p.name}</h4>
                          <span className="text-[10px] text-slate-500 font-mono">{p.sku}</span>
                        </div>
                        <span className="px-2 py-0.5 rounded font-black bg-rose-500/10 text-rose-400">{p.stock} left</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ORDERS MANAGEMENT */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="space-y-1">
                <h2 className="text-2xl font-black font-display text-white">Customer Orders Management</h2>
                <p className="text-xs text-slate-400">Track the order lifecycle, trigger returns, and verify gateway transactions.</p>
              </div>

              <div className="glass rounded-3xl p-6 border border-slate-850 shadow-lg shadow-black/10">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="text-slate-500 border-b border-slate-900 font-extrabold uppercase tracking-wider">
                        <th className="py-3">Order ID</th>
                        <th className="py-3">Fulfillment Date</th>
                        <th className="py-3">Customer</th>
                        <th className="py-3">Payment Adapter</th>
                        <th className="py-3">Total Amount</th>
                        <th className="py-3">Status</th>
                        <th className="py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900/60">
                      {ordersList.map(o => (
                        <tr key={o.id} className="text-slate-300 font-semibold">
                          <td className="py-4 font-mono text-blue-400">{o.id}</td>
                          <td className="py-4">{o.date}</td>
                          <td className="py-4">{o.customer}</td>
                          <td className="py-4">{o.gateway}</td>
                          <td className="py-4">{formatPrice(o.total)}</td>
                          <td className="py-4">
                            <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold ${
                              o.status === 'CONFIRMED' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                            }`}>{o.status}</span>
                          </td>
                          <td className="py-4 text-right space-x-2">
                            <button 
                              onClick={() => {
                                setOrdersList(prev => prev.map(item => item.id === o.id ? { ...item, status: 'REFUNDED' } : item));
                                alert(`Refund trigger initialized for ${o.id}`);
                              }}
                              className="text-[10px] font-bold uppercase tracking-wider text-rose-400 hover:text-white py-1 px-2.5 bg-rose-500/5 hover:bg-rose-500 border border-rose-500/20 rounded-lg transition"
                            >
                              Refund
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: INVENTORY CATALOGUE */}
          {activeTab === 'catalog' && (
            <div className="space-y-8">
              <div className="space-y-1">
                <h2 className="text-2xl font-black font-display text-white">Catalog & Inventory Stock Control</h2>
                <p className="text-xs text-slate-400">View dynamic models, update variants, and restock warehouses.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Catalog Grid */}
                <div className="lg:col-span-2 glass rounded-3xl p-6 border border-slate-850 space-y-4 shadow-lg shadow-black/10">
                  <h3 className="font-bold text-white text-base font-display border-b border-slate-900 pb-3">Active Catalog Models</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="text-slate-500 border-b border-slate-900 font-extrabold uppercase tracking-wider">
                          <th className="py-2.5">SKU</th>
                          <th className="py-2.5">Name</th>
                          <th className="py-2.5">Brand</th>
                          <th className="py-2.5">Regular Price</th>
                          <th className="py-2.5">Stock</th>
                          <th className="py-2.5">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-900/60">
                        {productsList.map(p => (
                          <tr key={p.id} className="text-slate-300 font-semibold">
                            <td className="py-3 font-mono text-blue-400">{p.sku}</td>
                            <td className="py-3">{p.name}</td>
                            <td className="py-3">{p.brand}</td>
                            <td className="py-3">{formatPrice(p.salePrice || p.price)}</td>
                            <td className="py-3">
                              <span className={`px-2 py-0.5 rounded font-black ${p.stock < 6 ? 'bg-rose-500/10 text-rose-400' : 'bg-emerald-500/10 text-emerald-400'}`}>{p.stock} units</span>
                            </td>
                            <td className="py-3">
                              <span className="px-2 py-0.5 rounded text-[10px] font-black bg-blue-500/10 text-blue-400">{p.status}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Restocker Form */}
                <div className="glass rounded-3xl p-6 border border-slate-850 space-y-4 shadow-lg shadow-black/10">
                  <h3 className="font-bold text-white text-base font-display border-b border-slate-900 pb-3 flex items-center space-x-2">
                    <RefreshCw className="w-4 h-4 text-blue-400" />
                    <span>Adjust Stock Levels</span>
                  </h3>
                  
                  {stockSuccess && (
                    <p className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded p-2">{stockSuccess}</p>
                  )}

                  <form onSubmit={handleAdjustStock} className="space-y-4 text-xs font-semibold text-slate-400">
                    <div className="space-y-1">
                      <label className="block">Select Model SKU</label>
                      <select 
                        value={adjustSku}
                        onChange={(e) => setAdjustSku(e.target.value)}
                        className="w-full bg-[#0a0c14] border border-slate-800 rounded-xl p-3 text-white"
                      >
                        {productsList.map(p => (
                          <option key={p.id} value={p.sku}>{p.sku} - {p.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="block">Adjustment Quantity</label>
                      <input 
                        type="number"
                        required
                        value={adjustQty}
                        onChange={(e) => setAdjustQty(Number(e.target.value))}
                        className="w-full bg-[#0a0c14] border border-slate-800 rounded-xl p-3 text-white font-mono" 
                      />
                    </div>

                    <button 
                      type="submit"
                      className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition shadow-md shadow-blue-900/20"
                    >
                      Confirm Restock Level
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CUSTOMERS DIRECTORY */}
          {activeTab === 'customers' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Directory */}
              <div className="lg:col-span-2 glass rounded-3xl p-6 border border-slate-850 space-y-4 shadow-lg shadow-black/10">
                <h3 className="font-bold text-white text-base font-display border-b border-slate-900 pb-3">Active Customer Registrations</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="text-slate-500 border-b border-slate-900 font-extrabold uppercase tracking-wider">
                        <th className="py-2.5">ID</th>
                        <th className="py-2.5">Name</th>
                        <th className="py-2.5">Email</th>
                        <th className="py-2.5">Orders</th>
                        <th className="py-2.5">Reward Points</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900/60">
                      {customersList.map(c => (
                        <tr key={c.id} className="text-slate-300 font-semibold">
                          <td className="py-3 font-mono text-blue-400">{c.id}</td>
                          <td className="py-3 font-bold text-white">{c.name}</td>
                          <td className="py-3">{c.email}</td>
                          <td className="py-3">{c.orders} orders</td>
                          <td className="py-3">
                            <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-black">{c.points} pts</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Support Board */}
              <div className="glass rounded-3xl p-6 border border-slate-850 space-y-4 shadow-lg shadow-black/10">
                <h3 className="font-bold text-white text-base font-display border-b border-slate-900 pb-3">Open Support Tickets</h3>
                <div className="space-y-3.5">
                  {supportTickets.map(t => (
                    <div key={t.id} className="p-4 bg-slate-900/50 border border-slate-850 rounded-2xl space-y-2 text-xs">
                      <div className="flex justify-between items-start">
                        <span className="font-mono text-blue-400 font-bold">{t.id}</span>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-black ${
                          t.priority === 'HIGH' ? 'bg-rose-500/10 text-rose-400' : 'bg-blue-500/10 text-blue-400'
                        }`}>{t.priority}</span>
                      </div>
                      <h4 className="font-bold text-white">{t.subject}</h4>
                      <div className="flex justify-between items-center text-[10px] text-slate-500 border-t border-slate-950 pt-2">
                        <span>By {t.customer}</span>
                        <span className="font-extrabold text-emerald-400">{t.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: MARKETING & CMS BUILDERS */}
          {activeTab === 'marketing' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Landing Page Builder */}
              <div className="glass border border-slate-850 rounded-3xl p-6 space-y-4 shadow-lg shadow-black/10">
                <h3 className="font-bold text-white text-base font-display border-b border-slate-900 pb-3 flex items-center space-x-2">
                  <LayoutGrid className="w-4 h-4 text-blue-400" />
                  <span>Landing Page Builder</span>
                </h3>

                {newPageSuccess && (
                  <p className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded p-2">{newPageSuccess}</p>
                )}

                <form onSubmit={handleCreateLp} className="space-y-3 text-xs font-semibold text-slate-400">
                  <div className="space-y-1">
                    <label className="block">Page Title</label>
                    <input 
                      type="text" 
                      required
                      value={newPageTitle}
                      onChange={(e) => setNewPageTitle(e.target.value)}
                      placeholder="Black Friday Mega Sale" 
                      className="w-full bg-[#0a0c14] border border-slate-800 rounded-xl p-3 text-white placeholder-slate-650 focus:outline-none" 
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block">Custom URL Slug</label>
                    <input 
                      type="text" 
                      required
                      value={newPageUrl}
                      onChange={(e) => setNewPageUrl(e.target.value)}
                      placeholder="black-friday-2026" 
                      className="w-full bg-[#0a0c14] border border-slate-800 rounded-xl p-3 text-white placeholder-slate-650 focus:outline-none" 
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition shadow-md shadow-blue-900/20"
                  >
                    Publish Page Builder Block
                  </button>
                </form>
              </div>

              {/* Published Banners */}
              <div className="lg:col-span-2 glass border border-slate-850 rounded-3xl p-6 space-y-4 shadow-lg shadow-black/10">
                <h3 className="font-bold text-white text-base font-display border-b border-slate-900 pb-3">Active Campaign Landing Pages</h3>
                <div className="space-y-3">
                  {landingPagesList.map(lp => (
                    <div key={lp.id} className="flex items-center justify-between p-4 bg-slate-900/60 border border-slate-850 rounded-2xl text-xs">
                      <div>
                        <h4 className="font-bold text-white">{lp.title}</h4>
                        <span className="text-[10px] text-slate-500 font-mono">/landing/{lp.url}</span>
                      </div>

                      <div className="flex items-center space-x-3">
                        <span className="px-2 py-0.5 rounded font-black bg-blue-500/10 text-blue-400">{lp.status}</span>
                        <Link 
                          href={`/landing/${lp.url}`}
                          className="text-[10px] text-blue-400 font-bold hover:underline"
                        >
                          Preview &rarr;
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: ANALYTICS REPORTS */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="space-y-1">
                <h2 className="text-2xl font-black font-display text-white">Sales & Marketing Analytics</h2>
                <p className="text-xs text-slate-400">Generate transactional reports, export coupon logs, and monitor conversion growth.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="glass border border-slate-850 rounded-3xl p-6 space-y-4 text-center shadow-lg shadow-black/10">
                  <h3 className="font-bold text-white text-sm">Download Sales Report (CSV)</h3>
                  <p className="text-xs text-slate-400">Generates a detailed spreadsheet of all confirmed payments and invoices.</p>
                  <button 
                    onClick={() => alert('Downloading CSV sales report...')}
                    className="mx-auto flex items-center space-x-2 py-2.5 px-6 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export CSV</span>
                  </button>
                </div>

                <div className="glass border border-slate-850 rounded-3xl p-6 space-y-4 text-center shadow-lg shadow-black/10">
                  <h3 className="font-bold text-white text-sm">Print Revenue Invoice Audit (PDF)</h3>
                  <p className="text-xs text-slate-400">Generates a branded financial audit statement summarizing monthly revenues.</p>
                  <button 
                    onClick={() => alert('Generating PDF invoice summary...')}
                    className="mx-auto flex items-center space-x-2 py-2.5 px-6 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Print PDF Audit</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: SECURITY & RBAC */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="space-y-1">
                <h2 className="text-2xl font-black font-display text-white">Role-Based Access Control (RBAC)</h2>
                <p className="text-xs text-slate-400">Set system parameters, inspect active admin directories, and trace actions.</p>
              </div>

              <div className="glass rounded-3xl p-6 border border-slate-850 shadow-lg shadow-black/10">
                <h3 className="font-bold text-white text-base font-display border-b border-slate-900 pb-3 mb-4">Administrators & Permissions Mapping</h3>
                
                <div className="space-y-3.5">
                  {[
                    { name: 'Sohidul Islam', role: 'Super Administrator', status: 'ACTIVE', logs: 'Updated catalog Sony-XM5' },
                    { name: 'Jane Doe', role: 'Marketing Lead', status: 'ACTIVE', logs: 'Created campaign Summer Splash' }
                  ].map((admin, idx) => (
                    <div key={idx} className="flex justify-between items-center p-4 bg-slate-900/60 border border-slate-850 rounded-2xl text-xs">
                      <div className="space-y-1">
                        <h4 className="font-bold text-white flex items-center">
                          <UserCheck className="w-4 h-4 text-blue-400 mr-2" />
                          <span>{admin.name}</span>
                        </h4>
                        <span className="text-[10px] text-slate-500">{admin.role} • Last Action: {admin.logs}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-500/10 text-emerald-400">{admin.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: STORE SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="space-y-1">
                <h2 className="text-2xl font-black font-display text-white">Store localized Configuration</h2>
                <p className="text-xs text-slate-400">Set payment gateways, localized currencies, API logs, and localization rules.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* General config */}
                <div className="glass rounded-3xl p-6 border border-slate-850 space-y-4 shadow-lg shadow-black/10">
                  <h3 className="font-bold text-white text-base font-display border-b border-slate-900 pb-3 flex items-center space-x-2">
                    <Settings className="w-4 h-4 text-blue-400" />
                    <span>General Store Configuration</span>
                  </h3>
                  
                  <div className="space-y-3.5 text-xs text-slate-400 font-semibold">
                    <div className="space-y-1">
                      <label className="block">Store Name</label>
                      <input type="text" defaultValue="Shopora Enterprise" className="w-full bg-[#0a0c14] border border-slate-800 rounded-xl p-3 text-white" />
                    </div>
                    <div className="space-y-1">
                      <label className="block">Support Contact Email</label>
                      <input type="email" defaultValue="support@shopora.com" className="w-full bg-[#0a0c14] border border-slate-800 rounded-xl p-3 text-white" />
                    </div>
                  </div>
                </div>

                {/* API Key management */}
                <div className="glass rounded-3xl p-6 border border-slate-850 space-y-4 shadow-lg shadow-black/10">
                  <h3 className="font-bold text-white text-base font-display border-b border-slate-900 pb-3 flex items-center space-x-2">
                    <Key className="w-4 h-4 text-blue-400" />
                    <span>API Credentials Keys</span>
                  </h3>
                  <div className="space-y-4 text-xs font-semibold">
                    <div className="p-3 bg-slate-900/60 border border-slate-850 rounded-xl flex justify-between items-center">
                      <div>
                        <span className="text-[10px] text-slate-500 block uppercase font-bold">Stripe Public Key</span>
                        <span className="text-white font-mono text-[10px]">pk_live_51P...</span>
                      </div>
                      <button onClick={() => alert('API Key copied!')} className="text-blue-450 hover:text-white text-[10px] font-bold uppercase tracking-wider">Copy</button>
                    </div>

                    <div className="p-3 bg-slate-900/60 border border-slate-850 rounded-xl flex justify-between items-center">
                      <div>
                        <span className="text-[10px] text-slate-500 block uppercase font-bold">Redis Connection Host</span>
                        <span className="text-white font-mono text-[10px]">redis://shopora-redis:6379</span>
                      </div>
                      <button onClick={() => alert('Host URI copied!')} className="text-blue-450 hover:text-white text-[10px] font-bold uppercase tracking-wider">Copy</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* 3. Global Command Palette Modal Dialog */}
      {paletteOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass border border-slate-800/50 rounded-3xl p-6 max-w-lg w-full relative shadow-2xl shadow-black/80 space-y-4">
            <button 
              onClick={() => setPaletteOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white font-bold text-lg p-2"
            >
              &times;
            </button>

            <div className="space-y-1">
              <h3 className="text-lg font-black font-display text-white">Global Command Palette Search</h3>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Search page tabs instantly</p>
            </div>

            <input 
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Type page name (e.g. settings, catalogue)..."
              className="w-full bg-[#0a0c14] border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-650 focus:outline-none focus:border-blue-500"
            />

            <div className="max-h-[250px] overflow-y-auto space-y-1.5 pt-2">
              {filteredPaletteLinks.map((lnk, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveTab(lnk.tab);
                    setPaletteOpen(false);
                    setSearchQuery('');
                  }}
                  className="w-full text-left p-3 hover:bg-slate-900/60 rounded-xl flex justify-between items-center transition text-xs"
                >
                  <span className="font-bold text-white">{lnk.title}</span>
                  <span className="text-[10px] bg-slate-900 border border-slate-850 px-2 py-0.5 rounded-lg text-slate-400 uppercase font-black">{lnk.category}</span>
                </button>
              ))}
              {filteredPaletteLinks.length === 0 && (
                <p className="text-xs text-slate-500 text-center py-4">No matching page actions found.</p>
              )}
            </div>

            <div className="border-t border-slate-900 pt-3 flex justify-between items-center text-[10px] text-slate-500 font-semibold">
              <span>Use arrow keys to navigate (mocked)</span>
              <span>ESC to exit</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

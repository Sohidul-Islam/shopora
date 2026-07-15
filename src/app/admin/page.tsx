'use client';

import { useEffect, useState } from 'react';
import { formatPrice } from '../../lib/utils';
import Link from 'next/link';
import {
  TrendingUp, Package, ShoppingBag, Users, AlertTriangle, RefreshCw, 
  Plus, Settings, Activity, Layers, Percent, BookOpen, LayoutGrid, Sparkles, Award, 
  Flame, FileText, Search, Bell, HelpCircle, Shield, 
  MapPin, CheckCircle2, ChevronRight, Copy, Download, Trash, UserCheck, Key,
  ChevronDown, DollarSign, Tag, RefreshCcw, Landmark, Users2, Calendar
} from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [paletteOpen, setPaletteOpen] = useState(false);

  // Sidebar Accordion Collapsible state
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    sales: true,
    catalog: true,
    customers: false,
    marketing: false,
    system: false
  });

  const toggleGroup = (group: string) => {
    setOpenGroups(prev => ({ ...prev, [group]: !prev[group] }));
  };

  // Notification logs
  const [notifications] = useState([
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
    customersCount: 89,
    returnsToday: 2,
    refundsToday: 1
  });

  // Mock databases
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

  const [returnsList, setReturnsList] = useState([
    { id: 'RET-001', orderId: 'ORD-1045', customer: 'Sarah Jenkins', sku: 'SONY-XM5-SLV', status: 'PENDING', date: 'Yesterday' },
    { id: 'RET-002', orderId: 'ORD-1042', customer: 'Elena Rostova', sku: 'NIKE-AM-BLK-10', status: 'RECEIVED', date: '3 days ago' }
  ]);

  const [transactionsList] = useState([
    { id: 'TXN-98402', gateway: 'STRIPE', amount: 1099.00, status: 'SUCCESS', date: '5 mins ago' },
    { id: 'TXN-98401', gateway: 'PAYPAL', amount: 348.00, status: 'SUCCESS', date: '2 hours ago' },
    { id: 'TXN-98400', gateway: 'COD', amount: 149.99, status: 'PENDING', date: 'Just now' }
  ]);

  const [categoriesList] = useState([
    { id: '1', name: 'Electronics', slug: 'electronics', parent: 'Root' },
    { id: '2', name: 'Footwear', slug: 'footwear', parent: 'Root' },
    { id: '3', name: 'Mobile Phones', slug: 'mobile-phones', parent: 'Electronics' }
  ]);

  const [brandsList] = useState([
    { id: '1', name: 'Apple Inc.', slug: 'apple', status: 'ACTIVE' },
    { id: '2', name: 'Nike', slug: 'nike', status: 'ACTIVE' },
    { id: '3', name: 'Sony', slug: 'sony', status: 'ACTIVE' }
  ]);

  const [warehousesList] = useState([
    { id: '1', name: 'San Francisco Main Depot', code: 'SF-DEPOT-01', location: '100 Main St, SF, CA' },
    { id: '2', name: 'New York Eastern Transit hub', code: 'NY-HUB-02', location: '500 Wall St, NY, NY' }
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

  const [campaignsList] = useState([
    { id: '1', title: 'Summer Season Splash', slug: 'summer-sale', code: 'SUMMER20', status: 'ACTIVE' },
    { id: '2', title: 'Black Friday Extravaganza', slug: 'black-friday', code: 'BF50', status: 'ACTIVE' }
  ]);

  const [landingPagesList, setLandingPagesList] = useState([
    { id: '1', title: 'Eid Sale 2026', url: 'eid-sale-2026', status: 'PUBLISHED' },
    { id: '2', title: 'Summer Season Launch', url: 'summer-sale', status: 'DRAFT' }
  ]);

  const [blogPostsList] = useState([
    { id: '1', title: 'The Future of Mobile Technology', author: 'Alex Mercer', readTime: '4 min read' },
    { id: '2', title: 'The Ultimate Guide to Premium Athletic Footwear', author: 'Sarah Jenkins', readTime: '6 min read' }
  ]);

  // Forms state
  const [adjustSku, setAdjustSku] = useState('SONY-XM5-SLV');
  const [adjustQty, setAdjustQty] = useState(10);
  const [stockSuccess, setStockSuccess] = useState('');

  const [newPageTitle, setNewPageTitle] = useState('');
  const [newPageUrl, setNewPageUrl] = useState('');
  const [newPageSuccess, setNewPageSuccess] = useState('');

  // Keyboard shortcut listener
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

  // Command palette configuration indexing all sub-tabs
  const commandPaletteLinks = [
    { title: 'Overview Dashboard', tab: 'dashboard', category: 'General' },
    { title: 'Orders Fulfillment List', tab: 'orders', category: 'Sales' },
    { title: 'Returns & Exchanges Tracker', tab: 'returns', category: 'Sales' },
    { title: 'Payments & Transactions', tab: 'payments', category: 'Sales' },
    { title: 'Products Catalogue', tab: 'products', category: 'Catalog' },
    { title: 'Categories Tree', tab: 'categories', category: 'Catalog' },
    { title: 'Brands Partner List', tab: 'brands', category: 'Catalog' },
    { title: 'Inventory Warehouses', tab: 'warehouses', category: 'Catalog' },
    { title: 'Customers Directory', tab: 'customers', category: 'Customers' },
    { title: 'Support Ticket Board', tab: 'tickets', category: 'Customers' },
    { title: 'Campaigns & Coupons', tab: 'campaigns', category: 'Marketing' },
    { title: 'Landing Page Builder', tab: 'landing', category: 'Marketing' },
    { title: 'Blog CMS Publisher', tab: 'blog', category: 'Marketing' },
    { title: 'Sales Reports & Analytics', tab: 'analytics', category: 'Reports' },
    { title: 'RBAC Staff Administrators', tab: 'users', category: 'System' },
    { title: 'Store System Settings', tab: 'settings', category: 'System' }
  ];

  const filteredPaletteLinks = commandPaletteLinks.filter(lnk =>
    lnk.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lnk.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#05060b] via-[#090b11] to-[#040508] text-slate-100 flex">
      
      {/* 1. COLLAPSIBLE ACCORDION SIDEBAR */}
      <aside className="w-64 bg-[#06080e]/95 border-r border-slate-900/60 p-5 flex flex-col justify-between shrink-0 hidden md:flex">
        <div className="space-y-6">
          <div className="flex items-center space-x-2 px-3">
            <Sparkles className="w-5 h-5 text-blue-400" />
            <span className="text-base font-black font-display tracking-tight text-white uppercase">Shopora Admin</span>
          </div>

          <nav className="space-y-4">
            {/* Dashboard Link */}
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center space-x-3 py-2 px-3 text-xs font-bold rounded-xl transition ${
                activeTab === 'dashboard' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Overview Dashboard</span>
            </button>

            {/* GROUP A: Sales Operations */}
            <div className="space-y-1">
              <button 
                onClick={() => toggleGroup('sales')}
                className="w-full flex items-center justify-between py-1.5 px-3 text-[10px] text-slate-500 uppercase font-black tracking-widest hover:text-white transition"
              >
                <span>Sales Operations</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${openGroups.sales ? 'rotate-180' : ''}`} />
              </button>
              {openGroups.sales && (
                <div className="pl-3 space-y-1">
                  {[
                    { label: 'Orders List', tab: 'orders', icon: ShoppingBag },
                    { label: 'Returns & Refunds', tab: 'returns', icon: RefreshCcw },
                    { label: 'Payments & Txns', tab: 'payments', icon: Landmark }
                  ].map((sub, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setActiveTab(sub.tab)}
                      className={`w-full flex items-center space-x-2.5 py-1.5 px-2.5 text-xs font-semibold rounded-lg transition ${
                        activeTab === sub.tab ? 'text-blue-400 bg-blue-500/5' : 'text-slate-400 hover:text-white hover:bg-slate-900/40'
                      }`}
                    >
                      <sub.icon className="w-3.5 h-3.5" />
                      <span>{sub.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* GROUP B: Catalog Management */}
            <div className="space-y-1">
              <button 
                onClick={() => toggleGroup('catalog')}
                className="w-full flex items-center justify-between py-1.5 px-3 text-[10px] text-slate-500 uppercase font-black tracking-widest hover:text-white transition"
              >
                <span>Catalog System</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${openGroups.catalog ? 'rotate-180' : ''}`} />
              </button>
              {openGroups.catalog && (
                <div className="pl-3 space-y-1">
                  {[
                    { label: 'Products Catalogue', tab: 'products', icon: Package },
                    { label: 'Categories Tree', tab: 'categories', icon: LayoutGrid },
                    { label: 'Brand Partners', tab: 'brands', icon: Award },
                    { label: 'Depots & Warehouses', tab: 'warehouses', icon: MapPin }
                  ].map((sub, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setActiveTab(sub.tab)}
                      className={`w-full flex items-center space-x-2.5 py-1.5 px-2.5 text-xs font-semibold rounded-lg transition ${
                        activeTab === sub.tab ? 'text-blue-400 bg-blue-500/5' : 'text-slate-400 hover:text-white hover:bg-slate-900/40'
                      }`}
                    >
                      <sub.icon className="w-3.5 h-3.5" />
                      <span>{sub.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* GROUP C: Customer Relationship */}
            <div className="space-y-1">
              <button 
                onClick={() => toggleGroup('customers')}
                className="w-full flex items-center justify-between py-1.5 px-3 text-[10px] text-slate-500 uppercase font-black tracking-widest hover:text-white transition"
              >
                <span>Customers</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${openGroups.customers ? 'rotate-180' : ''}`} />
              </button>
              {openGroups.customers && (
                <div className="pl-3 space-y-1">
                  {[
                    { label: 'Customer Directory', tab: 'customers', icon: Users },
                    { label: 'Support Tickets', tab: 'tickets', icon: HelpCircle }
                  ].map((sub, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setActiveTab(sub.tab)}
                      className={`w-full flex items-center space-x-2.5 py-1.5 px-2.5 text-xs font-semibold rounded-lg transition ${
                        activeTab === sub.tab ? 'text-blue-400 bg-blue-500/5' : 'text-slate-400 hover:text-white hover:bg-slate-900/40'
                      }`}
                    >
                      <sub.icon className="w-3.5 h-3.5" />
                      <span>{sub.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* GROUP D: Marketing & CMS */}
            <div className="space-y-1">
              <button 
                onClick={() => toggleGroup('marketing')}
                className="w-full flex items-center justify-between py-1.5 px-3 text-[10px] text-slate-500 uppercase font-black tracking-widest hover:text-white transition"
              >
                <span>Marketing & CMS</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${openGroups.marketing ? 'rotate-180' : ''}`} />
              </button>
              {openGroups.marketing && (
                <div className="pl-3 space-y-1">
                  {[
                    { label: 'Campaigns & Coupons', tab: 'campaigns', icon: Flame },
                    { label: 'Landing Page Builder', tab: 'landing', icon: LayoutGrid },
                    { label: 'Blog CMS Publisher', tab: 'blog', icon: BookOpen }
                  ].map((sub, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setActiveTab(sub.tab)}
                      className={`w-full flex items-center space-x-2.5 py-1.5 px-2.5 text-xs font-semibold rounded-lg transition ${
                        activeTab === sub.tab ? 'text-blue-400 bg-blue-500/5' : 'text-slate-400 hover:text-white hover:bg-slate-900/40'
                      }`}
                    >
                      <sub.icon className="w-3.5 h-3.5" />
                      <span>{sub.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* GROUP E: System & Settings */}
            <div className="space-y-1">
              <button 
                onClick={() => toggleGroup('system')}
                className="w-full flex items-center justify-between py-1.5 px-3 text-[10px] text-slate-500 uppercase font-black tracking-widest hover:text-white transition"
              >
                <span>System</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${openGroups.system ? 'rotate-180' : ''}`} />
              </button>
              {openGroups.system && (
                <div className="pl-3 space-y-1">
                  {[
                    { label: 'RBAC Administrators', tab: 'users', icon: Shield },
                    { label: 'Store Settings', tab: 'settings', icon: Settings },
                    { label: 'Analytics Reports', tab: 'analytics', icon: TrendingUp }
                  ].map((sub, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setActiveTab(sub.tab)}
                      className={`w-full flex items-center space-x-2.5 py-1.5 px-2.5 text-xs font-semibold rounded-lg transition ${
                        activeTab === sub.tab ? 'text-blue-400 bg-blue-500/5' : 'text-slate-400 hover:text-white hover:bg-slate-900/40'
                      }`}
                    >
                      <sub.icon className="w-3.5 h-3.5" />
                      <span>{sub.label}</span>
                    </button>
                  ))}
                </div>
              )}
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

      {/* 2. Main Content Frame */}
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
            <span className="hidden sm:inline-flex items-center space-x-1.5 text-[10px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-extrabold uppercase px-2.5 py-1 rounded-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>Live Mode</span>
            </span>
          </div>
        </header>

        {/* Dynamic Panel Content Area */}
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

          {/* TAB 2: ORDERS LIST */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="space-y-1">
                <h2 className="text-2xl font-black font-display text-white">Customer Orders Fulfillments</h2>
                <p className="text-xs text-slate-400">Manage orders lifecycle, shipment statuses, and payment states.</p>
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
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: RETURNS & REFUNDS */}
          {activeTab === 'returns' && (
            <div className="space-y-6">
              <div className="space-y-1">
                <h2 className="text-2xl font-black font-display text-white">Returns & Exchange Requests</h2>
                <p className="text-xs text-slate-400">Monitor returned models, verify package condition, and trigger payment refunds.</p>
              </div>

              <div className="glass rounded-3xl p-6 border border-slate-850 shadow-lg shadow-black/10">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="text-slate-500 border-b border-slate-900 font-extrabold uppercase tracking-wider">
                        <th className="py-3">Return ID</th>
                        <th className="py-3">Order ID</th>
                        <th className="py-3">Customer</th>
                        <th className="py-3">Item Sku</th>
                        <th className="py-3">Requested</th>
                        <th className="py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900/60">
                      {returnsList.map(ret => (
                        <tr key={ret.id} className="text-slate-300 font-semibold">
                          <td className="py-4 font-mono text-blue-400">{ret.id}</td>
                          <td className="py-4 font-mono">{ret.orderId}</td>
                          <td className="py-4">{ret.customer}</td>
                          <td className="py-4">{ret.sku}</td>
                          <td className="py-4">{ret.date}</td>
                          <td className="py-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              ret.status === 'RECEIVED' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                            }`}>{ret.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PAYMENTS & TRANSACTIONS */}
          {activeTab === 'payments' && (
            <div className="space-y-6">
              <div className="space-y-1">
                <h2 className="text-2xl font-black font-display text-white">Gateway Transactions Audit</h2>
                <p className="text-xs text-slate-400">Trace transactional status, merchant adapter transfers, and raw responses.</p>
              </div>

              <div className="glass rounded-3xl p-6 border border-slate-850 shadow-lg shadow-black/10">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="text-slate-500 border-b border-slate-900 font-extrabold uppercase tracking-wider">
                        <th className="py-3">Transaction ID</th>
                        <th className="py-3">Gateway</th>
                        <th className="py-3">Amount</th>
                        <th className="py-3">Status</th>
                        <th className="py-3">Created</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900/60">
                      {transactionsList.map(txn => (
                        <tr key={txn.id} className="text-slate-300 font-semibold">
                          <td className="py-4 font-mono text-blue-400">{txn.id}</td>
                          <td className="py-4">{txn.gateway}</td>
                          <td className="py-4">{formatPrice(txn.amount)}</td>
                          <td className="py-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                              txn.status === 'SUCCESS' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                            }`}>{txn.status}</span>
                          </td>
                          <td className="py-4">{txn.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: PRODUCTS CATALOGUE */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="space-y-1">
                <h2 className="text-2xl font-black font-display text-white">Active Product Catalogue</h2>
                <p className="text-xs text-slate-400">Edit model descriptions, manage status variables, and trace regular prices.</p>
              </div>

              <div className="glass rounded-3xl p-6 border border-slate-850 shadow-lg shadow-black/10">
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
            </div>
          )}

          {/* TAB 6: CATEGORIES TREE */}
          {activeTab === 'categories' && (
            <div className="space-y-6">
              <div className="space-y-1">
                <h2 className="text-2xl font-black font-display text-white">Categories tree & Hierarchy</h2>
                <p className="text-xs text-slate-400">Map parent relationships and define visible tags.</p>
              </div>

              <div className="glass rounded-3xl p-6 border border-slate-850 shadow-lg shadow-black/10">
                <div className="space-y-3">
                  {categoriesList.map(cat => (
                    <div key={cat.id} className="flex justify-between items-center p-4 bg-slate-900/60 border border-slate-850 rounded-2xl text-xs">
                      <div>
                        <h4 className="font-bold text-white">{cat.name}</h4>
                        <span className="text-[10px] text-slate-500">Slug: /category/{cat.slug}</span>
                      </div>
                      <span className="px-2 py-1 rounded bg-[#0a0c14] border border-slate-800 text-[10px] font-bold text-slate-400">Parent: {cat.parent}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: BRANDS PARTNERS */}
          {activeTab === 'brands' && (
            <div className="space-y-6">
              <div className="space-y-1">
                <h2 className="text-2xl font-black font-display text-white">Official Brand Partners</h2>
                <p className="text-xs text-slate-400">Manage brand registry details and logo configurations.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {brandsList.map(br => (
                  <div key={br.id} className="glass rounded-3xl p-6 border border-slate-850 space-y-4 shadow-lg shadow-black/10">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-extrabold">{br.status}</span>
                    <h3 className="text-xl font-bold font-display text-white">{br.name}</h3>
                    <p className="text-xs text-slate-500">Slug: /brand/{br.slug}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: DEPOTS & WAREHOUSES */}
          {activeTab === 'warehouses' && (
            <div className="space-y-8">
              <div className="space-y-1">
                <h2 className="text-2xl font-black font-display text-white">Warehouses & Depots</h2>
                <p className="text-xs text-slate-400">Manage multiple fulfillment depot sites and stocks.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Depot list */}
                <div className="lg:col-span-2 glass rounded-3xl p-6 border border-slate-850 space-y-4 shadow-lg shadow-black/10">
                  <h3 className="font-bold text-white text-base font-display border-b border-slate-900 pb-3">Active Warehouses</h3>
                  <div className="space-y-3.5">
                    {warehousesList.map(wh => (
                      <div key={wh.id} className="p-4 bg-slate-900/60 border border-slate-850 rounded-2xl space-y-2 text-xs">
                        <div className="flex justify-between items-center">
                          <h4 className="font-bold text-white">{wh.name}</h4>
                          <span className="font-mono text-blue-400 font-bold">{wh.code}</span>
                        </div>
                        <p className="text-[10px] text-slate-400 flex items-center">
                          <MapPin className="w-3.5 h-3.5 text-slate-500 mr-1.5" />
                          <span>{wh.location}</span>
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Restock adjuster */}
                <div className="glass rounded-3xl p-6 border border-slate-850 space-y-4 shadow-lg shadow-black/10 animate-in fade-in duration-300">
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
                        className="w-full bg-[#0a0c14] border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
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
                        className="w-full bg-[#0a0c14] border border-slate-800 rounded-xl p-3 text-white font-mono focus:outline-none focus:border-blue-500" 
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

          {/* TAB 9: CUSTOMERS DIRECTORY */}
          {activeTab === 'customers' && (
            <div className="space-y-6">
              <div className="space-y-1">
                <h2 className="text-2xl font-black font-display text-white">Customers Directory</h2>
                <p className="text-xs text-slate-400">Audit reward point balances, registration timelines, and lifetime orders.</p>
              </div>

              <div className="glass rounded-3xl p-6 border border-slate-850 shadow-lg shadow-black/10">
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
            </div>
          )}

          {/* TAB 10: SUPPORT TICKETS */}
          {activeTab === 'tickets' && (
            <div className="space-y-6">
              <div className="space-y-1">
                <h2 className="text-2xl font-black font-display text-white">Support Center Tickets</h2>
                <p className="text-xs text-slate-400">Audit priority queues and resolve variant discrepancy tickets.</p>
              </div>

              <div className="glass rounded-3xl p-6 border border-slate-850 space-y-4 shadow-lg shadow-black/10 max-w-2xl">
                {supportTickets.map(t => (
                  <div key={t.id} className="p-4 bg-slate-900/60 border border-slate-850 rounded-2xl space-y-2 text-xs">
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
          )}

          {/* TAB 11: CAMPAIGNS & COUPONS */}
          {activeTab === 'campaigns' && (
            <div className="space-y-6">
              <div className="space-y-1">
                <h2 className="text-2xl font-black font-display text-white">Campaigns & Promo Coupons</h2>
                <p className="text-xs text-slate-400">Activate seasonal sale banners and configure coupon codes.</p>
              </div>

              <div className="glass rounded-3xl p-6 border border-slate-850 shadow-lg shadow-black/10">
                <div className="space-y-3">
                  {campaignsList.map(camp => (
                    <div key={camp.id} className="flex justify-between items-center p-4 bg-slate-900/60 border border-slate-850 rounded-2xl text-xs">
                      <div>
                        <h4 className="font-bold text-white">{camp.title}</h4>
                        <span className="text-[10px] text-slate-500">Slug: /campaign/{camp.slug}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="px-2.5 py-1 rounded bg-[#0a0c14] border border-slate-800 text-[10px] font-black text-blue-400 font-mono">{camp.code}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-500/10 text-emerald-400">{camp.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 12: LANDING PAGES */}
          {activeTab === 'landing' && (
            <div className="space-y-8">
              <div className="space-y-1">
                <h2 className="text-2xl font-black font-display text-white">Custom Landing Pages Builder</h2>
                <p className="text-xs text-slate-400">Publish product marketing templates without code deployments.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Custom Page Builder */}
                <div className="glass border border-slate-850 rounded-3xl p-6 space-y-4 shadow-lg shadow-black/10 h-fit">
                  <h3 className="font-bold text-white text-base font-display border-b border-slate-900 pb-3 flex items-center space-x-2">
                    <LayoutGrid className="w-4 h-4 text-blue-400" />
                    <span>Landing Page Builder</span>
                  </h3>

                  {newPageSuccess && (
                    <p className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded p-2">{newPageSuccess}</p>
                  )}

                  <form onSubmit={handleCreateLp} className="space-y-3.5 text-xs font-semibold text-slate-400">
                    <div className="space-y-1">
                      <label className="block">Page Title</label>
                      <input 
                        type="text" 
                        required
                        value={newPageTitle}
                        onChange={(e) => setNewPageTitle(e.target.value)}
                        placeholder="Black Friday Mega Sale" 
                        className="w-full bg-[#0a0c14] border border-slate-800 rounded-xl p-3 text-white placeholder-slate-650 focus:outline-none focus:border-blue-500" 
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
                        className="w-full bg-[#0a0c14] border border-slate-800 rounded-xl p-3 text-white placeholder-slate-650 focus:outline-none focus:border-blue-500" 
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

                {/* Published pages list */}
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
            </div>
          )}

          {/* TAB 13: BLOG CMS */}
          {activeTab === 'blog' && (
            <div className="space-y-6">
              <div className="space-y-1">
                <h2 className="text-2xl font-black font-display text-white">Blog CMS Articles</h2>
                <p className="text-xs text-slate-400">Publish press releases and product writeups.</p>
              </div>

              <div className="glass rounded-3xl p-6 border border-slate-850 shadow-lg shadow-black/10 max-w-3xl">
                <div className="space-y-3">
                  {blogPostsList.map(post => (
                    <div key={post.id} className="flex justify-between items-center p-4 bg-slate-900/60 border border-slate-850 rounded-2xl text-xs">
                      <div>
                        <h4 className="font-bold text-white">{post.title}</h4>
                        <span className="text-[10px] text-slate-500">By {post.author} • {post.readTime}</span>
                      </div>
                      <Link href="/blog" className="text-xs text-blue-400 font-bold hover:underline">View Blog</Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 14: ANALYTICS REPORTS */}
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

          {/* TAB 15: ADMINISTRATORS */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="space-y-1">
                <h2 className="text-2xl font-black font-display text-white">Role-Based Access Control (RBAC)</h2>
                <p className="text-xs text-slate-400">Set system parameters, inspect active admin directories, and trace actions.</p>
              </div>

              <div className="glass rounded-3xl p-6 border border-slate-850 shadow-lg shadow-black/10 max-w-3xl">
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

          {/* TAB 16: STORE SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="space-y-1">
                <h2 className="text-2xl font-black font-display text-white">Store Localized Configuration</h2>
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
                      <input type="text" defaultValue="Shopora Enterprise" className="w-full bg-[#0a0c14] border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500" />
                    </div>
                    <div className="space-y-1">
                      <label className="block">Support Contact Email</label>
                      <input type="email" defaultValue="support@shopora.com" className="w-full bg-[#0a0c14] border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500" />
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
                      <button onClick={() => alert('API Key copied!')} className="text-blue-400 hover:text-white text-[10px] font-bold uppercase tracking-wider transition">Copy</button>
                    </div>

                    <div className="p-3 bg-slate-900/60 border border-slate-850 rounded-xl flex justify-between items-center">
                      <div>
                        <span className="text-[10px] text-slate-500 block uppercase font-bold">Redis Connection Host</span>
                        <span className="text-white font-mono text-[10px]">redis://shopora-redis:6379</span>
                      </div>
                      <button onClick={() => alert('Host URI copied!')} className="text-blue-400 hover:text-white text-[10px] font-bold uppercase tracking-wider transition">Copy</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* 3. Global Command Palette Modal */}
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
              placeholder="Type page name (e.g. settings, returns, categories)..."
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

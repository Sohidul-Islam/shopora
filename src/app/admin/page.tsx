'use client';

import { useEffect, useState } from 'react';
import { formatPrice } from '../../lib/utils';
import Link from 'next/link';
import {
  TrendingUp, Package, ShoppingBag, Users, AlertTriangle, RefreshCw, 
  Settings, Activity, Layers, Percent, BookOpen, LayoutGrid, Sparkles, Award, Plus,
  Flame, FileText, Search, Bell, HelpCircle, Shield, 
  MapPin, CheckCircle2, ChevronRight, Copy, Download, Trash, UserCheck, Key,
  ChevronDown, DollarSign, Tag, RefreshCcw, Landmark, Users2, Calendar,
  Truck, Star, Globe, Info, Terminal, Briefcase, Mail, Send, Edit, X
} from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [paletteOpen, setPaletteOpen] = useState(false);

  // Sidebar accordion groups state
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    sales: true,
    catalog: true,
    customers: true,
    marketing: true,
    content: true,
    system: true
  });

  const toggleGroup = (group: string) => {
    setOpenGroups(prev => ({ ...prev, [group]: !prev[group] }));
  };

  // ── API-connected state ───────────────────────────────────────────────────────
  const [productsList, setProductsList] = useState<any[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productsError, setProductsError] = useState('');

  const [apiToast, setApiToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setApiToast({ msg, type });
    setTimeout(() => setApiToast(null), 3500);
  };

  const fetchProducts = async () => {
    setProductsLoading(true);
    setProductsError('');
    try {
      const res = await fetch('/api/admin/products');
      const data = await res.json();
      if (data.success) setProductsList(data.products);
      else setProductsError(data.error || 'Failed to load products');
    } catch {
      setProductsError('Network error — could not load products');
    } finally {
      setProductsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/admin/categories');
      const data = await res.json();
      if (data.success) setCategoriesList(data.categories);
    } catch {}
  };

  const fetchBrands = async () => {
    try {
      const res = await fetch('/api/admin/brands');
      const data = await res.json();
      if (data.success) setBrandsList(data.brands);
    } catch {}
  };

  useEffect(() => { fetchProducts(); }, []);
  useEffect(() => { fetchCategories(); }, []);
  useEffect(() => { fetchBrands(); }, []);

  const [ordersList] = useState([
    { id: 'ORD-1049', customer: 'Sarah Jenkins', total: 1099.00, status: 'CONFIRMED', gateway: 'STRIPE', date: '5 mins ago' },
    { id: 'ORD-1048', customer: 'David Chen', total: 149.99, status: 'PENDING', gateway: 'COD', date: '25 mins ago' },
    { id: 'ORD-1047', customer: 'Elena Rostova', total: 348.00, status: 'DELIVERED', gateway: 'PAYPAL', date: '2 hours ago' }
  ]);

  const [returnsList] = useState([
    { id: 'RET-001', orderId: 'ORD-1045', customer: 'Sarah Jenkins', sku: 'SONY-XM5-SLV', status: 'PENDING', date: 'Yesterday' },
    { id: 'RET-002', orderId: 'ORD-1042', customer: 'Elena Rostova', sku: 'NIKE-AM-BLK-10', status: 'RECEIVED', date: '3 days ago' }
  ]);

  const [transactionsList] = useState([
    { id: 'TXN-98402', gateway: 'STRIPE', amount: 1099.00, status: 'SUCCESS', date: '5 mins ago' },
    { id: 'TXN-98401', gateway: 'PAYPAL', amount: 348.00, status: 'SUCCESS', date: '2 hours ago' }
  ]);

  const [invoicesList] = useState([
    { id: 'INV-2026-001', orderId: 'ORD-1049', total: 1099.00, tax: 82.43, status: 'PAID', date: '5 mins ago' },
    { id: 'INV-2026-002', orderId: 'ORD-1047', total: 348.00, tax: 26.10, status: 'PAID', date: '2 hours ago' }
  ]);

  const [categoriesList, setCategoriesList] = useState<any[]>([]);
  const [brandsList, setBrandsList] = useState<any[]>([]);

  const [warehousesList] = useState([
    { id: '1', name: 'San Francisco Main Depot', code: 'SF-DEPOT-01', location: '100 Main St, SF, CA' },
    { id: '2', name: 'New York Eastern Transit hub', code: 'NY-HUB-02', location: '500 Wall St, NY, NY' }
  ]);

  const [suppliersList] = useState([
    { id: 'SUP-001', name: 'Silicon Valley Logistics', contact: 'shipping@svlogistics.com', phone: '+1-555-0199' },
    { id: 'SUP-002', name: 'Apex Footwear Wholesalers', contact: 'info@apexfootwear.com', phone: '+1-555-0284' }
  ]);

  const [transfersList] = useState([
    { id: 'TRF-301', from: 'SF-DEPOT-01', to: 'NY-HUB-02', sku: 'SONY-XM5-SLV', quantity: 50, status: 'IN_TRANSIT' }
  ]);

  const [customersList] = useState([
    { id: 'CUST-001', name: 'Sarah Jenkins', email: 'sarah@example.com', points: 420, tier: 'VIP Gold', orders: 4 },
    { id: 'CUST-002', name: 'David Chen', email: 'david.c@example.com', points: 150, tier: 'Standard member', orders: 1 },
    { id: 'CUST-003', name: 'Elena Rostova', email: 'elena.r@example.com', points: 780, tier: 'VIP Platinum', orders: 7 }
  ]);

  const [reviewsList] = useState([
    { id: 'REV-901', product: 'Sony WH-1000XM5', customer: 'Sarah Jenkins', rating: 5, comment: 'Incredible noise cancelling!', status: 'APPROVED' },
    { id: 'REV-902', product: 'Nike Air Max Running Shoes', customer: 'David Chen', rating: 4, comment: 'Very comfortable daily wear.', status: 'PENDING' }
  ]);

  const [supportTickets] = useState([
    { id: 'TKT-102', subject: 'Refund delay status', customer: 'Sarah Jenkins', priority: 'HIGH', status: 'OPEN' },
    { id: 'TKT-101', subject: 'Variant SKU mismatch', customer: 'David Chen', priority: 'MEDIUM', status: 'RESOLVED' }
  ]);

  const [campaignsList] = useState([
    { id: '1', title: 'Summer Season Splash', slug: 'summer-sale', code: 'SUMMER20', discount: '20% OFF' },
    { id: '2', title: 'Black Friday Extravaganza', slug: 'black-friday', code: 'BF50', discount: '50% OFF' }
  ]);

  const [landingPagesList, setLandingPagesList] = useState([
    { id: '1', title: 'Eid Sale 2026', url: 'eid-sale-2026', status: 'PUBLISHED' },
    { id: '2', title: 'Summer Season Launch', url: 'summer-sale', status: 'DRAFT' }
  ]);

  const [blogPostsList] = useState([
    { id: '1', title: 'The Future of Mobile Technology', author: 'Alex Mercer', readTime: '4 min read' },
    { id: '2', title: 'The Ultimate Guide to Premium Footwear', author: 'Sarah Jenkins', readTime: '6 min read' }
  ]);

  const [faqsList] = useState([
    { id: '1', question: 'How do I track my order?', answer: 'You can check your order delivery status timeline in your customer dashboard.' },
    { id: '2', question: 'What is your refund policy?', answer: 'We offer a 30-day money-back guarantee with prepaid return shipping labels.' }
  ]);

  const [announcementsList] = useState([
    { id: '1', text: 'Free shipping on all orders over $150!', active: true },
    { id: '2', text: 'Maintenance downtime scheduled for Sunday at 02:00 AM UTC.', active: false }
  ]);

  const [activityLogs] = useState([
    { id: '1', admin: 'Sohidul Islam', action: 'Restocked SONY-XM5-SLV (10 units)', ip: '192.168.1.42', date: '10 mins ago' },
    { id: '2', admin: 'Jane Doe', action: 'Published campaign Summer Season Splash', ip: '192.168.1.105', date: '1 hour ago' }
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

  // Forms state
  const [adjustSku, setAdjustSku] = useState('SONY-XM5-SLV');
  const [adjustQty, setAdjustQty] = useState(10);
  const [stockSuccess, setStockSuccess] = useState('');

  const [newPageTitle, setNewPageTitle] = useState('');
  const [newPageUrl, setNewPageUrl] = useState('');
  const [newPageSuccess, setNewPageSuccess] = useState('');

  // SEO Config Form
  const [seoTitle, setSeoTitle] = useState('Shopora E-commerce Store');
  const [seoDesc, setSeoDesc] = useState('Shop premium electronics, athletic footwear, and apparel at Shopora.');
  const [seoSaved, setSeoSaved] = useState(false);

  // CRUD Interactive Modals/Form States
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [prodFormSaving, setProdFormSaving] = useState(false);
  const [prodForm, setProdForm] = useState({ name: '', slug: '', sku: '', brandId: '', price: '', salePrice: '', description: '', status: 'DRAFT', categoryIds: [] as string[] });

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [catFormSaving, setCatFormSaving] = useState(false);
  const [catForm, setCatForm] = useState({ name: '', slug: '', parentId: '', visible: true, featured: false });

  const [showBrandModal, setShowBrandModal] = useState(false);
  const [editingBrand, setEditingBrand] = useState<any>(null);
  const [brandFormSaving, setBrandFormSaving] = useState(false);
  const [brandForm, setBrandForm] = useState({ name: '', slug: '', status: 'ACTIVE' });

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

  // Slug auto-generator
  const toSlug = (str: string) => str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  // Products CRUD handlers
  const openAddProduct = () => {
    setEditingProduct(null);
    setProdForm({ name: '', slug: '', sku: '', brandId: '', price: '', salePrice: '', description: '', status: 'DRAFT', categoryIds: [] });
    setShowProductModal(true);
  };

  const openEditProduct = (p: any) => {
    setEditingProduct(p);
    setProdForm({
      name: p.name || '',
      slug: p.slug || '',
      sku: p.sku || '',
      brandId: p.brandId || p.brand?.id || '',
      price: String(p.price || ''),
      salePrice: String(p.salePrice || ''),
      description: p.description || '',
      status: p.status || 'DRAFT',
      categoryIds: (p.productCategories || []).map((pc: any) => pc.categoryId || pc.category?.id).filter(Boolean),
    });
    setShowProductModal(true);
  };

  const saveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setProdFormSaving(true);
    try {
      const payload = { ...prodForm, price: String(prodForm.price), salePrice: prodForm.salePrice ? String(prodForm.salePrice) : undefined };
      const url = editingProduct ? `/api/admin/products/${editingProduct.id}` : '/api/admin/products';
      const method = editingProduct ? 'PATCH' : 'POST';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      showToast(editingProduct ? 'Product updated successfully!' : 'Product created successfully!');
      setShowProductModal(false);
      fetchProducts();
    } catch (err: any) {
      showToast(err.message || 'Failed to save product', 'error');
    } finally {
      setProdFormSaving(false);
    }
  };

  const toggleProductStatus = async (p: any) => {
    const newStatus = p.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    try {
      const res = await fetch(`/api/admin/products/${p.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: newStatus }) });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      showToast(`Product ${newStatus === 'PUBLISHED' ? 'published' : 'set to draft'}.`);
      fetchProducts();
    } catch (err: any) {
      showToast(err.message || 'Failed to update status', 'error');
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to remove this product? This is a soft delete.')) return;
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      showToast('Product deleted successfully.');
      fetchProducts();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete product', 'error');
    }
  };

  // Categories CRUD handlers
  const openAddCategory = () => {
    setEditingCategory(null);
    setCatForm({ name: '', slug: '', parentId: '', visible: true, featured: false });
    setShowCategoryModal(true);
  };

  const openEditCategory = (c: any) => {
    setEditingCategory(c);
    setCatForm({ name: c.name, slug: c.slug, parentId: c.parentId || '', visible: c.visible ?? true, featured: c.featured ?? false });
    setShowCategoryModal(true);
  };

  const saveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setCatFormSaving(true);
    try {
      const payload = { ...catForm, parentId: catForm.parentId || null };
      const url = editingCategory ? `/api/admin/categories/${editingCategory.id}` : '/api/admin/categories';
      const method = editingCategory ? 'PATCH' : 'POST';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      showToast(editingCategory ? 'Category updated!' : 'Category created!');
      setShowCategoryModal(false);
      fetchCategories();
    } catch (err: any) {
      showToast(err.message || 'Failed to save category', 'error');
    } finally {
      setCatFormSaving(false);
    }
  };

  const deleteCategory = async (id: string) => {
    if (!confirm('Delete this category? Sub-categories will become root nodes.')) return;
    try {
      const res = await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      showToast('Category deleted.');
      fetchCategories();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete category', 'error');
    }
  };

  // Brands CRUD handlers
  const openAddBrand = () => {
    setEditingBrand(null);
    setBrandForm({ name: '', slug: '', status: 'ACTIVE' });
    setShowBrandModal(true);
  };

  const openEditBrand = (b: any) => {
    setEditingBrand(b);
    setBrandForm({ name: b.name, slug: b.slug, status: b.status });
    setShowBrandModal(true);
  };

  const saveBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    setBrandFormSaving(true);
    try {
      const url = editingBrand ? `/api/admin/brands/${editingBrand.id}` : '/api/admin/brands';
      const method = editingBrand ? 'PATCH' : 'POST';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(brandForm) });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      showToast(editingBrand ? 'Brand updated!' : 'Brand registered!');
      setShowBrandModal(false);
      fetchBrands();
    } catch (err: any) {
      showToast(err.message || 'Failed to save brand', 'error');
    } finally {
      setBrandFormSaving(false);
    }
  };

  const deleteBrand = async (id: string) => {
    if (!confirm('Remove this brand? Products will have their brand unlinked.')) return;
    try {
      const res = await fetch(`/api/admin/brands/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      showToast('Brand deleted.');
      fetchBrands();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete brand', 'error');
    }
  };

  // Command Palette links
  const commandPaletteLinks = [
    { title: 'Overview Dashboard', tab: 'dashboard', category: 'General' },
    { title: 'Orders Fulfillments', tab: 'orders', category: 'Sales' },
    { title: 'Returns & Refunds', tab: 'returns', category: 'Sales' },
    { title: 'Invoices Audit', tab: 'invoices', category: 'Sales' },
    { title: 'Payment logs', tab: 'payments', category: 'Sales' },
    { title: 'Products Catalogue', tab: 'products', category: 'Catalog' },
    { title: 'Categories Tree', tab: 'categories', category: 'Catalog' },
    { title: 'Brand Partners', tab: 'brands', category: 'Catalog' },
    { title: 'Depots & Warehouses', tab: 'warehouses', category: 'Catalog' },
    { title: 'Stock Transfers', tab: 'transfers', category: 'Catalog' },
    { title: 'Suppliers Registry', tab: 'suppliers', category: 'Catalog' },
    { title: 'Customers Directory', tab: 'customers', category: 'Customers' },
    { title: 'Customer Groups & Tiers', tab: 'groups', category: 'Customers' },
    { title: 'Product Reviews', tab: 'reviews', category: 'Customers' },
    { title: 'Support Tickets', tab: 'tickets', category: 'Customers' },
    { title: 'Campaigns & Coupons', tab: 'campaigns', category: 'Marketing' },
    { title: 'Landing Page Builder', tab: 'landing', category: 'Marketing' },
    { title: 'Blog Articles', tab: 'blog', category: 'Marketing' },
    { title: 'SEO Metadata', tab: 'seo', category: 'Marketing' },
    { title: 'Announcement Bars', tab: 'announcements', category: 'Content' },
    { title: 'FAQ Accordions', tab: 'faqs', category: 'Content' },
    { title: 'Reports & Exports', tab: 'analytics', category: 'Reports' },
    { title: 'RBAC Staff Administrators', tab: 'users', category: 'System' },
    { title: 'Activity logs', tab: 'logs', category: 'System' },
    { title: 'Store settings', tab: 'settings', category: 'System' }
  ];

  const filteredPaletteLinks = commandPaletteLinks.filter(lnk =>
    lnk.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lnk.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#05060b] via-[#090b11] to-[#040508] text-slate-100 flex">
      {/* Global API Toast */}
      {apiToast && (
        <div className={`fixed top-5 right-5 z-[100] px-5 py-3 rounded-2xl text-xs font-bold shadow-2xl border transition-all ${
          apiToast.type === 'success'
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
        }`}>
          {apiToast.type === 'success' ? '✓' : '✗'} {apiToast.msg}
        </div>
      )}
      
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
                    { label: 'Invoices Audit', tab: 'invoices', icon: FileText },
                    { label: 'Payments Logs', tab: 'payments', icon: Landmark }
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
                    { label: 'Depots & Warehouses', tab: 'warehouses', icon: MapPin },
                    { label: 'Stock Transfers', tab: 'transfers', icon: RefreshCw },
                    { label: 'Suppliers Registry', tab: 'suppliers', icon: Briefcase }
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
                    { label: 'Customer Groups', tab: 'groups', icon: Users2 },
                    { label: 'Product Reviews', tab: 'reviews', icon: Star },
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

            {/* GROUP D: Marketing & Campaigns */}
            <div className="space-y-1">
              <button 
                onClick={() => toggleGroup('marketing')}
                className="w-full flex items-center justify-between py-1.5 px-3 text-[10px] text-slate-500 uppercase font-black tracking-widest hover:text-white transition"
              >
                <span>Marketing & SEO</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${openGroups.marketing ? 'rotate-180' : ''}`} />
              </button>
              {openGroups.marketing && (
                <div className="pl-3 space-y-1">
                  {[
                    { label: 'Campaigns & Coupons', tab: 'campaigns', icon: Flame },
                    { label: 'Landing Page Builder', tab: 'landing', icon: LayoutGrid },
                    { label: 'Blog Articles', tab: 'blog', icon: BookOpen },
                    { label: 'SEO Metadata', tab: 'seo', icon: Globe }
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

            {/* GROUP E: Content CMS */}
            <div className="space-y-1">
              <button 
                onClick={() => toggleGroup('content')}
                className="w-full flex items-center justify-between py-1.5 px-3 text-[10px] text-slate-500 uppercase font-black tracking-widest hover:text-white transition"
              >
                <span>Content CMS</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${openGroups.content ? 'rotate-180' : ''}`} />
              </button>
              {openGroups.content && (
                <div className="pl-3 space-y-1">
                  {[
                    { label: 'FAQ Accordions', tab: 'faqs', icon: Info },
                    { label: 'Announcements', tab: 'announcements', icon: Bell }
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

            {/* GROUP F: System & Reports */}
            <div className="space-y-1">
              <button 
                onClick={() => toggleGroup('system')}
                className="w-full flex items-center justify-between py-1.5 px-3 text-[10px] text-slate-500 uppercase font-black tracking-widest hover:text-white transition"
              >
                <span>System Controls</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${openGroups.system ? 'rotate-180' : ''}`} />
              </button>
              {openGroups.system && (
                <div className="pl-3 space-y-1">
                  {[
                    { label: 'RBAC Administrators', tab: 'users', icon: Shield },
                    { label: 'Activity Logs', tab: 'logs', icon: Terminal },
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

          {/* TAB 4: INVOICES AUDIT */}
          {activeTab === 'invoices' && (
            <div className="space-y-6">
              <div className="space-y-1">
                <h2 className="text-2xl font-black font-display text-white">Invoices Audit Logs</h2>
                <p className="text-xs text-slate-400">Track paid invoices, tax breakdowns, and payment dates.</p>
              </div>

              <div className="glass rounded-3xl p-6 border border-slate-850 shadow-lg shadow-black/10">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="text-slate-500 border-b border-slate-900 font-extrabold uppercase tracking-wider">
                        <th className="py-3">Invoice ID</th>
                        <th className="py-3">Order ID</th>
                        <th className="py-3">Total Amount</th>
                        <th className="py-3">Tax Component</th>
                        <th className="py-3">Date</th>
                        <th className="py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900/60">
                      {invoicesList.map(inv => (
                        <tr key={inv.id} className="text-slate-300 font-semibold">
                          <td className="py-4 font-mono text-blue-400">{inv.id}</td>
                          <td className="py-4 font-mono">{inv.orderId}</td>
                          <td className="py-4">{formatPrice(inv.total)}</td>
                          <td className="py-4">{formatPrice(inv.tax)}</td>
                          <td className="py-4">{inv.date}</td>
                          <td className="py-4">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400">{inv.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: PAYMENTS LOGS */}
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

          {/* TAB 6: PRODUCTS CATALOGUE (CRUD ACTIVE) */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <h2 className="text-2xl font-black font-display text-white">Product Catalogue</h2>
                  <p className="text-xs text-slate-400">Manage all products — create, edit, publish, and delete with full field support.</p>
                </div>
                <button
                  onClick={openAddProduct}
                  className="flex items-center space-x-2 py-2 px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Product</span>
                </button>
              </div>

              {productsError && (
                <div className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl p-3">{productsError}</div>
              )}

              <div className="glass rounded-3xl p-6 border border-slate-850 shadow-lg shadow-black/10">
                {productsLoading ? (
                  <div className="text-center py-12 text-slate-500 text-xs font-semibold">Loading products from database...</div>
                ) : productsList.length === 0 ? (
                  <div className="text-center py-12 text-slate-500 text-xs">
                    <Package className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <p>No products found. Add your first product to get started.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="text-slate-500 border-b border-slate-900 font-extrabold uppercase tracking-wider">
                          <th className="py-2.5">SKU</th>
                          <th className="py-2.5">Name</th>
                          <th className="py-2.5">Brand</th>
                          <th className="py-2.5">Price</th>
                          <th className="py-2.5">Categories</th>
                          <th className="py-2.5">Status</th>
                          <th className="py-2.5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-900/60">
                        {productsList.map(p => (
                          <tr key={p.id} className="text-slate-300 font-semibold hover:bg-slate-900/30 transition">
                            <td className="py-3 font-mono text-blue-400">{p.sku}</td>
                            <td className="py-3">
                              <div className="font-bold text-white">{p.name}</div>
                              <div className="text-[10px] text-slate-500">/{p.slug}</div>
                            </td>
                            <td className="py-3">{p.brand?.name || '—'}</td>
                            <td className="py-3">
                              <div>{formatPrice(p.price)}</div>
                              {p.salePrice && <div className="text-[10px] text-emerald-400">Sale: {formatPrice(p.salePrice)}</div>}
                            </td>
                            <td className="py-3">
                              <div className="flex flex-wrap gap-1">
                                {(p.productCategories || []).slice(0, 2).map((pc: any) => (
                                  <span key={pc.categoryId || pc.category?.id} className="px-1.5 py-0.5 bg-blue-500/10 text-blue-400 rounded text-[10px] font-bold">
                                    {pc.category?.name || '—'}
                                  </span>
                                ))}
                                {(p.productCategories || []).length > 2 && (
                                  <span className="text-[10px] text-slate-500">+{p.productCategories.length - 2}</span>
                                )}
                              </div>
                            </td>
                            <td className="py-3">
                              <button
                                onClick={() => toggleProductStatus(p)}
                                className={`px-2 py-0.5 rounded text-[10px] font-black transition ${
                                  p.status === 'PUBLISHED' ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white' :
                                  p.status === 'DRAFT' ? 'bg-amber-500/10 text-amber-400 hover:bg-amber-500 hover:text-white' :
                                  'bg-rose-500/10 text-rose-400'
                                }`}
                              >
                                {p.status}
                              </button>
                            </td>
                            <td className="py-3 text-right space-x-2">
                              <button
                                onClick={() => openEditProduct(p)}
                                className="p-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-slate-400 hover:text-white transition inline-flex"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => deleteProduct(p.id)}
                                className="p-1.5 bg-rose-500/5 hover:bg-rose-500 border border-rose-500/20 rounded-lg text-rose-400 hover:text-white transition inline-flex"
                              >
                                <Trash className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 7: CATEGORIES TREE (CRUD ACTIVE) */}
          {activeTab === 'categories' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <h2 className="text-2xl font-black font-display text-white">Categories & Sub-categories</h2>
                  <p className="text-xs text-slate-400">Full hierarchy tree — create root categories and nest sub-categories under parents.</p>
                </div>
                <button
                  onClick={openAddCategory}
                  className="flex items-center space-x-2 py-2 px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Category</span>
                </button>
              </div>

              <div className="glass rounded-3xl p-6 border border-slate-850 shadow-lg shadow-black/10 space-y-2">
                {categoriesList.length === 0 ? (
                  <div className="text-center py-10 text-slate-500 text-xs">No categories found. Add your first category.</div>
                ) : (
                  // Root categories first, then sub-categories indented
                  (() => {
                    const roots = categoriesList.filter(c => !c.parentId);
                    const children = categoriesList.filter(c => !!c.parentId);
                    return (
                      <div className="space-y-2">
                        {roots.map(cat => (
                          <div key={cat.id}>
                            {/* Root category row */}
                            <div className="flex justify-between items-center p-4 bg-slate-900/60 border border-slate-800 rounded-2xl text-xs">
                              <div className="flex items-center space-x-3">
                                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                <div>
                                  <h4 className="font-bold text-white">{cat.name}</h4>
                                  <span className="text-[10px] text-slate-500">/category/{cat.slug} • Root</span>
                                  <div className="flex gap-2 mt-1">
                                    {cat.visible && <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded font-bold">VISIBLE</span>}
                                    {cat.featured && <span className="text-[10px] bg-amber-500/10 text-amber-400 px-1.5 py-0.5 rounded font-bold">FEATURED</span>}
                                  </div>
                                </div>
                              </div>
                              <div className="space-x-2">
                                <button onClick={() => openEditCategory(cat)} className="p-1.5 bg-slate-950 hover:bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-white transition inline-flex"><Edit className="w-3.5 h-3.5" /></button>
                                <button onClick={() => deleteCategory(cat.id)} className="p-1.5 bg-rose-500/5 hover:bg-rose-500 border border-rose-500/20 rounded-lg text-rose-400 hover:text-white transition inline-flex"><Trash className="w-3.5 h-3.5" /></button>
                              </div>
                            </div>
                            {/* Sub-category children */}
                            {children.filter(c => c.parentId === cat.id).map(sub => (
                              <div key={sub.id} className="flex justify-between items-center p-3 bg-slate-950/60 border border-slate-900 rounded-xl text-xs ml-6 mt-1.5">
                                <div className="flex items-center space-x-3">
                                  <span className="w-1.5 h-1.5 rounded-full bg-slate-600"></span>
                                  <div>
                                    <h4 className="font-semibold text-slate-300">{sub.name}</h4>
                                    <span className="text-[10px] text-slate-600">/category/{sub.slug} • Sub-category of {cat.name}</span>
                                  </div>
                                </div>
                                <div className="space-x-2">
                                  <button onClick={() => openEditCategory(sub)} className="p-1.5 bg-slate-950 hover:bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-white transition inline-flex"><Edit className="w-3 h-3" /></button>
                                  <button onClick={() => deleteCategory(sub.id)} className="p-1.5 bg-rose-500/5 hover:bg-rose-500 border border-rose-500/20 rounded-lg text-rose-400 hover:text-white transition inline-flex"><Trash className="w-3 h-3" /></button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ))}
                        {/* Orphan children (parent was deleted) */}
                        {children.filter(c => !roots.find(r => r.id === c.parentId)).map(orphan => (
                          <div key={orphan.id} className="flex justify-between items-center p-3 bg-amber-500/5 border border-amber-500/20 rounded-xl text-xs">
                            <div>
                              <h4 className="font-semibold text-amber-400">{orphan.name} <span className="text-[10px] font-normal">(orphaned — parent removed)</span></h4>
                              <span className="text-[10px] text-slate-600">/category/{orphan.slug}</span>
                            </div>
                            <div className="space-x-2">
                              <button onClick={() => openEditCategory(orphan)} className="p-1.5 bg-slate-950 hover:bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-white transition inline-flex"><Edit className="w-3 h-3" /></button>
                              <button onClick={() => deleteCategory(orphan.id)} className="p-1.5 bg-rose-500/5 hover:bg-rose-500 border border-rose-500/20 rounded-lg text-rose-400 hover:text-white transition inline-flex"><Trash className="w-3 h-3" /></button>
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })()
                )}
              </div>
            </div>
          )}

          {/* TAB 8: BRANDS PARTNERS (CRUD ACTIVE) */}
          {activeTab === 'brands' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <h2 className="text-2xl font-black font-display text-white">Official Brand Partners</h2>
                  <p className="text-xs text-slate-400">Manage partner brand registry profiles and storefront logo mappings.</p>
                </div>
                <button 
                  onClick={openAddBrand}
                  className="flex items-center space-x-2 py-2 px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>Register Brand</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {brandsList.map(br => (
                  <div key={br.id} className="glass rounded-3xl p-6 border border-slate-850 space-y-4 shadow-lg shadow-black/10 relative">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-extrabold">{br.status}</span>
                      <div className="space-x-1">
                        <button 
                          onClick={() => openEditBrand(br)}
                          className="p-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded text-slate-400 hover:text-white transition inline-flex"
                        >
                          <Edit className="w-3 h-3" />
                        </button>
                        <button 
                          onClick={() => deleteBrand(br.id)}
                          className="p-1 bg-rose-500/5 hover:bg-rose-500 border border-rose-500/20 rounded text-rose-450 hover:text-white transition inline-flex"
                        >
                          <Trash className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold font-display text-white">{br.name}</h3>
                    <p className="text-xs text-slate-500">Slug: /brand/{br.slug}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 9: DEPOTS & WAREHOUSES */}
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
                      className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition"
                    >
                      Confirm Restock Level
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* TAB 10: STOCK TRANSFERS */}
          {activeTab === 'transfers' && (
            <div className="space-y-6">
              <div className="space-y-1">
                <h2 className="text-2xl font-black font-display text-white">Stock Transfers</h2>
                <p className="text-xs text-slate-400">Track depot-to-depot transit units and status updates.</p>
              </div>

              <div className="glass rounded-3xl p-6 border border-slate-850 shadow-lg shadow-black/10">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="text-slate-500 border-b border-slate-900 font-extrabold uppercase tracking-wider">
                        <th className="py-3">Transfer ID</th>
                        <th className="py-3">Source Depot</th>
                        <th className="py-3">Target Depot</th>
                        <th className="py-3">SKU</th>
                        <th className="py-3">Units</th>
                        <th className="py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900/60">
                      {transfersList.map(trf => (
                        <tr key={trf.id} className="text-slate-300 font-semibold">
                          <td className="py-4 font-mono text-blue-400">{trf.id}</td>
                          <td className="py-4">{trf.from}</td>
                          <td className="py-4">{trf.to}</td>
                          <td className="py-4 font-mono">{trf.sku}</td>
                          <td className="py-4">{trf.quantity} units</td>
                          <td className="py-4">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400">{trf.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 11: SUPPLIERS */}
          {activeTab === 'suppliers' && (
            <div className="space-y-6">
              <div className="space-y-1">
                <h2 className="text-2xl font-black font-display text-white">Suppliers Registry</h2>
                <p className="text-xs text-slate-400">Audit product supply channels and logistics partners.</p>
              </div>

              <div className="glass rounded-3xl p-6 border border-slate-850 shadow-lg shadow-black/10">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="text-slate-500 border-b border-slate-900 font-extrabold uppercase tracking-wider">
                        <th className="py-3">Supplier Name</th>
                        <th className="py-3">Contact Email</th>
                        <th className="py-3">Phone Line</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900/60">
                      {suppliersList.map(sup => (
                        <tr key={sup.id} className="text-slate-300 font-semibold">
                          <td className="py-4 font-bold text-white">{sup.name}</td>
                          <td className="py-4">{sup.contact}</td>
                          <td className="py-4 font-mono">{sup.phone}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 12: CUSTOMERS DIRECTORY */}
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

          {/* TAB 13: CUSTOMER GROUPS */}
          {activeTab === 'groups' && (
            <div className="space-y-6">
              <div className="space-y-1">
                <h2 className="text-2xl font-black font-display text-white">Customer Groups & Tiers</h2>
                <p className="text-xs text-slate-400">Segment users by loyalty profiles and point tiers.</p>
              </div>

              <div className="glass rounded-3xl p-6 border border-slate-850 shadow-lg shadow-black/10">
                <div className="space-y-3.5">
                  {customersList.map(c => (
                    <div key={c.id} className="flex justify-between items-center p-4 bg-slate-900/60 border border-slate-850 rounded-2xl text-xs">
                      <div>
                        <h4 className="font-bold text-white">{c.name}</h4>
                        <span className="text-[10px] text-slate-500">{c.email}</span>
                      </div>
                      <span className="px-3 py-1 rounded bg-[#0a0c14] border border-slate-800 text-[10px] font-black text-blue-400">{c.tier}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 14: PRODUCT REVIEWS */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <div className="space-y-1">
                <h2 className="text-2xl font-black font-display text-white">Product Reviews</h2>
                <p className="text-xs text-slate-400">Moderate product testimonials and approval ratings.</p>
              </div>

              <div className="glass rounded-3xl p-6 border border-slate-850 shadow-lg shadow-black/10">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="text-slate-500 border-b border-slate-900 font-extrabold uppercase tracking-wider">
                        <th className="py-3">Product</th>
                        <th className="py-3">Customer</th>
                        <th className="py-3">Rating</th>
                        <th className="py-3">Comment</th>
                        <th className="py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900/60">
                      {reviewsList.map(rev => (
                        <tr key={rev.id} className="text-slate-300 font-semibold">
                          <td className="py-4 font-bold text-white">{rev.product}</td>
                          <td className="py-4">{rev.customer}</td>
                          <td className="py-4 text-amber-400">
                            {[...Array(rev.rating)].map((_, i) => '★').join('')}
                          </td>
                          <td className="py-4 italic">"{rev.comment}"</td>
                          <td className="py-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                              rev.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                            }`}>{rev.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 15: SUPPORT TICKETS */}
          {activeTab === 'tickets' && (
            <div className="space-y-6">
              <div className="space-y-1">
                <h2 className="text-2xl font-black font-display text-white">Support Center Tickets</h2>
                <p className="text-xs text-slate-400">Audit priority queues and resolve variant discrepancy tickets.</p>
              </div>

              <div className="glass rounded-3xl p-6 border border-slate-850 shadow-lg shadow-black/10 max-w-2xl">
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

          {/* TAB 16: CAMPAIGNS & COUPONS */}
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
                        <span className="text-xs text-slate-400 font-bold">{camp.discount}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 17: LANDING PAGES */}
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
                      className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition"
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

          {/* TAB 18: BLOG ARTICLES */}
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

          {/* TAB 19: SEO METADATA */}
          {activeTab === 'seo' && (
            <div className="space-y-6">
              <div className="space-y-1">
                <h2 className="text-2xl font-black font-display text-white">SEO & Metadata Manager</h2>
                <p className="text-xs text-slate-400">Set global meta titles, description layouts, and indexation controls.</p>
              </div>

              <div className="glass rounded-3xl p-6 border border-slate-850 shadow-lg shadow-black/10 max-w-xl">
                {seoSaved && (
                  <p className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded p-2 mb-4">SEO Configuration saved successfully.</p>
                )}

                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    setSeoSaved(true);
                    setTimeout(() => setSeoSaved(false), 3000);
                  }}
                  className="space-y-4 text-xs font-semibold text-slate-400"
                >
                  <div className="space-y-1">
                    <label className="block">Meta Title Template</label>
                    <input 
                      type="text"
                      value={seoTitle}
                      onChange={(e) => setSeoTitle(e.target.value)}
                      className="w-full bg-[#0a0c14] border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500" 
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block">Meta Description Template</label>
                    <textarea 
                      rows={3}
                      value={seoDesc}
                      onChange={(e) => setSeoDesc(e.target.value)}
                      className="w-full bg-[#0a0c14] border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <button type="submit" className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition">
                    Save SEO Profiles
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* TAB 20: FAQ ACCORDIONS */}
          {activeTab === 'faqs' && (
            <div className="space-y-6">
              <div className="space-y-1">
                <h2 className="text-2xl font-black font-display text-white">FAQ Accordions CMS</h2>
                <p className="text-xs text-slate-400">Edit visible FAQs rendered on checkout and support pages.</p>
              </div>

              <div className="glass rounded-3xl p-6 border border-slate-850 shadow-lg shadow-black/10 max-w-2xl">
                <div className="space-y-3">
                  {faqsList.map(faq => (
                    <div key={faq.id} className="p-4 bg-slate-900/60 border border-slate-850 rounded-2xl space-y-2 text-xs">
                      <h4 className="font-bold text-white flex items-center">
                        <HelpCircle className="w-4 h-4 text-blue-450 mr-2" />
                        <span>{faq.question}</span>
                      </h4>
                      <p className="text-[10px] text-slate-450 leading-relaxed pl-6 border-l border-slate-900">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 21: ANNOUNCEMENTS */}
          {activeTab === 'announcements' && (
            <div className="space-y-6">
              <div className="space-y-1">
                <h2 className="text-2xl font-black font-display text-white">Global Banner Announcements</h2>
                <p className="text-xs text-slate-400">Set active announcements showing on the storefront header.</p>
              </div>

              <div className="glass rounded-3xl p-6 border border-slate-850 shadow-lg shadow-black/10 max-w-2xl">
                <div className="space-y-3">
                  {announcementsList.map(ann => (
                    <div key={ann.id} className="flex justify-between items-center p-4 bg-slate-900/60 border border-slate-850 rounded-2xl text-xs">
                      <p className="font-bold text-white">{ann.text}</p>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                        ann.active ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-900 text-slate-500 border border-slate-800'
                      }`}>{ann.active ? 'ACTIVE' : 'INACTIVE'}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 22: ANALYTICS REPORTS */}
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

          {/* TAB 23: ADMINISTRATORS */}
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

          {/* TAB 24: ACTIVITY LOGS */}
          {activeTab === 'logs' && (
            <div className="space-y-6">
              <div className="space-y-1">
                <h2 className="text-2xl font-black font-display text-white">System Activity Logs</h2>
                <p className="text-xs text-slate-400">Persistent audit trails capturing administrator write events.</p>
              </div>

              <div className="glass rounded-3xl p-6 border border-slate-850 shadow-lg shadow-black/10">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="text-slate-500 border-b border-slate-900 font-extrabold uppercase tracking-wider">
                        <th className="py-3">Administrator</th>
                        <th className="py-3">Operation Action</th>
                        <th className="py-3">IP Coordinates</th>
                        <th className="py-3">Timeline</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900/60">
                      {activityLogs.map(log => (
                        <tr key={log.id} className="text-slate-300 font-semibold">
                          <td className="py-4 font-bold text-white">{log.admin}</td>
                          <td className="py-4">{log.action}</td>
                          <td className="py-4 font-mono">{log.ip}</td>
                          <td className="py-4">{log.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 25: STORE SETTINGS */}
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
                      <button onClick={() => alert('Host URI copied!')} className="text-blue-450 hover:text-white text-[10px] font-bold uppercase tracking-wider transition">Copy</button>
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
              placeholder="Type page name (e.g. invoices, suppliers, logs, seo)..."
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

      {/* 4. CRUD Modals */}
      {/* Product Add/Edit Modal */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="glass border border-slate-800 rounded-3xl p-7 max-w-2xl w-full relative space-y-5 shadow-2xl my-4">
            <button onClick={() => setShowProductModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            <div>
              <h3 className="text-xl font-black font-display text-white">{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">All fields marked * are required. Changes persist to the database.</p>
            </div>

            <form onSubmit={saveProduct} className="space-y-4 text-xs font-semibold text-slate-400">
              {/* Row 1: Name + Slug */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block">Product Name *</label>
                  <input type="text" required value={prodForm.name}
                    onChange={(e) => setProdForm({ ...prodForm, name: e.target.value, slug: editingProduct ? prodForm.slug : toSlug(e.target.value) })}
                    className="w-full bg-[#080a12] border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
                    placeholder="e.g. Sony WH-1000XM5" />
                </div>
                <div className="space-y-1">
                  <label className="block">URL Slug *</label>
                  <input type="text" required value={prodForm.slug}
                    onChange={(e) => setProdForm({ ...prodForm, slug: e.target.value })}
                    className="w-full bg-[#080a12] border border-slate-800 rounded-xl p-3 text-white font-mono focus:outline-none focus:border-blue-500"
                    placeholder="e.g. sony-wh-1000xm5" />
                </div>
              </div>

              {/* Row 2: SKU + Brand */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block">SKU Code *</label>
                  <input type="text" required value={prodForm.sku}
                    onChange={(e) => setProdForm({ ...prodForm, sku: e.target.value })}
                    className="w-full bg-[#080a12] border border-slate-800 rounded-xl p-3 text-white font-mono focus:outline-none focus:border-blue-500"
                    placeholder="e.g. SONY-XM5-BLK" />
                </div>
                <div className="space-y-1">
                  <label className="block">Brand</label>
                  <select value={prodForm.brandId} onChange={(e) => setProdForm({ ...prodForm, brandId: e.target.value })}
                    className="w-full bg-[#080a12] border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500">
                    <option value="">— No Brand —</option>
                    {brandsList.map((b: any) => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                </div>
              </div>

              {/* Row 3: Price + Sale Price */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block">Regular Price * ($)</label>
                  <input type="number" required step="0.01" value={prodForm.price}
                    onChange={(e) => setProdForm({ ...prodForm, price: e.target.value })}
                    className="w-full bg-[#080a12] border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
                    placeholder="0.00" />
                </div>
                <div className="space-y-1">
                  <label className="block">Sale Price ($) <span className="text-slate-600 font-normal">(optional)</span></label>
                  <input type="number" step="0.01" value={prodForm.salePrice}
                    onChange={(e) => setProdForm({ ...prodForm, salePrice: e.target.value })}
                    className="w-full bg-[#080a12] border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
                    placeholder="0.00" />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="block">Description</label>
                <textarea value={prodForm.description}
                  onChange={(e) => setProdForm({ ...prodForm, description: e.target.value })}
                  rows={3}
                  className="w-full bg-[#080a12] border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500 resize-none"
                  placeholder="Product description..." />
              </div>

              {/* Categories */}
              <div className="space-y-1">
                <label className="block">Categories <span className="text-slate-600 font-normal">(hold Ctrl/Cmd to multi-select)</span></label>
                <select multiple value={prodForm.categoryIds}
                  onChange={(e) => setProdForm({ ...prodForm, categoryIds: Array.from(e.target.selectedOptions, o => o.value) })}
                  className="w-full bg-[#080a12] border border-slate-800 rounded-xl p-2 text-white focus:outline-none focus:border-blue-500" style={{ height: '100px' }}>
                  {categoriesList.map((c: any) => (
                    <option key={c.id} value={c.id}>{c.parentId ? '↳ ' : ''}{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Status */}
              <div className="space-y-1">
                <label className="block">Publication Status *</label>
                <select value={prodForm.status} onChange={(e) => setProdForm({ ...prodForm, status: e.target.value })}
                  className="w-full bg-[#080a12] border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500">
                  <option value="DRAFT">DRAFT — not visible to customers</option>
                  <option value="PUBLISHED">PUBLISHED — live on storefront</option>
                  <option value="OUT_OF_STOCK">OUT_OF_STOCK — shown but unavailable</option>
                </select>
              </div>

              <button type="submit" disabled={prodFormSaving}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-bold rounded-xl transition flex items-center justify-center space-x-2">
                {prodFormSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : null}
                <span>{prodFormSaving ? 'Saving...' : editingProduct ? 'Save Changes' : 'Create Product'}</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Category Add/Edit Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="glass border border-slate-800 rounded-3xl p-7 max-w-lg w-full relative space-y-5 shadow-2xl">
            <button onClick={() => setShowCategoryModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            <div>
              <h3 className="text-xl font-black font-display text-white">{editingCategory ? 'Edit Category' : 'Add Category / Sub-category'}</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">Leave Parent empty to create a root category. Select a parent to make it a sub-category.</p>
            </div>

            <form onSubmit={saveCategory} className="space-y-4 text-xs font-semibold text-slate-400">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block">Category Name *</label>
                  <input type="text" required value={catForm.name}
                    onChange={(e) => setCatForm({ ...catForm, name: e.target.value, slug: editingCategory ? catForm.slug : toSlug(e.target.value) })}
                    className="w-full bg-[#080a12] border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
                    placeholder="e.g. Electronics" />
                </div>
                <div className="space-y-1">
                  <label className="block">Slug *</label>
                  <input type="text" required value={catForm.slug}
                    onChange={(e) => setCatForm({ ...catForm, slug: e.target.value })}
                    className="w-full bg-[#080a12] border border-slate-800 rounded-xl p-3 text-white font-mono focus:outline-none focus:border-blue-500"
                    placeholder="e.g. electronics" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block">Parent Category <span className="text-slate-600 font-normal">(leave empty for root)</span></label>
                <select value={catForm.parentId}
                  onChange={(e) => setCatForm({ ...catForm, parentId: e.target.value })}
                  className="w-full bg-[#080a12] border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500">
                  <option value="">— Root (no parent) —</option>
                  {categoriesList.filter(c => !c.parentId && c.id !== editingCategory?.id).map((c: any) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <label className="flex items-center space-x-3 cursor-pointer p-3 bg-slate-900/50 rounded-xl border border-slate-800">
                  <input type="checkbox" checked={catForm.visible} onChange={(e) => setCatForm({ ...catForm, visible: e.target.checked })} className="accent-blue-500" />
                  <span>Visible on storefront</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer p-3 bg-slate-900/50 rounded-xl border border-slate-800">
                  <input type="checkbox" checked={catForm.featured} onChange={(e) => setCatForm({ ...catForm, featured: e.target.checked })} className="accent-amber-500" />
                  <span>Featured category</span>
                </label>
              </div>

              <button type="submit" disabled={catFormSaving}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-bold rounded-xl transition flex items-center justify-center space-x-2">
                {catFormSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : null}
                <span>{catFormSaving ? 'Saving...' : editingCategory ? 'Save Changes' : catForm.parentId ? 'Create Sub-category' : 'Create Category'}</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Brand Add/Edit Modal */}
      {showBrandModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="glass border border-slate-800 rounded-3xl p-7 max-w-md w-full relative space-y-5 shadow-2xl">
            <button onClick={() => setShowBrandModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            <div>
              <h3 className="text-xl font-black font-display text-white">{editingBrand ? 'Edit Brand' : 'Register Brand Partner'}</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">Brand slug is used in product URLs and storefront filters.</p>
            </div>

            <form onSubmit={saveBrand} className="space-y-4 text-xs font-semibold text-slate-400">
              <div className="space-y-1">
                <label className="block">Brand Name *</label>
                <input type="text" required value={brandForm.name}
                  onChange={(e) => setBrandForm({ ...brandForm, name: e.target.value, slug: editingBrand ? brandForm.slug : toSlug(e.target.value) })}
                  className="w-full bg-[#080a12] border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
                  placeholder="e.g. Sony Electronics" />
              </div>
              <div className="space-y-1">
                <label className="block">URL Slug *</label>
                <input type="text" required value={brandForm.slug}
                  onChange={(e) => setBrandForm({ ...brandForm, slug: e.target.value })}
                  className="w-full bg-[#080a12] border border-slate-800 rounded-xl p-3 text-white font-mono focus:outline-none focus:border-blue-500"
                  placeholder="e.g. sony" />
              </div>
              <div className="space-y-1">
                <label className="block">Status</label>
                <select value={brandForm.status} onChange={(e) => setBrandForm({ ...brandForm, status: e.target.value })}
                  className="w-full bg-[#080a12] border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500">
                  <option value="ACTIVE">ACTIVE — visible in storefront filters</option>
                  <option value="INACTIVE">INACTIVE — hidden from customers</option>
                </select>
              </div>
              <button type="submit" disabled={brandFormSaving}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-bold rounded-xl transition flex items-center justify-center space-x-2">
                {brandFormSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : null}
                <span>{brandFormSaving ? 'Saving...' : editingBrand ? 'Save Changes' : 'Register Brand'}</span>
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

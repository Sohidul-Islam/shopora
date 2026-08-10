'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '../../store/useStore';
import { 
  User, Mail, Shield, Award, MapPin, Plus, LogOut, Loader2, Sparkles, Home, Phone, Globe, CheckCircle2 
} from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const { sessionToken, logout } = useStore();
  
  const [profile, setProfile] = useState<any>(null);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingAddress, setAddingAddress] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Address form fields
  const [addressTitle, setAddressTitle] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  const [phone, setPhone] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [submittingAddress, setSubmittingAddress] = useState(false);

  const fetchProfile = async () => {
    if (!sessionToken) return;
    try {
      const res = await fetch('/api/profile', {
        headers: { 'Authorization': `Bearer ${sessionToken}` }
      });
      if (res.status === 401) {
        logout();
        router.push('/login?redirect=/profile');
        return;
      }
      const data = await res.json();
      if (data.success) {
        setProfile(data.user);
        setAddresses(data.addresses || []);
      } else {
        setError(data.error);
      }
    } catch {
      setError('Could not load profile.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!sessionToken) {
      router.push('/login?redirect=/profile');
    } else {
      fetchProfile();
    }
  }, [sessionToken]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${sessionToken}` }
      });
    } catch {}
    logout();
    router.push('/login');
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingAddress(true);
    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionToken}`
        },
        body: JSON.stringify({
          title: addressTitle,
          streetAddress,
          city,
          state,
          postalCode,
          country,
          phone,
          isDefault,
        })
      });
      const data = await res.json();
      if (data.success) {
        setAddingAddress(false);
        // Reset form
        setAddressTitle('');
        setStreetAddress('');
        setCity('');
        setState('');
        setPostalCode('');
        setCountry('');
        setPhone('');
        setIsDefault(false);
        // Refresh profile to update address list
        await fetchProfile();
      } else {
        alert(data.error || 'Failed to add address');
      }
    } catch {
      alert('Error adding address');
    } finally {
      setSubmittingAddress(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-b from-[#fafafa] to-purple-50/20 dark:from-[#05060b] dark:to-[#040508]">
        <Loader2 className="w-10 h-10 animate-spin text-purple-650 dark:text-purple-600" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-6 text-center">
        <p className="text-red-500 font-semibold">{error || 'Unable to load profile data.'}</p>
      </div>
    );
  }

  const initials = profile.name ? profile.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) : 'U';

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fafafa] via-[#fafafa] to-purple-50/20 dark:from-[#05060b] dark:via-[#090b11] dark:to-[#040508] py-16 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Profile Card Header */}
        <div className="bg-white dark:bg-[#0c0d15] border border-black/5 dark:border-slate-800/40 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-600/10 rounded-full blur-3xl"></div>
          
          <div className="flex flex-col sm:flex-row items-center gap-6 z-10 text-center sm:text-left">
            {/* Avatar block */}
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-600 via-purple-650 to-pink-500 text-white flex items-center justify-center text-3xl font-black shadow-lg shadow-purple-600/25">
              {initials}
            </div>
            
            <div className="space-y-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                  {profile.name}
                </h1>
                <span className="inline-flex items-center space-x-1 py-0.5 px-2.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-650 dark:text-blue-400 text-[10px] font-bold tracking-wide uppercase self-center">
                  <Shield className="w-3 h-3" />
                  <span>{profile.role?.name || 'Customer'}</span>
                </span>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center justify-center sm:justify-start space-x-1.5">
                <Mail className="w-3.5 h-3.5" />
                <span>{profile.email}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center md:items-end gap-3 z-10 shrink-0">
            {/* Reward Points Card */}
            <div className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/5 rounded-2xl p-4 flex items-center space-x-3 w-fit">
              <Award className="w-8 h-8 text-yellow-500 animate-pulse" />
              <div>
                <p className="text-[10px] uppercase font-bold tracking-widest text-slate-550 dark:text-slate-450">Reward Points</p>
                <p className="text-xl font-black text-slate-900 dark:text-white">{profile.rewardPoints || 0} pts</p>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="inline-flex items-center space-x-2 py-2.5 px-5 rounded-2xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-500 text-sm font-bold active:scale-[0.98] transition duration-300"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Addresses Grid / Actions */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center space-x-2">
              <MapPin className="w-6 h-6 text-purple-650 dark:text-purple-600" />
              <span>Saved Addresses</span>
            </h2>
            
            <button
              onClick={() => setAddingAddress(!addingAddress)}
              className="inline-flex items-center space-x-1.5 py-2 px-4 rounded-xl bg-purple-650 dark:bg-purple-600 hover:bg-purple-700 dark:hover:bg-purple-505 text-xs font-bold text-white shadow-lg shadow-purple-650/20 transition duration-300"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New</span>
            </button>
          </div>

          {/* Add Address Form Accordion */}
          {addingAddress && (
            <div className="bg-white dark:bg-[#0c0d15] border border-black/5 dark:border-slate-800/40 rounded-3xl p-6 shadow-xl space-y-6 transition-all duration-300 animate-fade-in">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-purple-650 dark:text-purple-400" />
                <h3 className="font-black text-slate-900 dark:text-white text-base">New Address Details</h3>
              </div>
              
              <form onSubmit={handleAddAddress} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-350">Address Title (e.g. Home, Office)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Home"
                    value={addressTitle}
                    onChange={(e) => setAddressTitle(e.target.value)}
                    className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl py-3 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-purple-550 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-gray-500"
                  />
                </div>
                
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-355">Street Address</label>
                  <input
                    type="text"
                    required
                    placeholder="123 Main St"
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                    className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl py-3 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-purple-550 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-gray-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-355">City</label>
                  <input
                    type="text"
                    required
                    placeholder="New York"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl py-3 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-purple-550 text-slate-900 dark:text-slate-100 placeholder-slate-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-355">State / Province</label>
                  <input
                    type="text"
                    required
                    placeholder="NY"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl py-3 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-purple-550 text-slate-900 dark:text-slate-100 placeholder-slate-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-355">Postal / ZIP Code</label>
                  <input
                    type="text"
                    required
                    placeholder="10001"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl py-3 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-purple-550 text-slate-900 dark:text-slate-100 placeholder-slate-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-355">Country</label>
                  <input
                    type="text"
                    required
                    placeholder="United States"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl py-3 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-purple-550 text-slate-900 dark:text-slate-100 placeholder-slate-400"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-355">Phone Number</label>
                  <input
                    type="text"
                    required
                    placeholder="+1 (555) 123-4567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl py-3 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-purple-550 text-slate-900 dark:text-slate-100 placeholder-slate-400"
                  />
                </div>

                <div className="flex items-center space-x-2.5 sm:col-span-2 pt-2">
                  <input
                    type="checkbox"
                    id="isDefault"
                    checked={isDefault}
                    onChange={(e) => setIsDefault(e.target.checked)}
                    className="w-4 h-4 accent-purple-650 rounded border-black/10 focus:ring-purple-500"
                  />
                  <label htmlFor="isDefault" className="text-xs font-bold text-slate-700 dark:text-slate-300">Set as default address</label>
                </div>

                <div className="flex gap-3 sm:col-span-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setAddingAddress(false)}
                    className="flex-1 py-3 px-4 rounded-xl border border-black/15 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingAddress}
                    className="flex-1 py-3 px-4 rounded-xl bg-purple-650 dark:bg-purple-600 text-xs font-bold text-white hover:bg-purple-700 shadow-md transition flex items-center justify-center space-x-2"
                  >
                    {submittingAddress ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <span>Save Address</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Addresses List Grid */}
          {addresses.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-3xl p-8 space-y-3">
              <MapPin className="w-8 h-8 text-slate-405 dark:text-slate-550 mx-auto" />
              <p className="text-sm text-slate-500 dark:text-slate-400">No saved addresses found. Add one above to speed up checkout.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {addresses.map((addr) => (
                <div key={addr.id} className="bg-white dark:bg-[#0c0d15] border border-black/5 dark:border-slate-800/40 rounded-3xl p-6 shadow-md hover:shadow-lg relative overflow-hidden transition-all duration-300">
                  {addr.isDefault && (
                    <div className="absolute top-4 right-4 text-purple-650 dark:text-purple-400" title="Default Address">
                      <CheckCircle2 className="w-5 h-5 fill-purple-650/10" />
                    </div>
                  )}
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Home className="w-4 h-4 text-slate-450 dark:text-slate-400" />
                      <h3 className="font-bold text-slate-900 dark:text-white text-base">{addr.title || 'Address'}</h3>
                    </div>

                    <div className="text-sm text-slate-655 dark:text-slate-350 space-y-1 leading-relaxed">
                      <p>{addr.streetAddress}</p>
                      <p>{addr.city}, {addr.state} {addr.postalCode}</p>
                      <p className="flex items-center space-x-1.5 text-xs text-slate-500 pt-1">
                        <Globe className="w-3.5 h-3.5" />
                        <span>{addr.country}</span>
                      </p>
                      <p className="flex items-center space-x-1.5 text-xs text-slate-500">
                        <Phone className="w-3.5 h-3.5" />
                        <span>{addr.phone}</span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}

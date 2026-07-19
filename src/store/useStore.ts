import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string; // product variant id
  productId: string;
  name: string;
  sku: string;
  image: string;
  price: number;
  salePrice: number | null;
  quantity: number;
  stock: number;
}

export interface Coupon {
  id: string;
  code: string;
  type: 'FIXED' | 'PERCENTAGE' | 'FREE_SHIPPING';
  value: number;
  minPurchase: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
  rewardPoints: number;
}

interface ShopState {
  // Authentication State
  user: User | null;
  sessionToken: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;

  // Cart State
  cart: CartItem[];
  appliedCoupon: Coupon | null;
  addToCart: (item: CartItem) => void;
  removeFromCart: (variantId: string) => void;
  updateCartQuantity: (variantId: string, quantity: number) => void;
  applyCoupon: (coupon: Coupon | null) => void;
  clearCart: () => void;

  // Wishlist State
  wishlist: { id: string; name: string; slug: string; price: number; image: string }[];
  toggleWishlist: (product: { id: string; name: string; slug: string; price: number; image: string }) => void;
  isInWishlist: (productId: string) => boolean;

  // Checkout Status / Temporary Address Selection
  selectedAddressId: string | null;
  setSelectedAddressId: (addressId: string | null) => void;

  // Theme State
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const useStore = create<ShopState>()(
  persist(
    (set, get) => ({
      user: null,
      sessionToken: null,
      login: (user, token) => set({ user, sessionToken: token }),
      logout: () => set({ user: null, sessionToken: null, appliedCoupon: null }),

      cart: [],
      appliedCoupon: null,
      addToCart: (item) => {
        const currentCart = get().cart;
        const existing = currentCart.find((i) => i.id === item.id);
        
        if (existing) {
          const newQty = Math.min(existing.stock, existing.quantity + item.quantity);
          set({
            cart: currentCart.map((i) =>
              i.id === item.id ? { ...i, quantity: newQty } : i
            ),
          });
        } else {
          set({ cart: [...currentCart, item] });
        }
      },
      removeFromCart: (variantId) => {
        set({ cart: get().cart.filter((i) => i.id !== variantId) });
      },
      updateCartQuantity: (variantId, quantity) => {
        set({
          cart: get().cart.map((i) =>
            i.id === variantId ? { ...i, quantity: Math.max(1, Math.min(i.stock, quantity)) } : i
          ),
        });
      },
      applyCoupon: (coupon) => set({ appliedCoupon: coupon }),
      clearCart: () => set({ cart: [], appliedCoupon: null }),

      wishlist: [],
      toggleWishlist: (product) => {
        const current = get().wishlist;
        const exists = current.some((p) => p.id === product.id);
        if (exists) {
          set({ wishlist: current.filter((p) => p.id !== product.id) });
        } else {
          set({ wishlist: [...current, product] });
        }
      },
      isInWishlist: (productId) => {
        return get().wishlist.some((p) => p.id === productId);
      },

      selectedAddressId: null,
      setSelectedAddressId: (addressId) => set({ selectedAddressId: addressId }),

      theme: 'dark',
      toggleTheme: () => {
        const nextTheme = get().theme === 'dark' ? 'light' : 'dark';
        set({ theme: nextTheme });
        if (typeof window !== 'undefined') {
          const root = window.document.documentElement;
          if (nextTheme === 'dark') {
            root.classList.add('dark');
            root.classList.remove('light');
          } else {
            root.classList.add('light');
            root.classList.remove('dark');
          }
        }
      },
    }),
    {
      name: 'shopora-storage', // localstorage key
      partialize: (state) => ({
        user: state.user,
        sessionToken: state.sessionToken,
        cart: state.cart,
        appliedCoupon: state.appliedCoupon,
        wishlist: state.wishlist,
        selectedAddressId: state.selectedAddressId,
        theme: state.theme,
      }),
    }
  )
);

// Helper selectors for totals
export const getCartTotals = (state: ShopState) => {
  const subtotal = state.cart.reduce((sum, item) => {
    const activePrice = Number(item.salePrice !== null ? item.salePrice : item.price);
    return sum + activePrice * item.quantity;
  }, 0);

  let discount = 0;
  if (state.appliedCoupon) {
    if (state.appliedCoupon.type === 'PERCENTAGE') {
      discount = (subtotal * state.appliedCoupon.value) / 100;
    } else if (state.appliedCoupon.type === 'FIXED') {
      discount = state.appliedCoupon.value;
    }
  }

  const isFreeShipping = state.appliedCoupon?.type === 'FREE_SHIPPING' || subtotal > 150;
  const shipping = subtotal === 0 ? 0 : isFreeShipping ? 0 : 15;
  const tax = subtotal * 0.08;
  const total = Math.max(0, subtotal - discount + shipping + tax);

  return {
    subtotal,
    discount,
    shipping,
    tax,
    total,
  };
};

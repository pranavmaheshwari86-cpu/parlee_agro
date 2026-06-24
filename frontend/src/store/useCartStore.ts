import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  productId: string;
  name: string;
  subName: string;
  price: number;
  quantity: number;
  themeColor: string;
  image?: string;
}

interface CartStore {
  items: CartItem[];
  isCartOpen: boolean;
  checkoutStep: "cart" | "address" | "payment";
  openCart: (step?: "cart" | "address" | "payment") => void;
  closeCart: () => void;
  addToCart: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getSubtotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isCartOpen: false,
      checkoutStep: "cart",
      openCart: (step = "cart") => set({ isCartOpen: true, checkoutStep: step }),
      closeCart: () => set({ isCartOpen: false }),
      addToCart: (item) => {
        set((state) => {
          const existingItem = state.items.find((i) => i.productId === item.productId);
          const quantityToAdd = item.quantity || 1;
          
          if (existingItem) {
            return {
              items: state.items.map((i) =>
                i.productId === item.productId
                  ? { ...i, quantity: i.quantity + quantityToAdd, image: item.image || i.image, themeColor: item.themeColor }
                  : i
              ),
            };
          }
          return {
            items: [...state.items, { ...item, quantity: quantityToAdd }],
          };
        });
      },
      removeFromCart: (productId) => {
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        }));
      },
      updateQuantity: (productId, quantity) => {
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId ? { ...i, quantity: Math.max(1, quantity) } : i
          ),
        }));
      },
      clearCart: () => set({ items: [] }),
      getSubtotal: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
    }),
    {
      name: 'smoodh-cart-storage',
      // We don't want to persist the isCartOpen state across reloads
      partialize: (state) => ({ items: state.items }),
    }
  )
);

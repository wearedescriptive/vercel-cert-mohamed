"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  useTransition,
  type ReactNode,
} from "react";
import type { CartWithProducts } from "../../lib/integrations/swag-store-api";
import {
  createCartAction,
  getCartAction,
  addToCartAction,
  updateCartItemAction,
  removeCartItemAction,
} from "../../app/cart/actions";

const STORAGE_KEY = "swag-cart-token";

interface CartContextValue {
  cart: CartWithProducts | null;
  isOpen: boolean;
  isPending: boolean;
  error: string | null;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  updateItemQty: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  openCart: () => void;
  closeCart: () => void;
  clearError: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within <CartProvider>");
  return ctx;
}

function readToken(): string | null {
  try {
    return sessionStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function saveToken(token: string): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, token);
  } catch {
    /* SSR or quota exceeded */
  }
}

function clearToken(): void {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    /* noop */
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartWithProducts | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const tokenRef = useRef<string | null>(null);
  const hydratedRef = useRef(false);

  useEffect(() => {
    if (hydratedRef.current) return;
    hydratedRef.current = true;

    const token = readToken();
    if (!token) return;
    tokenRef.current = token;

    getCartAction(token).then((result) => {
      if (result.success) {
        setCart(result.cart);
      } else {
        clearToken();
        tokenRef.current = null;
      }
    });
  }, []);

  const ensureCart = useCallback(async (): Promise<string> => {
    if (tokenRef.current) return tokenRef.current;

    const result = await createCartAction();
    if (!result.success) throw new Error(result.error);

    const token = result.token!;
    tokenRef.current = token;
    saveToken(token);
    setCart(result.cart);
    return token;
  }, []);

  const addToCart = useCallback(
    async (productId: string, quantity: number = 1) => {
      setError(null);
      startTransition(async () => {
        try {
          const token = await ensureCart();
          const result = await addToCartAction(token, productId, quantity);
          if (result.success) {
            setCart(result.cart);
          } else {
            setError(result.error);
          }
        } catch {
          setError("Product couldn't be added to cart");
        }
      });
    },
    [ensureCart],
  );

  const updateItemQty = useCallback(
    async (itemId: string, quantity: number) => {
      setError(null);
      startTransition(async () => {
        const token = tokenRef.current;
        if (!token) return;
        const result = await updateCartItemAction(token, itemId, quantity);
        if (result.success) {
          setCart(result.cart);
        } else {
          setError(result.error);
        }
      });
    },
    [],
  );

  const removeItem = useCallback(async (itemId: string) => {
    setError(null);
    startTransition(async () => {
      const token = tokenRef.current;
      if (!token) return;
      const result = await removeCartItemAction(token, itemId);
      if (result.success) {
        setCart(result.cart);
      } else {
        setError(result.error);
      }
    });
  }, []);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const clearError = useCallback(() => setError(null), []);

  return (
    <CartContext.Provider
      value={{
        cart,
        isOpen,
        isPending,
        error,
        addToCart,
        updateItemQty,
        removeItem,
        openCart,
        closeCart,
        clearError,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

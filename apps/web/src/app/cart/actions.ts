"use server";

import {
  createCart,
  getCart,
  getProductStock,
  addItemToCart,
  updateCartItem,
  removeCartItem,
  StoreApiError,
  type CartWithProducts,
} from "../../lib/integrations/swag-store-api";

type CartSuccess = { success: true; cart: CartWithProducts; token?: string };
type CartError = { success: false; error: string };
type CartResult = CartSuccess | CartError;

function errorMessage(err: unknown): string {
  if (err instanceof StoreApiError) return err.message;
  if (err instanceof Error) return err.message;
  return "An unexpected error occurred";
}

export async function createCartAction(): Promise<CartResult> {
  try {
    const result = await createCart();
    return {
      success: true,
      cart: result.body.data,
      token: result.cartToken,
    };
  } catch (err) {
    return { success: false, error: errorMessage(err) };
  }
}

export async function getCartAction(cartToken: string): Promise<CartResult> {
  try {
    const res = await getCart({ cartToken });
    return { success: true, cart: res.data };
  } catch (err) {
    return { success: false, error: errorMessage(err) };
  }
}

export async function addToCartAction(
  cartToken: string,
  productId: string,
  quantity: number = 1,
): Promise<CartResult> {
  try {
    const [stockRes, cartRes] = await Promise.all([
      getProductStock({ id: productId }),
      getCart({ cartToken }),
    ]);
    const stockInfo = stockRes.data;
    const existingQty =
      cartRes.data.items.find((i) => i.productId === productId)?.quantity ?? 0;
    const resultingQty = existingQty + quantity;

    if (!stockInfo.inStock || stockInfo.stock <= 0) {
      return {
        success: false,
        error: "This product is currently out of stock",
      };
    }
    if (resultingQty > stockInfo.stock) {
      const msg =
        existingQty > 0
          ? `Only ${stockInfo.stock} available in stock. You already have ${existingQty} in your cart.`
          : `Only ${stockInfo.stock} available in stock.`;
      return { success: false, error: msg };
    }

    const res = await addItemToCart({ cartToken }, { productId, quantity });
    return { success: true, cart: res.data };
  } catch (err) {
    return { success: false, error: errorMessage(err) };
  }
}

export async function updateCartItemAction(
  cartToken: string,
  itemId: string,
  quantity: number,
): Promise<CartResult> {
  try {
    const stockRes = await getProductStock({ id: itemId });
    const stockInfo = stockRes.data;

    if (!stockInfo.inStock || stockInfo.stock <= 0) {
      return {
        success: false,
        error: "This product is currently out of stock",
      };
    }
    if (quantity > stockInfo.stock) {
      return {
        success: false,
        error: `Only ${stockInfo.stock} available in stock.`,
      };
    }

    const res = await updateCartItem({ itemId, cartToken }, { quantity });
    return { success: true, cart: res.data };
  } catch (err) {
    return { success: false, error: errorMessage(err) };
  }
}

export async function removeCartItemAction(
  cartToken: string,
  itemId: string,
): Promise<CartResult> {
  try {
    const res = await removeCartItem({ itemId, cartToken });
    return { success: true, cart: res.data };
  } catch (err) {
    return { success: false, error: errorMessage(err) };
  }
}

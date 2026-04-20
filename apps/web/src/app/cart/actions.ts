"use server";

import {
  createCart,
  getCart,
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

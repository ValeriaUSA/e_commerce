import React, { createContext, useContext, useReducer, useEffect } from "react";
import axios from "axios";
import { GlobalContext } from "./GlobalContext"; // Adjust path as needed

const CartContext = createContext();

const VISITOR_CART_KEY = "visitor_cart";
const USER_CART_KEY = "user_cart";

/* =======================
   LOCAL STORAGE HELPERS
======================= */
const readLocal = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const writeLocal = (key, data) => localStorage.setItem(key, JSON.stringify(data));
const removeLocal = (key) => localStorage.removeItem(key);

/* =======================
   REDUCER
======================= */
const cartReducer = (state, action) => {
  switch (action.type) {
    case "SET_CART":
      return action.payload;

    case "ADD_BOOK": {
      const { productId, quantity } = action.payload;
      const index = state.findIndex((i) => i.productId === productId);
      if (index !== -1) {
        const copy = [...state];
        copy[index] = { ...copy[index], quantity: copy[index].quantity + quantity };
        return copy;
      }
      return [...state, action.payload];
    }

    case "UPDATE_QNTY":
      return action.payload.quantity <= 0
        ? state.filter((i) => i.productId !== action.payload.productId)
        : state.map((i) => (i.productId === action.payload.productId ? { ...i, quantity: action.payload.quantity } : i));

    case "REMOVE_BOOK":
      return state.filter((i) => i.productId !== action.payload.productId);

    case "CLEAR_CART":
      return [];

    default:
      return state;
  }
};

/* =======================
   PROVIDER
======================= */
export const CartProvider = ({ children }) => {
  const { user } = useContext(GlobalContext);
  const isLoggedIn = Boolean(user);
  const isAdmin = user?.role === "admin";

  // Initial load from local storage
  const [cartItems, dispatch] = useReducer(cartReducer, [], () => {
    return isLoggedIn ? readLocal(USER_CART_KEY) : readLocal(VISITOR_CART_KEY);
  });

  /* =======================
     EFFECTS & FUSION LOGIC
  ======================= */

  // Sync state to LocalStorage
  useEffect(() => {
    if (isAdmin) return;
    const key = isLoggedIn ? USER_CART_KEY : VISITOR_CART_KEY;
    writeLocal(key, cartItems);
  }, [cartItems, isLoggedIn, isAdmin]);

  // LOGIN FLOW: Sync & Merge
  useEffect(() => {
    const syncCarts = async () => {
      if (!isLoggedIn || isAdmin) return;

      try {
        // 1. Get Guest Cart and Backend Cart
        const guestItems = readLocal(VISITOR_CART_KEY);
        const { data } = await axios.get("/cart/me");
        const serverItems = data?.cart?.books || [];

        // 2. Fusion Logic
        let mergedCart = [...serverItems];

        for (const guestItem of guestItems) {
          const existing = mergedCart.find((item) => item.productId === guestItem.productId);
          if (existing) {
            existing.quantity += guestItem.quantity;
            // Sync merged quantity to backend
            await axios.post("/cart/update", { productId: guestItem.productId, quantity: existing.quantity });
          } else {
            mergedCart.push(guestItem);
            // Add new item to backend
            await axios.post("/cart/add", { productId: guestItem.productId, qnty: guestItem.quantity });
          }
        }

        // 3. Update UI and Clean up
        dispatch({ type: "SET_CART", payload: mergedCart });
        removeLocal(VISITOR_CART_KEY);
      } catch (err) {
        console.error("[Cart Fusion] Failed", err);
      }
    };

    syncCarts();
  }, [isLoggedIn, isAdmin]);

  // LOGOUT FLOW: Clean state
  useEffect(() => {
    if (!isLoggedIn) {
      dispatch({ type: "CLEAR_CART" });
      removeLocal(USER_CART_KEY);
    }
  }, [isLoggedIn]);

  /* =======================
     ACTIONS (OPTIMISTIC)
  ======================= */
  const addProductToCart = async (product, quantity = 1) => {
    if (isAdmin) return alert("Admins cannot have carts");
    dispatch({ type: "ADD_BOOK", payload: { ...product, quantity } });

    if (isLoggedIn) {
      try {
        await axios.post("/cart/add", { productId: product.productId, qnty: quantity });
      } catch (err) { console.error(err); }
    }
  };

  const updateQntyInCart = async (productId, quantity) => {
    dispatch({ type: "UPDATE_QNTY", payload: { productId, quantity } });
    if (isLoggedIn) {
      try {
        await axios.post("/cart/update", { productId, quantity });
      } catch (err) { console.error(err); }
    }
  };

  const removeProductFromCart = async (productId) => {
    dispatch({ type: "REMOVE_BOOK", payload: { productId } });
    if (isLoggedIn) {
      try {
        await axios.post("/cart/remove", { productId });
      } catch (err) { console.error(err); }
    }
  };

  const clearCart = async () => {
    dispatch({ type: "CLEAR_CART" });
    if (isLoggedIn) {
      try { await axios.post("/cart/clear"); } catch (err) { console.error(err); }
    }
  };

  const calcTotalQnty = () => cartItems.reduce((sum, i) => sum + i.quantity, 0);
  const calcTotalPrice = () => cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider 
    value={{ 
        cartItems, 
        addProductToCart, 
        removeProductFromCart, 
        updateQntyInCart, 
        clearCart, 
        calcTotalQnty, 
        calcTotalPrice }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
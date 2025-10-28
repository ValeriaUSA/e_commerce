import { useContext, useEffect, createContext, useReducer } from "react";
import { GlobalContext } from "./GlobalContext";
import axios from "../../axios.config";

const CartContext = createContext();
const CART_LOCAL = "visitor_cart"; //a key used in local storage

// GET CART FROM LOCAL STORAGE:
const getCartLocalStorage = () => {
  try {
    const storedCart = localStorage.getItem(CART_LOCAL);
    return storedCart ? JSON.parse(storedCart) : [];
  } catch (error) {
    console.error("Error reading Cart from Local Storage : ", error);
    return [];
  }
};

// REDUCER to manage CART STATE:
const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_BOOK": {
      const { productId, quantity } = action.payload;
      const existingIndex = state.findIndex((item) => item.productId === productId);

      if (existingIndex > -1) {
        const newState = [...state];
        newState[existingIndex].quantity += quantity;
        return newState;
      }
      return [...state, action.payload];
    }

    case "REMOVE_BOOK": {
      const productIdToRemove = action.payload.productId;
      return state.filter((item) => item.productId !== productIdToRemove);
    }

    case "UPDATE_QNTY": {
      const { productId, quantity } = action.payload;
      if (quantity <= 0)
        return state.filter((item) => item.productId !== productId);
      return state.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      );
    }

    case "SET_CART": {
      return [...action.payload];
    }

    case "CLEAR_CART": {
      return [];
    }

    default:
      return state;
  }
};

// PROVIDER
export const CartProvider = ({ children }) => {
  const { user } = useContext(GlobalContext);
  const isLoggedIn = !!user;
  const customerId = user?.customerId;
  const cartId = user?.cartId;

  const [cartItems, dispatch] = useReducer(cartReducer, [], getCartLocalStorage);

  // ✅ ADDED: Load backend cart when user logs in
  useEffect(() => {
    const loadBackendCart = async () => {
      if (isLoggedIn && user?.id) {
        try {
          console.log("🔥 [CartContext] Fetching backend cart for user:", user.id);

          const response = await axios.get(`/cart/${user.id}`);
          const backendCart = response.data.cart || [];

          const normalizedCart = backendCart.map((item) => ({
            ...item,
            quantity: item.qnty ?? item.quantity ?? 1,
          }));

          dispatch({ type: "SET_CART", payload: normalizedCart });
          localStorage.setItem(CART_LOCAL, JSON.stringify(normalizedCart));
        } catch (error) {
          console.error("❌ [CartContext] Error loading backend cart:", error);
        }
      }
    };

    loadBackendCart();
  }, [isLoggedIn, user]); // 🔥 runs when user logs in

  // GUEST: save to localStorage
  useEffect(() => {
    if (!isLoggedIn) {
      localStorage.setItem(CART_LOCAL, JSON.stringify(cartItems));
    }
  }, [cartItems, isLoggedIn]);

  // ADD BOOK
  const addProductToCart = async (product, quantity = 1) => {
    dispatch({ type: "ADD_BOOK", payload: { ...product, quantity } });

    if (isLoggedIn) {
      try {
        await axios.post("/cart/add", {
          userId: user.id,
          productId: product.id,
          qnty: quantity,
        });
      } catch (error) {
        console.error("Error syncing cart with backend : ", error);
      }
    }
  };

  // REMOVE BOOK:
  const removeProductFromCart = async (productId) => {
    dispatch({ type: "REMOVE_BOOK", payload: { productId } });

    if (isLoggedIn) {
      try {
        await axios.post("/cart/remove", {
          productId,
          userId: user.id,
        });
      } catch (error) {
        console.error("Error removing book from backend : ", error);
      }
    }
  };

  // UPDATE Qnty in the CART:
  const updateQntyInCart = async (productId, quantity) => {
    dispatch({ type: "UPDATE_QNTY", payload: { productId, quantity } });

    if (isLoggedIn) {
      try {
        await axios.post("/cart/update", {
          userId: user.id,
          productId,
          quantity,
        });
      } catch (error) {
        console.error("[CartContext] Error updating cart quantity in backend : ", error);
      }
    }
  };

  // CLEAR UP CART:
  const clearCart = async (cartId) => {
    dispatch({ type: "CLEAR_CART", payload: { cartId } });

    if (!isLoggedIn) {
      localStorage.removeItem(CART_LOCAL);
    } else {
      try {
        await axios.post(`/cart/clear`, { cartId });
      } catch (error) {
        console.error("Error clearing cart in backend:", error);
      }
    }
  };

  // CART TOTALS calculation:
  const calcTotalQnty = () =>
    cartItems.reduce((count, item) => count + item.quantity, 0);
  const calcTotalPrice = () =>
    cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addProductToCart,
        removeProductFromCart,
        updateQntyInCart,
        clearCart,
        calcTotalPrice,
        calcTotalQnty,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

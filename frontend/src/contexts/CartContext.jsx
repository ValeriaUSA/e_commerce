import { useContext } from "react";
import { useEffect } from "react";
import { createContext } from "react";
import { useReducer } from "react";
import { GlobalContext } from "./GlobalContext";
import axios from "../../axios.config";

// const CartContext = createContext();

// const VISITOR_CART_KEY = "visitor_cart"; //localStorage for visitor persists
// const USER_CART_KEY = "user_cart"; //  for lof-in user synced w backend



// // Read/Write local storage

// const readLocal = (key) => {
//     try {
//         const localContent = localStorage.getItem(key)
//         return localContent ? JSON.parse(localContent) : []
//     } catch (error) {
//         console.error(`[CartContext] Error reading ${key} from localStorage`, error);
//         return []
//     }
// };

// const writeLocal = (key, data) => {
//     try {
//         localStorage.setItem(key, JSON.stringify(data))
//     } catch (error) {
//         console.error(`[CartContext] Error writing ${key} to localStorage`, error);
//     }
// }


// const removeLocal = (key) => {
//     try {
//         localStorage.removeItem(key)
//     } catch (error) {
//         console.error(`[CartContext] Error removing  ${key} from localStorage`, error);
//     }
// }


// // REDUCER to manage CART STATE:

// const cartReducer = (state, action) => {
//     switch (action.type) {

//         case "ADD_BOOK": {

//             const { productId, quantity } = action.payload;
//             const index = state.findIndex(item => item.productId === productId); // this product already exists in the cart ? "state" here is the current array of cart items

//             if (index > -1) {
//                 const copy = [...state]; //a copy of the current cart (never mutate state directly !!!)
//                 copy[index] = { ...copy[index], quantity: copy[index].quantity + quantity }

//                 return copy;
//             }
//             //  Case when the book is not yet in cart. Return a new array with all current items + the new one (from the payload)
//             return [...state, action.payload]
//         }

//         case "REMOVE_BOOK": {
//             const productIdToRemove = action.payload.productId; // extract from object
//             return state.filter(item => item.productId !== productIdToRemove);
//         }
//         case "UPDATE_QNTY": {
//             const { productId, quantity } = action.payload;
//             if (quantity <= 0) return state.filter(item => item.productId !== productId)
//             return state.map(item =>
//                 item.productId === productId ? { ...item, quantity } : item
//             );
//         }

//         case "SET_CART": {
//             return [...action.payload];
//         }

//         case "CLEAR_CART": {
//             return [];
//         }
//         default:
//             return state
//     }
// }

// //PROVIDER

// export const CartProvider = ({ children }) => {
//     const { user } = useContext(GlobalContext);
//     const isLoggedIn = !!user; //!! ensures it’s always a simple boolean, not an object or null.

//     const getCartLocalStorage = isLoggedIn 
//     ? readLocal(USER_CART_KEY) 
//     : readLocal(VISITOR_CART_KEY)

//     const [cartItems, dispatch] = useReducer(cartReducer, getCartLocalStorage);


//     // VISITOR (not logged) changes cart -> keep changes in VISITOR_CART_KEY

//     useEffect(() => {
//         if (!isLoggedIn) {
//             writeLocal(VISITOR_CART_KEY, cartItems)
//         }
//     }, [cartItems, isLoggedIn]);

//     // ---Once USER logs IN : load backend cart, persist under USER_CART_KEY, and REMOVE visitor_cart

//     useEffect(() => {
//         const loadBackendCart = async () => {
//             if (isLoggedIn && user?.id) {
//                 try {
//                     const response = await axios.get(`/cart/me`);
//                     const backendCart = response.data.cart || { books: [] };

//                     // Map over the books array, not the cart object itself
//                     const normalizedCart = (backendCart.books || []).map((item) => ({
//                         ...item,
//                         quantity: item.qnty ?? item.quantity ?? 1,
//                     }));

//                     // Update reducer state with normalized cart
//                     dispatch({ type: "SET_CART", payload: normalizedCart });

//                     // Save synchronized user cart
//                     localStorage.setItem(USER_CART_KEY, JSON.stringify(normalizedCart));

//                     // Remove visitor cart now that a user is logged in
//                     localStorage.removeItem(VISITOR_CART_KEY);

//                     console.log("✅ [CartContext] Loaded backend cart and removed visitor_cart:", normalizedCart);

//                 } catch (error) {
//                     console.error("❌ [CartContext] Error loading backend cart:", error);
//                     // Keep whatever local cart exists if backend fails
//                 }
//             }
//         };

//         loadBackendCart();
//     }, [isLoggedIn, user?.id]);

//     // ---Once USER logs OUT
//     useEffect(() => {
//         if (!isLoggedIn) {
//             // Clear in-memory cart and remove user local storage cart when logged out
//             dispatch({ type: "CLEAR_CART" });
//             removeLocal(USER_CART_KEY);
          
//             // if visitor_cart to remain after logout, remove the next line.
//             // removeLocal(VISITOR_CART_KEY);

//         }
//     }, [isLoggedIn]);


//     // ----------------------------
//     // Always update reducer first (fast UI), then sync with backend if logged in
//     // ----------------------------

//     const addProductToCart = async (product, quantity = 1) => {
//         dispatch({ type: "ADD_BOOK", payload: { ...product, quantity } })

//         if (isLoggedIn) {
//             try {
//                 await axios.post("/cart/add", {
//                     // userId: user.id,
//                     productId: product.id,
//                     qnty: quantity,
//                 });
//                 // Sync local "user_cart" with reduced state
//                 const newState = readLocal(USER_CART_KEY).length ? readLocal(USER_CART_KEY) : cartItems;
//                 writeLocal(USER_CART_KEY, newState);
//             } catch (error) {
//                 console.error("Error syncing cart with backend : ", error);
//             }
//         } else {
//               // visitor: visitor_cart persisted by effect
//         }
//     };



//     // REMOVE BOOK:

//     const removeProductFromCart = async (productId) => {

//         dispatch({ type: "REMOVE_BOOK", payload: { productId } });

//         if (isLoggedIn) {
//             try {
//                 await axios.post("/cart/remove", {
//                     productId,
//                     // userId: user.id
//                 });
//                 //update local copy
//                   writeLocal(USER_CART_KEY, readLocal(USER_CART_KEY).filter((it) => it.productId !== productId));
//             } catch (error) {
//                 console.error("Error removing book from backend : ", error);
//             }
//         }
//         else {
//               // visitor: visitor_cart persisted by effect
//         }
//     };


//     // UPDATE Qnty in the CART:

//     const updateQntyInCart = async (productId, quantity) => {
//         //Always update local state first
//         dispatch({ type: "UPDATE_QNTY", payload: { productId, quantity } });

//         if (isLoggedIn) {

//             try {
//                 await axios.post("/cart/update", {
//                     // userId: user.id,
//                     productId,
//                     quantity
//                 })
//                 // update local persisted user cart
//         writeLocal(USER_CART_KEY, readLocal(USER_CART_KEY)); // rely on effect/local read to be consistent

//             } catch (error) {
//                 console.error(" [CartContext] Error updating cart quantity in backend : ", error);
//             }
//         }else {
//       // visitor_cart persisted by effect
//     }
//     };

//     // CLEAR UP CART:
//     const clearCart = async () => {
//         dispatch({ type: "CLEAR_CART" });
    
//         if (isLoggedIn) {
//           try {
//             await axios.post("/cart/clear", { userId: user.id });
//             removeLocal(USER_CART_KEY);
//           } catch (err) {
//             console.error("[CartContext] Error clearing cart in backend:", err);
//           }
//         } else {
//           // visitor
//           removeLocal(VISITOR_CART_KEY);
//         }
//       };
    

//     // CART TOTALS calculation:
//     const calcTotalQnty = () =>
//         cartItems.reduce((count, item) => count + item.quantity, 0);
//     const calcTotalPrice = () =>
//         cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

//     return (
//         <CartContext.Provider
//             value={{
//                 cartItems,
//                 addProductToCart,
//                 removeProductFromCart,
//                 updateQntyInCart,
//                 clearCart,
//                 calcTotalPrice,
//                 calcTotalQnty
//             }}
//         >
//             {children}

//         </CartContext.Provider>
//     )
// }
// export const useCart = () => {
//     const context = useContext(CartContext);
//     if (!context) {
//         throw new Error("useCart must be used within a CartProvider");
//     }
//     return context;
// };




// import { createContext, useContext, useEffect, useReducer } from "react";
// import axios from "../../axios.config";
// import { GlobalContext } from "./GlobalContext";

/* =======================
   CONSTANTS
======================= */

const CartContext = createContext();

const VISITOR_CART_KEY = "visitor_cart";
const USER_CART_KEY = "user_cart";

/* =======================
   LOCAL STORAGE HELPERS
======================= */

const readLocal = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch {
    return [];
  }
};

const writeLocal = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

const removeLocal = (key) => {
  localStorage.removeItem(key);
};

/* =======================
   REDUCER
======================= */

const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_BOOK": {
      const { productId, quantity } = action.payload;
      const index = state.findIndex((i) => i.productId === productId);

      if (index !== -1) {
        const copy = [...state];
        copy[index] = {
          ...copy[index],
          quantity: copy[index].quantity + quantity,
        };
        return copy;
      }

      return [...state, action.payload];
    }

    case "REMOVE_BOOK":
      return state.filter((i) => i.productId !== action.payload.productId);

    case "UPDATE_QNTY":
      if (action.payload.quantity <= 0) {
        return state.filter((i) => i.productId !== action.payload.productId);
      }

      return state.map((i) =>
        i.productId === action.payload.productId
          ? { ...i, quantity: action.payload.quantity }
          : i
      );

    case "SET_CART":
      return action.payload;

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

  /* ---------- INIT STATE ---------- */

  const initialCart = isLoggedIn
    ? readLocal(USER_CART_KEY)
    : readLocal(VISITOR_CART_KEY);

  const [cartItems, dispatch] = useReducer(cartReducer, initialCart);

  /* =======================
     EFFECTS
  ======================= */

  // Visitor → persist cart locally
  useEffect(() => {
    if (!isLoggedIn) {
      writeLocal(VISITOR_CART_KEY, cartItems);
    }
  }, [cartItems, isLoggedIn]);

  // User login → load backend cart
  useEffect(() => {
    const loadBackendCart = async () => {
      if (!isLoggedIn) return;

      try {
        const { data } = await axios.get("/cart/me");
        const books = data?.cart?.books || [];

        dispatch({ type: "SET_CART", payload: books });
        writeLocal(USER_CART_KEY, books);
        removeLocal(VISITOR_CART_KEY);
      } catch (err) {
        console.error("[Cart] Failed to load backend cart", err);
      }
    };

    loadBackendCart();
  }, [isLoggedIn]);

  // User logout → clear user cart
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
    dispatch({ type: "ADD_BOOK", payload: { ...product, quantity } });

    if (isLoggedIn) {
      try {
        await axios.post("/cart/add", {
          productId: product.productId,
          qnty: quantity,
        });
        writeLocal(USER_CART_KEY, cartItems);
      } catch (err) {
        console.error("[Cart] Add failed", err);
      }
    }
  };

  const removeProductFromCart = async (productId) => {
    dispatch({ type: "REMOVE_BOOK", payload: { productId } });

    if (isLoggedIn) {
      try {
        await axios.post("/cart/remove", { productId });
        writeLocal(USER_CART_KEY, cartItems);
      } catch (err) {
        console.error("[Cart] Remove failed", err);
      }
    }
  };

  const updateQntyInCart = async (productId, quantity) => {
    dispatch({ type: "UPDATE_QNTY", payload: { productId, quantity } });

    if (isLoggedIn) {
      try {
        await axios.post("/cart/update", { productId, quantity });
        writeLocal(USER_CART_KEY, cartItems);
      } catch (err) {
        console.error("[Cart] Update failed", err);
      }
    }
  };

  const clearCart = async () => {
    dispatch({ type: "CLEAR_CART" });

    if (isLoggedIn) {
      try {
        await axios.post("/cart/clear");
        removeLocal(USER_CART_KEY);
      } catch (err) {
        console.error("[Cart] Clear failed", err);
      }
    } else {
      removeLocal(VISITOR_CART_KEY);
    }
  };

  /* =======================
     DERIVED DATA
  ======================= */

  const calcTotalQnty = () =>
    cartItems.reduce((sum, i) => sum + i.quantity, 0);

  const calcTotalPrice = () =>
    cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

  /* =======================
     CONTEXT VALUE
  ======================= */

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addProductToCart,
        removeProductFromCart,
        updateQntyInCart,
        clearCart,
        calcTotalQnty,
        calcTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

/* =======================
   HOOK
======================= */

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
};

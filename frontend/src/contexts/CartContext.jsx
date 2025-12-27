import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useState
} from "react";
import { GlobalContext } from "./GlobalContext";
import axios from "../../axios.config";

// const CartContext = createContext();

// const VISITOR_CART_KEY = "visitor_cart";
// const USER_CART_KEY = "user_cart";

// /* =======================
//    LOCAL STORAGE HELPERS
// ======================= */
// const readLocal = (key) => {
//   try {
//     return JSON.parse(localStorage.getItem(key)) || [];
//   } catch {
//     return [];
//   }
// };

// const writeLocal = (key, data) =>
//   localStorage.setItem(key, JSON.stringify(data));

// const removeLocal = (key) => localStorage.removeItem(key);

// /* =======================
//    REDUCER
// ======================= */
// const cartReducer = (state, action) => {
//   switch (action.type) {
//     case "SET_CART":
//       console.log("[Reducer] SET_CART", action.payload);
//       return action.payload;

//     case "ADD_BOOK": {
//       const idx = state.findIndex(
//         (i) => i.productId === action.payload.productId
//       );
//       if (idx !== -1) {
//         const copy = [...state];
//         copy[idx] = {
//           ...copy[idx],
//           quantity: copy[idx].quantity + action.payload.quantity,
//         };
//         console.log("[Reducer] ADD_BOOK updated", copy[idx]);
//         return copy;
//       }
//       console.log("[Reducer] ADD_BOOK added", action.payload);
//       return [...state, action.payload];
//     }

//     case "UPDATE_QNTY":
//       if (action.payload.quantity <= 0) {
//         console.log("[Reducer] UPDATE_QNTY remove", action.payload.productId);
//         return state.filter((i) => i.productId !== action.payload.productId);
//       } else {
//         console.log("[Reducer] UPDATE_QNTY update", action.payload);
//         return state.map((i) =>
//           i.productId === action.payload.productId
//             ? { ...i, quantity: action.payload.quantity }
//             : i
//         );
//       }

//     case "REMOVE_BOOK":
//       console.log("[Reducer] REMOVE_BOOK", action.payload.productId);
//       return state.filter((i) => i.productId !== action.payload.productId);

//     case "CLEAR_CART":
//       console.log("[Reducer] CLEAR_CART");
//       return [];

//     default:
//       return state;
//   }
// };

// /* =======================
//    PROVIDER
// ======================= */
// export const CartProvider = ({ children }) => {
//   const { user } = useContext(GlobalContext);
//   const isLoggedIn = Boolean(user);
//   const isAdmin = user?.role === "admin";

//   const [cartItems, dispatch] = useReducer(cartReducer, []);
//   const [visitorCart, setVisitorCart] = useState(readLocal(VISITOR_CART_KEY));
//   const [showMergeModal, setShowMergeModal] = useState(false);
//   const [stockIssues, setStockIssues] = useState([]);

//   console.log("[Init] visitorCart:", visitorCart, "isLoggedIn:", isLoggedIn);

//   /* =======================
//      SYNC CART TO LOCAL STORAGE
//   ======================= */
//   useEffect(() => {
//     if (isAdmin) return;
//     const key = isLoggedIn ? USER_CART_KEY : VISITOR_CART_KEY;
//     writeLocal(key, cartItems);
//     console.log("[Sync] Saved cart to localStorage:", key, cartItems);
//   }, [cartItems, isLoggedIn, isAdmin]);

//   /* =======================
//      FETCH BACKEND CART ON LOGIN
//   ======================= */
//   useEffect(() => {
//     if (isLoggedIn && !isAdmin) {
//       const fetchCart = async () => {
//         try {
//           console.log("[Fetch] Fetching backend cart for user...");
//           const { data } = await axios.get("/cart/me");
//           console.log("[Fetch] Backend cart fetched:", data.cart.books);
//           dispatch({ type: "SET_CART", payload: data.cart.books || [] });

//           if (visitorCart.length > 0) {
//             console.log("[Fetch] Visitor cart exists, showing merge modal");
//             setShowMergeModal(true);
//           }
//         } catch (err) {
//           console.error("[Fetch] Failed to get backend cart", err);
//         }
//       };
//       fetchCart();
//     } else if (!isLoggedIn) {
//       // For guest users, load visitor cart
//       dispatch({ type: "SET_CART", payload: visitorCart });
//     }
//   }, [isLoggedIn, isAdmin]);

//   /* =======================
//      MERGE HANDLERS
//   ======================= */
//  const handleMergeCarts = async () => {
//   try {
//     console.log("[Merge] Merging visitor cart into backend...", visitorCart);

//     const { data } = await axios.post("/cart/merge", {
//       items: visitorCart // must be an array of {productId, quantity, ...}
//     });

//     console.log("[Merge] Merge response:", data);
//     dispatch({ type: "SET_CART", payload: data.cart.books });

//     if (data.stockIssues?.length > 0) setStockIssues(data.stockIssues);

//     setVisitorCart([]);
//     removeLocal(VISITOR_CART_KEY);
//   } catch (err) {
//     console.error("[Merge] Merge failed", err);
//   } finally {
//     setShowMergeModal(false);
//   }
// };

//   const handleKeepUserCart = async () => {
//     try {
//       console.log("[Keep] Keeping backend cart, discarding visitor cart");
//       const { data } = await axios.get("/cart/me");
//       dispatch({ type: "SET_CART", payload: data.cart.books || [] });

//       setVisitorCart([]);
//       removeLocal(VISITOR_CART_KEY);
//     } catch (err) {
//       console.error("[Keep] Fetch cart failed", err);
//     } finally {
//       setShowMergeModal(false);
//     }
//   };

//   /* =======================
//      CART ACTIONS
//   ======================= */
//   const addProductToCart = async (product, quantity = 1) => {
//     if (isAdmin) return;

//     dispatch({ type: "ADD_BOOK", payload: { ...product, quantity } });

//     if (isLoggedIn) {
//       try {
//         console.log("[Action] Add product to backend cart", product.productId, quantity);
//         await axios.post("/cart/add", { productId: product.productId, qnty: quantity });
//       } catch (err) {
//         console.error("[Action] Add product failed", err);
//       }
//     }
//   };

//   const updateQntyInCart = async (productId, quantity) => {
//     dispatch({ type: "UPDATE_QNTY", payload: { productId, quantity } });

//     if (isLoggedIn) {
//       try {
//         console.log("[Action] Update quantity in backend", productId, quantity);
//         await axios.post("/cart/update", { productId, quantity });
//       } catch (err) {
//         console.error("[Action] Update quantity failed", err);
//       }
//     }
//   };

//   const removeProductFromCart = async (productId) => {
//     dispatch({ type: "REMOVE_BOOK", payload: { productId } });

//     if (isLoggedIn) {
//       try {
//         console.log("[Action] Remove product from backend", productId);
//         await axios.post("/cart/remove", { productId });
//       } catch (err) {
//         console.error("[Action] Remove product failed", err);
//       }
//     }
//   };

//   const clearCart = async () => {
//     dispatch({ type: "CLEAR_CART" });

//     if (isLoggedIn) {
//       try {
//         console.log("[Action] Clear backend cart");
//         await axios.post("/cart/clear");
//       } catch (err) {
//         console.error("[Action] Clear backend cart failed", err);
//       }
//     }
//   };

//   const calcTotalQnty = () =>
//     cartItems.reduce((sum, i) => sum + i.quantity, 0);

//   const calcTotalPrice = () =>
//     cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

//   /* =======================
//      PROVIDER VALUE
//   ======================= */
//   return (
//     <CartContext.Provider
//       value={{
//         cartItems,
//         addProductToCart,
//         updateQntyInCart,
//         removeProductFromCart,
//         clearCart,
//         calcTotalQnty,
//         calcTotalPrice,
//         showMergeModal,
//         handleMergeCarts,
//         handleKeepUserCart,
//         stockIssues,
//         visitorCart,
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// };

// /* =======================
//    HOOK
// ======================= */
// export const useCart = () => {
//   const ctx = useContext(CartContext);
//   if (!ctx) throw new Error("useCart must be used inside CartProvider");
//   return ctx;
// };

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

const writeLocal = (key, data) => localStorage.setItem(key, JSON.stringify(data));
const removeLocal = (key) => localStorage.removeItem(key);

/* =======================
   REDUCER
======================= */
const cartReducer = (state, action) => {
  switch (action.type) {
    case "SET_CART":
      console.log("[Reducer] SET_CART", action.payload);
      return action.payload;

    case "ADD_BOOK": {
      const idx = state.findIndex((i) => i.productId === action.payload.productId);
      if (idx !== -1) {
        const copy = [...state];
        copy[idx] = { ...copy[idx], quantity: copy[idx].quantity + action.payload.quantity };
        console.log("[Reducer] ADD_BOOK updated", copy[idx]);
        return copy;
      }
      console.log("[Reducer] ADD_BOOK added", action.payload);
      return [...state, action.payload];
    }

    case "UPDATE_QNTY":
      if (action.payload.quantity <= 0) {
        console.log("[Reducer] UPDATE_QNTY remove", action.payload.productId);
        return state.filter((i) => i.productId !== action.payload.productId);
      } else {
        console.log("[Reducer] UPDATE_QNTY update", action.payload);
        return state.map((i) =>
          i.productId === action.payload.productId ? { ...i, quantity: action.payload.quantity } : i
        );
      }

    case "REMOVE_BOOK":
      console.log("[Reducer] REMOVE_BOOK", action.payload.productId);
      return state.filter((i) => i.productId !== action.payload.productId);

    case "CLEAR_CART":
      console.log("[Reducer] CLEAR_CART");
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

  const [cartItems, dispatch] = useReducer(cartReducer, []);
  const [visitorCart, setVisitorCart] = useState(readLocal(VISITOR_CART_KEY));
  const [showMergeModal, setShowMergeModal] = useState(false);
  const [stockIssues, setStockIssues] = useState([]);
  

  console.log("[Init] visitorCart:", visitorCart, "isLoggedIn:", isLoggedIn);

  /* =======================
     SYNC CART TO LOCAL STORAGE
  ======================== */
  useEffect(() => {
    if (isAdmin) return;

    if (isLoggedIn) {
      writeLocal(USER_CART_KEY, cartItems);
      console.log("[Sync] Saved cart to localStorage:", USER_CART_KEY, cartItems);
    } else {
      setVisitorCart(cartItems); // sync visitorCart state
      writeLocal(VISITOR_CART_KEY, cartItems);
      console.log("[Sync] Saved cart to localStorage:", VISITOR_CART_KEY, cartItems);
    }
  }, [cartItems, isLoggedIn, isAdmin]);

  /* =======================
     FETCH BACKEND CART ON LOGIN
  ======================== */
  useEffect(() => {
    if (isLoggedIn && !isAdmin) {
      const fetchCart = async () => {
        try {
          console.log("[Fetch] Fetching backend cart for user...");
          const { data } = await axios.get("/cart/me");
          const backendBooks = data.cart?.books || [];
          console.log("[Fetch] Backend cart fetched:", backendBooks);

          dispatch({ type: "SET_CART", payload: backendBooks });

          if (visitorCart.length > 0) {
            console.log("[Fetch] Visitor cart exists, showing merge modal");
            setShowMergeModal(true);
          }
        } catch (err) {
          console.error("[Fetch] Failed to get backend cart", err);
        }
      };
      fetchCart();
    } else if (!isLoggedIn) {
      // guest user → load visitorCart
      dispatch({ type: "SET_CART", payload: visitorCart });
    }
  }, [isLoggedIn, isAdmin]);

  /* =======================
     MERGE HANDLERS
  ======================== */
 const handleMergeCarts = async () => {
  try {
    console.log("[Merge] Sending visitor cart:", visitorCart);

    const { data } = await axios.post("/cart/merge", {
      items: visitorCart,
    });

    console.log("[Merge] Response:", data);

    // Update cart from backend
    dispatch({
      type: "SET_CART",
      payload: data.cart.books,
    });

    // Save stock issues for UI
    const issues = data.stockIssues || [];
    setStockIssues(issues);

    // Clear visitor cart (merge is done)
    setVisitorCart([]);
    removeLocal(VISITOR_CART_KEY);

    // ✅ ONLY close modal if no stock issues
    if (issues.length === 0) {
      setShowMergeModal(false);
    }

  } catch (err) {
    console.error("[Merge] Failed:", err);
  }
};

const closeMergeModal = () => {
  setStockIssues([]);
  setShowMergeModal(false);
};
  const handleKeepUserCart = async () => {
    try {
      console.log("[Keep] Keeping backend cart, discarding visitor cart");
      const { data } = await axios.get("/cart/me");
      dispatch({ type: "SET_CART", payload: data.cart.books || [] });

      setVisitorCart([]);
      removeLocal(VISITOR_CART_KEY);
    } catch (err) {
      console.error("[Keep] Fetch cart failed", err);
    } finally {
      setShowMergeModal(false);
    }
  };

  /* =======================
     CART ACTIONS
  ======================== */
  const addProductToCart = async (product, quantity = 1) => {
    if (isAdmin) return;

    dispatch({ type: "ADD_BOOK", payload: { ...product, quantity } });

    if (isLoggedIn) {
      try {
        console.log("[Action] Add product to backend cart", product.productId, quantity);
        await axios.post("/cart/add", { productId: product.productId, qnty: quantity });
      } catch (err) {
        console.error("[Action] Add product failed", err);
      }
    }
  };

  const updateQntyInCart = async (productId, quantity) => {
    dispatch({ type: "UPDATE_QNTY", payload: { productId, quantity } });

    if (isLoggedIn) {
      try {
        console.log("[Action] Update quantity in backend", productId, quantity);
        await axios.post("/cart/update", { productId, quantity });
      } catch (err) {
        console.error("[Action] Update quantity failed", err);
      }
    }
  };

  const removeProductFromCart = async (productId) => {
    dispatch({ type: "REMOVE_BOOK", payload: { productId } });

    if (isLoggedIn) {
      try {
        console.log("[Action] Remove product from backend", productId);
        await axios.post("/cart/remove", { productId });
      } catch (err) {
        console.error("[Action] Remove product failed", err);
      }
    }
  };

  const clearCart = async () => {
    dispatch({ type: "CLEAR_CART" });

    if (isLoggedIn) {
      try {
        console.log("[Action] Clear backend cart");
        await axios.post("/cart/clear");
      } catch (err) {
        console.error("[Action] Clear backend cart failed", err);
      }
    }
  };

  const calcTotalQnty = () => cartItems.reduce((sum, i) => sum + i.quantity, 0);
  const calcTotalPrice = () => cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

  /* =======================
     PROVIDER VALUE
  ======================== */
  return (
    <CartContext.Provider
      value={{
        cartItems,
        addProductToCart,
        updateQntyInCart,
        removeProductFromCart,
        clearCart,
        calcTotalQnty,
        calcTotalPrice,
        showMergeModal,
        closeMergeModal,
        handleMergeCarts,
        handleKeepUserCart,
        stockIssues,
        visitorCart,
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
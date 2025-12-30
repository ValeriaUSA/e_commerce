import {
    createContext,
    useContext,
    useReducer,
    useEffect,
    useState
} from "react";
import { GlobalContext } from "./GlobalContext";
import axios from "../../axios.config";
import { useNavigate } from "react-router-dom";


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
                copy[idx] = {
                    ...copy[idx],
                    quantity: Math.min(
                        copy[idx].quantity + action.payload.quantity,
                        copy[idx].stock ?? Infinity
                    ),
                };
                console.log("[Reducer] ADD_BOOK updated", copy[idx]);
                return copy;
            }
            console.log("[Reducer] ADD_BOOK added", action.payload);
            return [...state, action.payload];
        }



        case "UPDATE_QNTY": {
            const { productId, quantity } = action.payload;

            console.log("[Reducer] UPDATE_QNTY action received:", {
                productId,
                requestedQuantity: quantity,
            });

            //  Remove product if quantity <= 0
            if (quantity <= 0) {
                console.log(
                    "[Reducer] UPDATE_QNTY → removing product from cart:",
                    productId
                );

                return state.filter((i) => i.productId !== productId);
            }

            return state.map((i) => {
                if (i.productId !== productId) return i;

                const maxStock = i.stock ?? Infinity;
                const finalQuantity = Math.min(quantity, maxStock);

                console.log("[Reducer] UPDATE_QNTY → updating product:", {
                    productId: i.productId,
                    currentQuantity: i.quantity,
                    requestedQuantity: quantity,
                    availableStock: i.stock,
                    finalQuantity,
                    wasClamped: finalQuantity !== quantity,
                });

                return {
                    ...i,
                    quantity: finalQuantity,
                };
            });
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

    const navigate = useNavigate();
    const { user } = useContext(GlobalContext);
    const isLoggedIn = Boolean(user);
    const isAdmin = user?.role?.toUpperCase() === "ADMIN";

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

        // ADMIN → ignore cart 
        if (isLoggedIn && isAdmin) {
            console.log("[Cart] Admin logged in → cart disabled");

            dispatch({ type: "SET_CART", payload: [] });
            setShowMergeModal(false);

            return;
        }

        // 👤 USER 
        if (isLoggedIn && !isAdmin) {
            const fetchCart = async () => {
                try {
                    const { data } = await axios.get("/cart/me");
                    const backendBooks = data.cart?.books || [];

                    const enrichedCart = backendBooks.map(b => ({
                        ...b,
                        stock: b.quantity ?? 0,
                    }));

                    dispatch({ type: "SET_CART", payload: enrichedCart });

                    //  merge Modal
                    if (visitorCart.length > 0) {
                        console.log("[Fetch] Visitor cart exists → show merge modal");
                        setShowMergeModal(true);
                    }
                } catch (err) {
                    console.error("[Fetch] Failed to get backend cart", err);
                }
            };
            fetchCart();
        }

        // VISITOR
        if (!isLoggedIn) {
            const enrichedVisitorCart = visitorCart.map(b => ({
                ...b,
                stock: b.quantity ?? 0,
            }));

            dispatch({ type: "SET_CART", payload: enrichedVisitorCart });
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

            // ONLY close modal if no stock issues
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

        const productWithStock = {
            ...product,
            stock: product.stock ?? product.quantity ?? 0,
            quantity,
        };
        dispatch({ type: "ADD_BOOK", payload: productWithStock });

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

    const checkoutCart = async () => {

        if (!isLoggedIn) {
            console.log("[Checkout] Visitor detected → redirecting to login");
            navigate("/login", { state: { from: "/" } }); // redirect back after login
            return;
        }

        if (cartItems.length === 0) {
            alert("Your cart is empty.");
            return;
        }

        try {
            const { data } = await axios.post("/orders/checkout");

            // Data contains { orderId, newCartId }
            console.log("[Checkout] Order created:", data.orderId);

            // Clear current cart in state
            dispatch({ type: "CLEAR_CART" });

            // Optional: fetch new active cart from backend if needed
            if (data.newCartId) {
                console.log("[Checkout] New active cart created:", data.newCartId);
            }

            alert("Order successfully placed! Order ID: " + data.orderId);

        } catch (err) {
            console.error("[Checkout] Failed:", err);
            if (err.response?.data?.error) {
                alert(err.response.data.error);
            } else {
                alert("Checkout failed. Please try again.");
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
                checkoutCart,
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
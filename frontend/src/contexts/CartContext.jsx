import { useContext } from "react";
import { useEffect } from "react";
import { createContext } from "react";
import { useReducer } from "react";
import { GlobalContext } from "./GlobalContext";
import axios from "../../axios.config";

const CartContext = createContext();

const VISITOR_CART_KEY = "visitor_cart"; //localStorage for visitor persists
const USER_CART_KEY = "user_cart"; //  for lof-in user synced w backend



// Read/Write local storage

const readLocal = (key) => {
    try {
        const localContent = localStorage.getItem(key)
        return localContent ? JSON.parse(localContent) : []
    } catch (error) {
        console.error(`[CartContext] Error reading ${key} from localStorage`, error);
        return []
    }
};

const writeLocal = (key, data) => {
    try {
        localStorage.setItem(key, JSON.stringify(data))
    } catch (error) {
        console.error(`[CartContext] Error writing ${key} to localStorage`, error);
    }
}


const removeLocal = (key) => {
    try {
        localStorage.removeItem(key)
    } catch (error) {
        console.error(`[CartContext] Error removing  ${key} from localStorage`, error);
    }
}


// REDUCER to manage CART STATE:

const cartReducer = (state, action) => {
    switch (action.type) {

        case "ADD_BOOK": {

            // 1. Extract data (productId and quantity) from the action payload.
            // The payload comes from the dispatch() call in your addProduct() function.
            // Example: dispatch({ type: "ADD_ITEM", payload: { productId: "B001", quantity: 2 } })
            const { productId, quantity } = action.payload;
            const index = state.findIndex(item => item.productId === productId); // this product already exists in the cart ? "state" here is the current array of cart items

            if (index > -1) {
                const copy = [...state]; //a copy of the current cart (never mutate state directly !!!)
                copy[index] = { ...copy[index], quantity: copy[index].quantity + quantity }

                return copy;
            }
            //  Case when the book is not yet in Cart. Return a new array with all current items + the new one (from the payload)
            return [...state, action.payload]
        }

        case "REMOVE_BOOK": {
            const productIdToRemove = action.payload.productId; // extract from object
            return state.filter(item => item.productId !== productIdToRemove);
        }
        case "UPDATE_QNTY": {
            const { productId, quantity } = action.payload;
            if (quantity <= 0) return state.filter(item => item.productId !== productId)
            return state.map(item =>
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
            return state
    }
}

//PROVIDER

export const CartProvider = ({ children }) => {
    const { user } = useContext(GlobalContext);
    const isLoggedIn = !!user; //!! ensures it’s always a simple boolean, not an object or null.
    // const customerId = user?.customerId; // wo ? will throw error if user is null
    // const cartId = user?.cartId;

    const getCartLocalStorage = isLoggedIn ? readLocal(USER_CART_KEY) : readLocal(VISITOR_CART_KEY)

    // const [state, dispatch] = useReducer(reducerFunction, initialState, initFunction);
    const [cartItems, dispatch] = useReducer(cartReducer, getCartLocalStorage);


    // VISITOR (not logged) changes cart -> keep changes in VISITOR_CART_KEY

    useEffect(() => {
        if (!isLoggedIn) {
            writeLocal(VISITOR_CART_KEY, cartItems)
        }
    }, [cartItems, isLoggedIn]);

    // ---Once USER logs IN : load backend cart, persist under USER_CART_KEY, and REMOVE visitor_cart

    useEffect(() => {
        const loadBackendCart = async () => {
            if (isLoggedIn && user?.id) {
                try {
                    // gets user's cart info from backend
                    const response = await axios.get(`/cart/${user.id}`);
                    const backendCart = response.data.cart || { books: [] };

                    // ✅ Map over the books array, not the cart object itself
                    const normalizedCart = (backendCart.books || []).map((item) => ({
                        ...item,
                        quantity: item.qnty ?? item.quantity ?? 1,
                    }));

                    // Update reducer state with normalized cart
                    dispatch({ type: "SET_CART", payload: normalizedCart });

                    // Save synchronized user cart
                    localStorage.setItem(USER_CART_KEY, JSON.stringify(normalizedCart));

                    // Remove visitor cart now that a user is logged in
                    localStorage.removeItem(VISITOR_CART_KEY);

                    console.log("✅ [CartContext] Loaded backend cart and removed visitor_cart:", normalizedCart);

                } catch (error) {
                    console.error("❌ [CartContext] Error loading backend cart:", error);
                    // Keep whatever local cart exists if backend fails
                }
            }
        };

        loadBackendCart();
    }, [isLoggedIn, user?.id]);

    // ---Once USER logs OUT
    useEffect(() => {
        if (!isLoggedIn) {
            // Clear in-memory cart and remove user local storage cart when logged out
            dispatch({ type: "CLEAR_CART" });
            removeLocal(USER_CART_KEY);
          
            // if visitor_cart to remain after logout, remove the next line.
            // removeLocal(VISITOR_CART_KEY);

        }
    }, [isLoggedIn]);


    // ----------------------------
    // Always update reducer first (fast UI), then sync with backend if logged in
    // ----------------------------

    const addProductToCart = async (product, quantity = 1) => {
        dispatch({ type: "ADD_BOOK", payload: { ...product, quantity } })

        if (isLoggedIn) {
            try {
                await axios.post("/cart/add", {
                    userId: user.id,
                    productId: product.id,
                    qnty: quantity,
                });
                // Sync local "user_cart" with reduced state
                const newState = readLocal(USER_CART_KEY).length ? readLocal(USER_CART_KEY) : cartItems;
                writeLocal(USER_CART_KEY, newState);
            } catch (error) {
                console.error("Error syncing cart with backend : ", error);
            }
        } else {
              // visitor: visitor_cart persisted by effect
        }
    };



    // REMOVE BOOK:

    const removeProductFromCart = async (productId) => {

        dispatch({ type: "REMOVE_BOOK", payload: { productId } });

        if (isLoggedIn) {
            try {
                await axios.post("/cart/remove", {
                    productId,
                    userId: user.id
                });
                //update local copy
                  writeLocal(USER_CART_KEY, readLocal(USER_CART_KEY).filter((it) => it.productId !== productId));
            } catch (error) {
                console.error("Error removing book from backend : ", error);
            }
        }
        else {
              // visitor: visitor_cart persisted by effect
        }
    };


    // UPDATE Qnty in the CART:

    const updateQntyInCart = async (productId, quantity) => {
        //Always update local state first
        dispatch({ type: "UPDATE_QNTY", payload: { productId, quantity } });

        if (isLoggedIn) {

            try {
                await axios.post("/cart/update", {
                    userId: user.id,
                    productId,
                    quantity
                })
                // update local persisted user cart
        writeLocal(USER_CART_KEY, readLocal(USER_CART_KEY)); // rely on effect/local read to be consistent

            } catch (error) {
                console.error(" [CartContext] Error updating cart quantity in backend : ", error);
            }
        }else {
      // visitor_cart persisted by effect
    }
    };

    // CLEAR UP CART:

    const clearCart = async () => {
        dispatch({ type: "CLEAR_CART" });
    
        if (isLoggedIn) {
          try {
            await axios.post("/cart/clear", { userId: user.id });
            removeLocal(USER_CART_KEY);
          } catch (err) {
            console.error("[CartContext] Error clearing cart in backend:", err);
          }
        } else {
          // visitor
          removeLocal(VISITOR_CART_KEY);
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
                calcTotalQnty
            }}
        >
            {children}

        </CartContext.Provider>
    )
}
export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};



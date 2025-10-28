import { useContext } from "react";
import { useEffect } from "react";
import { createContext } from "react";
import { useReducer } from "react";
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

            // 1. Extract data (productId and quantity) from the action payload.
            // The payload comes from the dispatch() call in your addProduct() function.
            // Example: dispatch({ type: "ADD_ITEM", payload: { productId: "B001", quantity: 2 } })
            const { productId, quantity } = action.payload;
            const existingIndex = state.findIndex(item => item.productId === productId); // this product already exists in the cart ? "state" here is the current array of cart items

            if (existingIndex > -1) {
                const newState = [...state]; //a copy of the current cart (never mutate state directly !!!)
                newState[existingIndex].quantity += quantity;

                return newState;
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
    const customerId = user?.customerId; // wo ? will throw error if user is null
    const cartId = user?.cartId;

    // const [state, dispatch] = useReducer(reducerFunction, initialState, initFunction);
    const [cartItems, dispatch] = useReducer(cartReducer, [], getCartLocalStorage);


    //LOAD BACKEND CART WHEN USER LOGGs IN
 useEffect(() => {
  const loadBackendCart = async () => {
    if (isLoggedIn && user?.id) {
      try {
        console.log("🔥 [CartContext] Fetching backend cart for user:", user.id);

        const response = await axios.get(`/cart/${user.id}`);

        // ✅ Fix: cart from backend is an object with cartId and books array
        const backendCart = response.data.cart || { books: [] };

        // ✅ Map over the books array, not the cart object itself
        const normalizedCart = (backendCart.books || []).map((item) => ({
          ...item,
          quantity: item.qnty ?? item.quantity ?? 1,
        }));

        // ✅ Dispatch normalized cart items to reducer
        dispatch({ type: "SET_CART", payload: normalizedCart });

        // ✅ Update localStorage for visitor_cart
        localStorage.setItem(CART_LOCAL, JSON.stringify(normalizedCart));

        console.log("✅ [CartContext] Backend cart loaded:", normalizedCart);
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
    }, [cartItems, isLoggedIn]); //re-run this effect whenever any value in [cartItems, isLoggedIn] array changes


    // ADD BOOK

    const addProductToCart = async (product, quantity = 1) => {
        dispatch({ type: "ADD_BOOK", payload: { ...product, quantity } })

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
                    userId: user.id
                });
            } catch (error) {
                console.error("Error removing book from backend : ", error);
            }
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

            } catch (error) {
                console.error(" [CartContext] Error updating cart quantity in backend : ", error);
            }
        }
    };

    // CLEAR UP CART:

    const clearCart = async (cartId) => {
        dispatch({ type: "CLEAR_CART", payload: { cartId } });

        if (!isLoggedIn) {
            localStorage.removeItem(CART_LOCAL);
        } else {
            // API to clear the cart in DB
            try {
                await axios.post(`/cart/clear`, { cartId })
            } catch (error) {
                console.error("Error clearing cart in backend:", error);
            }
        };
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



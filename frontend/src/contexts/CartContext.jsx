import { useEffect } from "react";
import { createContext, useState, useContext } from "react";
import { set } from "react-hook-form";

const CartContext = createContext();

//Local storage key to store the user cart details
const CART_LOCAL = "visitor cart"

//Get cart data from localStorage : function
const getCartLocalStorage = () => {

    try {

        const storedCart = localStorage.getItem(CART_LOCAL);
        return storedCart ? JSON.parse(storedCart) : [];

    } catch (error) {
        console.error("🔴Error reading from local storage:", error);
        return [];
    }
}

// Provider component
export const CartProvider = ({ children }) => {
    // the value from local storage we put to state
    const [cartItems, setCartItems] = useState(getCartLocalStorage)

    // useEffect to insert changes to local storage once there is any change

    useEffect(() => {
        try {
            localStorage.setItem(CART_LOCAL, JSON.stringify(cartItems))
        }
        catch (error) {
            console.error("🔴Error writing to local storage:", error);
        };
    },
        [cartItems] //Re-run effect whenever cartItems change
    )

//ACTIONs with a cart

const addProduct =(product, quantity = 1) => {

    //safe way to update State [take into concideration the current/prev state]
setCartItems (prevItems => {
    const existingItemIndex = prevItems.findIndex(item =>item.id ===product.id);
        
    // case this book is already in the card (checking by id)
        if (existingItemIndex > -1) {
            const newItems = [...prevItems];
            newItems[existingItemIndex].quantity += quantity;
            return newItems;
        }else
            //add a new product
            return [...prevItems, {...product, quantity}];
});

};

//REMOVE THIS PRODUCT FROM CART

const removeProduct = (productId) => {
    setCartItems(prevItems=> prevItems.filter(item=> item.id !==productId));
};

//UPDATE PRODUCT QNTY

const updateQnty = (productId, newQnty) => {
    if(newQnty<=0) {
        removeProduct(productId);
        return;
    }

    setCartItems(prevItems =>
        prevItems.map(item =>
            item.id===productId ? {...item, quantity: newQnty} : item
        )

    );
};

//CLEAR UP the CART. Note: The CartProvider includes a useEffect that watches for any changes to the cartItems state and immediately synchronizes that state with localStorage
const clearCart = () => {
    setCartItems([])
};

//******CART CALCUL FUNCTIONs */

const calcTotalPrice = () => {
    return cartItems.reduce((total, item)=> total +item.price*item.quantity,0)
}

const calcTotalQnty = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0)
}

// Values provided to vomponents

const cartContextValue = {
    cartItems,
    addProduct,
    removeProduct,
    updateQnty,
    clearCart,
    calcTotalPrice,
    calcTotalQnty,
};


return (

    <CartContext.Provider value={cartContextValue}>
        {children}
    </CartContext.Provider>
);

};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};




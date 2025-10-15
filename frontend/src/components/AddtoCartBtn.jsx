import { useCart } from "../contexts/CartContext";


export default function AddToCartButton ({product}) {
 
    // Destructure the addProduct function from the custom hook
    const {addProduct} = useCart();

    const handleAddToCart = () => {
        const productForCart = {
            ...product,
            id : product.productId, // different naming in API JSON file and at next steps
        }
        addProduct(productForCart, 1);
    }
    
    return (
        <button onClick ={handleAddToCart}>
        Add to Cart
        </button>
    )
}



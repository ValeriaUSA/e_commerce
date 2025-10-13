import { useCart } from "../contexts/CartContext";


export default function AddToCartButton ({product}) {
 
    // Destructure the addProduct function from the custom hook
    const {addProduct} = useCart();

    const handleAddToCart = () => {
        addProduct(product,1 );
    }

    return (
        <button onClick ={handleAddToCart}>
        Add to Cart
        </button>
    )
}
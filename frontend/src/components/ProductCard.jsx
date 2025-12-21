import AddToCartButton from "./AddtoCartBtn";
import { BsCartCheckFill } from "react-icons/bs";
import { useCart } from "../contexts/CartContext";

export default function ProductCard({ product }) {
  const price = product.price ? parseFloat(product.price) : 0;
  const isBestseller = Boolean(product.isbestseller);

  // Get cart items from context
  const { cartItems } = useCart();

  // Check if the product is in the cart
  const isInCart = cartItems.some(item => item.productId === product.productId);


  // console.log("🐞 Debugging:", product.title, "isInCart:", isInCart);



  console.log("Product:", product.title, "isInCart:", isInCart);

  return (
    <div className="card h-100 w-100 product-card-custom shadow-sm">
      {/* Cart icon if in cart */}
      {isInCart && (
        <div className="position-absolute top-0 end-0 p-2 text-primary fs-4">
          <BsCartCheckFill title="Already in your Cart" />
        </div>
      )}
      <div className="product-image-container">
        <img
          src={product.imgurl}
          alt={product.title}
          className="card-img-top book-cover-img"
        />
      </div>
      <div className="card-body d-flex flex-column">
        <h2>{product.productId}</h2> 
        <h5 className="card-title fw-bold literary-heading">{product.title}</h5>
        <p className="card-text text-muted small mb-1">Author: {product.author}</p>
        <p className="card-text text-muted small mb-2">Genre: {product.category_name}</p>

        <div className="d-flex justify-content-between align-items-center mb-3 mt-auto">
          <p className="h4 fw-bold text-success mb-0">EUR {price.toFixed(2)}</p>
          {isBestseller && (
            <span className="badge bg-warning text-dark">Bestseller</span>
          )}
        </div>
        <p className="small text-warning mb-2">
          {product.stars} ({product.reviews} reviews)
        </p>


        {product.publisheddate && (
          <p className="card-text text-muted mt-1" style={{ fontSize: '0.75rem' }}>
            Published: {new Date(product.publisheddate).toLocaleDateString()}
          </p>
        )}

        <AddToCartButton product={product} className="btn-primary w-100 book-btn-primary" />
      </div>
    </div>
  );
}


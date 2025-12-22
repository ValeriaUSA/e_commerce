/* CartProduct Styles */
.cart-product {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0.75rem;
  border-bottom: 1px solid #eee;
  gap: 0.75rem;
  width: 100%;
}
/* Ensure title takes full width */
.cart-product-title {
  width: 100%;
  font-size: 0.95rem;
  line-height: 1.2rem;
  display: block; 
}
/* Target the second row specifically */
.cart-product > .flex-row {
  display: flex;
  flex-direction: row;
  width: 100%;
  align-items: center;
}



.quantity-controls input {
  border: 1px solid #ccc;
  border-radius: 0.25rem;
  padding: 0.25rem;
}

.quantity-controls button {
  background-color: var(--color-primary); /* keeps theme colors */
  color: white;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: background 0.2s;
}

.quantity-controls button:hover:not(:disabled) {
  background-color: var(--color-primary-dark); /* slightly darker hover */
}

.quantity-controls button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.cart-product button.text-red-500 {
  font-size: 1.25rem;
  background: transparent;
  border: none;
  cursor: pointer;
}
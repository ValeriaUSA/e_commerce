CART:


1. CartContent.jsx )	Component	Renders the actual cart items, totals, and buttons (CartProduct.jsx, total price, clear cart button). Contains all the logic.
2. CartOffcanvas.jsx	Component	Provides the visual structure (the slide-in panel) for the cart content. It receives the visibility state and toggle function as props.
3. isCartOpen State	App.jsx (Parent)	Manages the visibility of the offcanvas component. It passes the status (isOpen) and the action (toggleCart) down to the relevant children.

App.jsx holds const [isCartOpen, setIsCartOpen] = useState(false); and passes the toggleCart function down to the Menu component.

Menu.jsx passes toggleCart to the CartWidget.jsx component.

When the user clicks the CartWidget, it calls toggleCart(), which updates the state in App.jsx.

App.jsx then renders the CartOffcanvas component with the new isOpen=true prop, causing the side panel to slide into view.

CartOffcanvas renders CartContent, which uses the useCart hook to display the latest cart data.
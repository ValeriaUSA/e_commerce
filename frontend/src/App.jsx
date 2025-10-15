import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // This line is crucial for dropdowns Menu!
import './App.css';
import AppRoutes from './router/AppRouters';
import Menu from './components/Menu/Menu.jsx';
import GlobalProvider from './contexts/GlobalContext.jsx';
import { CartProvider } from './contexts/CartContext.jsx';
import { useState } from 'react';
import CartOffcanvas from './components/CartOffcanvas.jsx';

function App() {

const [isCartOpen, setIsCartOpen] = useState(false);
const toggleCart = () => setIsCartOpen(prev => !prev);

 return (
        <GlobalProvider>
            <CartProvider>
                <Menu toggleCart={toggleCart} /> 
                <CartOffcanvas isOpen={isCartOpen} toggleOffcanvas={toggleCart} /> 
                <AppRoutes /> 
            </CartProvider>
        </GlobalProvider>
    );
}

export default App;

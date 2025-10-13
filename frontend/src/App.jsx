
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // This line is crucial for dropdowns Menu!
import './App.css';
import AppRoutes from './router/AppRouters';
import Menu from './components/Menu/Menu.jsx';
import GlobalProvider from './contexts/GlobalContext.jsx';
import { CartProvider } from './contexts/CartContext.jsx';

function App() {
  return (
    <CartProvider>
    <GlobalProvider>
      <Menu />       {/* Navbar/menu */}
      <AppRoutes />  {/* Routes */}
    </GlobalProvider>
    </CartProvider>
  );
}

export default App;

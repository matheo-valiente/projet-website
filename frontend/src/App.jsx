import './App.css'
import ProductList from './components/ProductList'
import ProductDetail from './components/ProductDetail'
import Cart from './components/Cart'
import Register from './components/Register'
import { CartProvider } from './context/CartContext';
import { useCart } from './context/CartContext';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';

function Nav() {
  const { cart } = useCart()
  const location = useLocation()

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">TechEasy</Link>
        <div className="navbar-links">
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
            Produits
          </Link>
          <Link to="/cart" className={location.pathname === '/cart' ? 'active' : ''}>
            Panier
            {cart.length > 0 && <span className="cart-badge">{cart.length}</span>}
          </Link>
          <Link to="/register" className={location.pathname === '/register' ? 'active' : ''}>
            Inscription
          </Link>
        </div>
      </div>
    </nav>
  )
}

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Nav />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<ProductList />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </div>
        <footer className="footer">TechEasy &copy; 2025</footer>
      </BrowserRouter>
    </CartProvider>
  )
}

export default App;

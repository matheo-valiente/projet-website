import './App.css'
import ProductList from './components/ProductList'
import ProductDetail from './components/ProductDetail'
import Cart from './components/Cart'
import Checkout from './components/Checkout'
import Confirmation from './components/Confirmation'
import Orders from './components/Orders'
import Register from './components/Register'
import Login from './components/Login'
import { CartProvider } from './context/CartContext';
import { useCart } from './context/CartContext';
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate, useLocation, useNavigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const stored = localStorage.getItem('user')
  if (!stored) return <Navigate to="/login" replace />
  return children
}

function Nav() {
  const { cart } = useCart()
  const location = useLocation()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) setUser(JSON.parse(stored))
  }, [location])

  const handleLogout = () => {
    localStorage.removeItem('user')
    setUser(null)
    navigate('/')
  }

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
            {cart.items?.length > 0 && <span className="cart-badge">{cart.items.length}</span>}
          </Link>
          {user && (
            <Link to="/orders" className={location.pathname === '/orders' ? 'active' : ''}>
              Mes commandes
            </Link>
          )}
          {user ? (
            <>
              <span className="navbar-user">Bonjour {user.firstName}</span>
              <button onClick={handleLogout} className="btn-logout">Déconnexion</button>
            </>
          ) : (
            <>
              <Link to="/login" className={location.pathname === '/login' ? 'active' : ''}>
                Connexion
              </Link>
              <Link to="/register" className={location.pathname === '/register' ? 'active' : ''}>
                Inscription
              </Link>
            </>
          )}
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
            <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
            <Route path="/confirmation/:orderId" element={<ProtectedRoute><Confirmation /></ProtectedRoute>} />
            <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
          </Routes>
        </div>
        <footer className="footer">TechEasy &copy; 2025</footer>
      </BrowserRouter>
    </CartProvider>
  )
}

export default App;

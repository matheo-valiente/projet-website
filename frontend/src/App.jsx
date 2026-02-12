import './App.css'
import ProductList from './components/ProductList'
import Cart from './components/Cart'
import { CartProvider } from './context/CartContext';
import { useCart } from './context/CartContext';
import {BrowserRouter, Routes, Route, Link} from 'react-router-dom';

function Nav() {
  const { cart } = useCart()
  return (
    <nav>
      <Link to="/">Produits</Link>
      <Link to="/cart">Panier ({cart.length})</Link>
    </nav>
  )
}

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <div className="app-header">
          <h1>Mon site e-commerce</h1>
          <Nav />
        </div>

        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  )
}

export default App;

import { useCart } from '../context/CartContext'
import { useNavigate, Link } from 'react-router-dom'

function Cart() {
    const { cart, updateQuantity, removeItem } = useCart()
    const navigate = useNavigate()
    const items = cart.items || []

    const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

    return (
        <div className="cart-section">
            <h2 className="page-title">Mon Panier</h2>
            {items.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.3 }}>
                            <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                        </svg>
                    </div>
                    <p className="empty-state-title">Votre panier est vide</p>
                    <p>Parcourez nos produits pour commencer vos achats</p>
                    <Link to="/" className="btn-secondary">Voir les produits</Link>
                </div>
            ) : (
                <>
                    <div className="cart-items">
                        {items.map(item => (
                            <div className="cart-item" key={item.id}>
                                <div className="cart-item-image">
                                    {item.product.imageUrl ? (
                                        <img src={item.product.imageUrl} alt={item.product.name} />
                                    ) : (
                                        <span className="cart-image-fallback">{item.product.name?.charAt(0)}</span>
                                    )}
                                </div>
                                <div className="cart-item-info">
                                    <h3>{item.product.name}</h3>
                                    <span className="price">{item.product.price.toFixed(2)} &euro;</span>
                                </div>
                                <div className="cart-item-actions">
                                    <div className="quantity-controls">
                                        <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)}>-</button>
                                        <span className="quantity">{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>+</button>
                                    </div>
                                    <button className="btn-remove" onClick={() => removeItem(item.product.id)}>
                                        Supprimer
                                    </button>
                                </div>
                                <span className="cart-item-subtotal">
                                    {(item.product.price * item.quantity).toFixed(2)} &euro;
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="cart-total">
                        <span className="cart-total-label">Total ({items.length} article{items.length > 1 ? 's' : ''})</span>
                        <span className="cart-total-amount">{total.toFixed(2)} &euro;</span>
                    </div>
                    <button className="btn-checkout" onClick={() => navigate('/checkout')}>
                        Passer la commande
                    </button>
                </>
            )}
        </div>
    )
}

export default Cart

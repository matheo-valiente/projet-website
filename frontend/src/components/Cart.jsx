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
                    <p>Votre panier est vide</p>
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
                            </div>
                        ))}
                    </div>
                    <div className="cart-total">
                        <span className="cart-total-label">Total</span>
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

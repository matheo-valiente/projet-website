import { useCart } from '../context/CartContext'

function Cart() {
    const { cart } = useCart()
    const items = cart.items || []

    const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

    return (
        <div className="cart-section">
            <h2 className="page-title">Mon Panier</h2>
            {items.length === 0 ? (
                <p className="empty-state">Votre panier est vide</p>
            ) : (
                <>
                    <div className="cart-items">
                        {items.map(item => (
                            <div className="cart-item" key={item.id}>
                                <h3>{item.product.name}</h3>
                                <span className="price">{item.product.price.toFixed(2)} &euro;</span>
                                <span className="quantity">x{item.quantity}</span>
                            </div>
                        ))}
                    </div>
                    <div className="cart-total">
                        <span className="cart-total-label">Total</span>
                        <span className="cart-total-amount">{total.toFixed(2)} &euro;</span>
                    </div>
                </>
            )}
        </div>
    )
}

export default Cart

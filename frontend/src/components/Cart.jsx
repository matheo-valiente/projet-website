import { useCart } from '../context/CartContext'

function Cart() {
    const { cart } = useCart()

    const total = cart.reduce((sum, item) => sum + item.price, 0)

    return (
        <div className="cart-section">
            <h2 className="page-title">Mon Panier</h2>
            {cart.length === 0 ? (
                <p className="empty-state">Votre panier est vide</p>
            ) : (
                <>
                    <div className="cart-items">
                        {cart.map((item, index) => (
                            <div className="cart-item" key={index}>
                                <h3>{item.name}</h3>
                                <span className="price">{item.price.toFixed(2)} &euro;</span>
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

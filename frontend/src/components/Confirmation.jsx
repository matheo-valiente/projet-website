import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

const API = 'http://localhost:8080'

function Confirmation() {
    const { orderId } = useParams()
    const { clearCart } = useCart()
    const [order, setOrder] = useState(null)

    useEffect(() => {
        clearCart()
        fetch(`${API}/api/orders/${orderId}`)
            .then(res => res.json())
            .then(data => setOrder(data))
    }, [])

    return (
        <div className="confirmation-section">
            <div className="success-checkmark">
                <span className="checkmark-line"></span>
            </div>
            <h2 className="page-title" style={{ padding: '0 0 0.5rem', textAlign: 'center' }}>
                Commande confirmee !
            </h2>
            <p className="confirmation-message">
                Merci pour votre achat. Votre commande n&deg;<strong>{orderId}</strong> a bien ete enregistree.
            </p>
            {order && (
                <p className="confirmation-total">
                    Total : <strong>{Number(order.totalAmount).toFixed(2)} &euro;</strong>
                </p>
            )}
            <Link to="/" className="btn-home">Retour aux produits</Link>
        </div>
    )
}

export default Confirmation

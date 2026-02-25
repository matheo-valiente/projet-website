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
            <h2 className="page-title">Commande confirmée !</h2>
            <p className="confirmation-message">
                Merci pour votre achat. Votre commande n°<strong>{orderId}</strong> a bien été enregistrée.
            </p>
            {order && (
                <p className="confirmation-total">
                    Total : <strong>{Number(order.totalAmount).toFixed(2)} €</strong>
                </p>
            )}
            <Link to="/" className="btn-home">Retour aux produits</Link>
        </div>
    )
}

export default Confirmation

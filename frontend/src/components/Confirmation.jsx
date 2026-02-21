import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

function Confirmation() {
    const { orderId } = useParams()
    const { clearCart } = useCart()

    useEffect(() => {
        clearCart()
    }, [])

    return (
        <div className="confirmation-section">
            <h2 className="page-title">Commande confirmée !</h2>
            <p className="confirmation-message">
                Merci pour votre achat. Votre commande n°<strong>{orderId}</strong> a bien été enregistrée.
            </p>
            <Link to="/" className="btn-home">Retour aux produits</Link>
        </div>
    )
}

export default Confirmation

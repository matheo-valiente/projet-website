import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

const API = 'http://localhost:8080'

function PaymentSuccess() {
    const [searchParams] = useSearchParams()
    const { clearCart } = useCart()
    const [order, setOrder] = useState(null)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const userId = searchParams.get('userId')
        const addressId = searchParams.get('addressId')

        if (!userId || !addressId) {
            setError('Parametres manquants')
            setLoading(false)
            return
        }

        fetch(`${API}/api/orders?userId=${userId}&addressId=${addressId}`, {
            method: 'POST'
        })
            .then(res => {
                if (!res.ok) throw new Error('Erreur lors de la creation de la commande')
                return res.json()
            })
            .then(data => {
                setOrder(data)
                clearCart()
            })
            .catch(err => setError(err.message))
            .finally(() => setLoading(false))
    }, [])

    if (loading) {
        return (
            <div className="loading-section">
                <div className="spinner"></div>
                <p className="loading-text">Finalisation de votre commande...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="confirmation-section">
                <div className="error-icon">!</div>
                <h2 className="page-title" style={{ padding: '0 0 0.5rem', textAlign: 'center' }}>
                    Erreur
                </h2>
                <p className="confirmation-message">{error}</p>
                <Link to="/" className="btn-home">Retour aux produits</Link>
            </div>
        )
    }

    return (
        <div className="confirmation-section">
            <div className="success-checkmark">
                <span className="checkmark-line"></span>
            </div>
            <h2 className="page-title" style={{ padding: '0 0 0.5rem', textAlign: 'center' }}>
                Paiement reussi !
            </h2>
            <p className="confirmation-message">
                Merci pour votre achat. Votre commande n&deg;<strong>{order?.id}</strong> a bien ete enregistree.
            </p>
            {order && (
                <p className="confirmation-total">
                    Total : <strong>{Number(order.totalAmount).toFixed(2)} &euro;</strong>
                </p>
            )}
            <div className="payment-badge">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                    <line x1="1" y1="10" x2="23" y2="10"></line>
                </svg>
                Paye par Stripe
            </div>
            <Link to="/" className="btn-home">Retour aux produits</Link>
        </div>
    )
}

export default PaymentSuccess

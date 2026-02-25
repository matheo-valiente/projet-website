import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

const API = 'http://localhost:8080'

function Checkout() {
    const { cart } = useCart()
    const navigate = useNavigate()
    const items = cart.items || []
    const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

    const [address, setAddress] = useState({ street: '', city: '', postalCode: '', country: '' })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    if (items.length === 0) {
        navigate('/cart')
        return null
    }

    const handleChange = (e) => {
        setAddress({ ...address, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        const stored = localStorage.getItem('user')
        if (!stored) { setError('Vous devez être connecté.'); return }
        const user = JSON.parse(stored)

        try {
            const addrRes = await fetch(`${API}/api/addresses/user/${user.id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(address)
            })
            if (!addrRes.ok) throw new Error("Erreur lors de la sauvegarde de l'adresse")
            const addrData = await addrRes.json()

            const orderRes = await fetch(`${API}/api/orders?userId=${user.id}&addressId=${addrData.id}`, {
                method: 'POST'
            })
            if (!orderRes.ok) throw new Error('Erreur lors de la création de la commande')
            const orderData = await orderRes.json()

            navigate(`/confirmation/${orderData.id}`)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="checkout-section">
            <h2 className="page-title">Validation de la commande</h2>

            <div className="checkout-recap">
                <h3>Récapitulatif</h3>
                {items.map(item => (
                    <div className="recap-item" key={item.id}>
                        <span>{item.product.name} x{item.quantity}</span>
                        <span>{(item.product.price * item.quantity).toFixed(2)} €</span>
                    </div>
                ))}
                <div className="recap-total">
                    <strong>Total : {total.toFixed(2)} €</strong>
                </div>
            </div>

            <form className="address-form" onSubmit={handleSubmit}>
                <h3>Adresse de livraison</h3>
                <input
                    name="street"
                    placeholder="Rue"
                    value={address.street}
                    onChange={handleChange}
                    required
                />
                <input
                    name="city"
                    placeholder="Ville"
                    value={address.city}
                    onChange={handleChange}
                    required
                />
                <input
                    name="postalCode"
                    placeholder="Code postal"
                    value={address.postalCode}
                    onChange={handleChange}
                    required
                />
                <input
                    name="country"
                    placeholder="Pays"
                    value={address.country}
                    onChange={handleChange}
                    required
                />
                {error && <p className="error-message">{error}</p>}
                <button type="submit" className="btn-submit" disabled={loading}>
                    {loading ? 'Traitement...' : 'Confirmer la commande'}
                </button>
            </form>
        </div>
    )
}

export default Checkout

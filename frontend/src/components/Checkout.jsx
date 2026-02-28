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
        if (!stored) { setError('Vous devez etre connecte.'); setLoading(false); return }
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
            if (!orderRes.ok) throw new Error('Erreur lors de la creation de la commande')
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

            <div className="checkout-steps">
                <div className="step done">
                    <span className="step-number">1</span>
                    <span>Panier</span>
                </div>
                <div className="step-line"></div>
                <div className="step active">
                    <span className="step-number">2</span>
                    <span>Livraison</span>
                </div>
                <div className="step-line"></div>
                <div className="step">
                    <span className="step-number">3</span>
                    <span>Confirmation</span>
                </div>
            </div>

            <div className="checkout-recap">
                <h3>Recapitulatif</h3>
                {items.map(item => (
                    <div className="recap-item" key={item.id}>
                        <span>{item.product.name} x{item.quantity}</span>
                        <span>{(item.product.price * item.quantity).toFixed(2)} &euro;</span>
                    </div>
                ))}
                <div className="recap-total">
                    <strong>Total : {total.toFixed(2)} &euro;</strong>
                </div>
            </div>

            <form className="address-form" onSubmit={handleSubmit}>
                <h3>Adresse de livraison</h3>
                <div className="form-group">
                    <label htmlFor="street">Rue</label>
                    <input
                        id="street"
                        name="street"
                        placeholder="123 rue de la Paix"
                        value={address.street}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="address-row">
                    <div className="form-group">
                        <label htmlFor="city">Ville</label>
                        <input
                            id="city"
                            name="city"
                            placeholder="Paris"
                            value={address.city}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="postalCode">Code postal</label>
                        <input
                            id="postalCode"
                            name="postalCode"
                            placeholder="75001"
                            value={address.postalCode}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="country">Pays</label>
                    <input
                        id="country"
                        name="country"
                        placeholder="France"
                        value={address.country}
                        onChange={handleChange}
                        required
                    />
                </div>
                {error && <p className="error-message">{error}</p>}
                <button type="submit" className="btn-submit" disabled={loading}>
                    {loading ? 'Traitement...' : 'Confirmer la commande'}
                </button>
            </form>
        </div>
    )
}

export default Checkout

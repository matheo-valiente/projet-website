import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const API = 'http://localhost:8080'

const statusConfig = {
    PENDING:   { label: 'En attente',  color: '#f59e0b' },
    CONFIRMED: { label: 'Confirmee',   color: '#3b82f6' },
    SHIPPED:   { label: 'Expediee',    color: '#8b5cf6' },
    DELIVERED: { label: 'Livree',      color: '#22c55e' }
}

function Orders() {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const stored = localStorage.getItem('user')
        if (!stored) return
        const user = JSON.parse(stored)

        fetch(`${API}/api/orders/user/${user.id}`)
            .then(res => res.json())
            .then(data => setOrders(data))
            .finally(() => setLoading(false))
    }, [])

    if (loading) return <div className="empty-state">Chargement...</div>

    return (
        <div className="orders-section">
            <h2 className="page-title">Mes commandes</h2>

            {orders.length === 0 ? (
                <div className="empty-state">
                    <p>Aucune commande pour le moment.</p>
                    <Link to="/" className="btn-secondary">Voir les produits</Link>
                </div>
            ) : (
                <div className="orders-list">
                    {orders.map(order => {
                        const status = statusConfig[order.status] || statusConfig.PENDING
                        return (
                            <div className="order-card" key={order.id}>
                                <div className="order-header">
                                    <div>
                                        <span className="order-number">Commande #{order.id}</span>
                                        <span className="order-date">
                                            {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                                                day: 'numeric', month: 'long', year: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                    <span className="order-badge" style={{ background: status.color }}>
                                        {status.label}
                                    </span>
                                </div>

                                <div className="order-items">
                                    {order.items?.map(item => (
                                        <div className="order-item" key={item.id}>
                                            <span>{item.product?.name || 'Produit'} x{item.quantity}</span>
                                            <span>{(item.priceAtPurchase * item.quantity).toFixed(2)} &euro;</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="order-footer">
                                    <span className="order-total">
                                        Total : {Number(order.totalAmount).toFixed(2)} &euro;
                                    </span>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

export default Orders

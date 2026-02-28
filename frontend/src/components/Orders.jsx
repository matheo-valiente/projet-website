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

    if (loading) {
        return (
            <div className="orders-section">
                <h2 className="page-title">Mes commandes</h2>
                <div className="loading-section">
                    <div className="spinner" />
                    <span className="loading-text">Chargement...</span>
                </div>
            </div>
        )
    }

    return (
        <div className="orders-section">
            <h2 className="page-title">Mes commandes</h2>

            {orders.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.3 }}>
                            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                            <line x1="12" y1="22.08" x2="12" y2="12" />
                        </svg>
                    </div>
                    <p className="empty-state-title">Aucune commande</p>
                    <p>Vous n'avez pas encore passe de commande</p>
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

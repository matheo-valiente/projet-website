import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

function ProductDetail() {
    const { id } = useParams()
    const { addToCart } = useCart()
    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    const [toast, setToast] = useState(false)

    useEffect(() => {
        setLoading(true)
        fetch(`http://localhost:8080/api/products/${id}`)
            .then(res => res.json())
            .then(data => setProduct(data))
            .finally(() => setLoading(false))
    }, [id])

    const handleAddToCart = () => {
        addToCart(product)
        setToast(true)
        setTimeout(() => setToast(false), 2500)
    }

    if (loading) {
        return (
            <div className="detail-section">
                <div className="loading-section">
                    <div className="spinner" />
                    <span className="loading-text">Chargement...</span>
                </div>
            </div>
        )
    }

    if (!product) return <div className="empty-state">Produit introuvable</div>

    return (
        <div className="detail-section">
            <Link to="/" className="detail-back">&larr; Retour aux produits</Link>
            <div className="detail-layout">
                <div className="detail-image-placeholder">
                    {product.imageUrl ? (
                        <img src={product.imageUrl} alt={product.name} className="detail-image" />
                    ) : (
                        <span className="detail-image-fallback">{product.name?.charAt(0)}</span>
                    )}
                </div>
                <div className="detail-card">
                    <div className="detail-header">
                        {product.category && (
                            <span className="category-badge">{product.category.name}</span>
                        )}
                        <h2 className="detail-name">{product.name}</h2>
                        <span className="detail-price">{product.price.toFixed(2)} &euro;</span>
                    </div>
                    <p className="detail-description">{product.description}</p>
                    <div className="detail-footer">
                        <span className="detail-stock">
                            <span className={`stock-dot${product.stock < 10 ? ' low' : ''}`}></span>
                            {product.stock > 0 ? `${product.stock} en stock` : 'Rupture de stock'}
                        </span>
                        <button
                            className="btn-add"
                            onClick={handleAddToCart}
                            disabled={product.stock === 0}
                        >
                            Ajouter au panier
                        </button>
                    </div>
                </div>
            </div>

            <div className={`toast ${toast ? 'show' : ''}`}>
                <span className="toast-check">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                </span>
                <span><strong>{product.name}</strong> ajoute au panier</span>
            </div>
        </div>
    )
}

export default ProductDetail

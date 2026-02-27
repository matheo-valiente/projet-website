import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

function ProductDetail() {
    const { id } = useParams()
    const { addToCart } = useCart()
    const [product, setProduct] = useState(null)
    const [toast, setToast] = useState(false)

    useEffect(() => {
        fetch(`http://localhost:8080/api/products/${id}`)
            .then(res => res.json())
            .then(data => setProduct(data))
    }, [id])

    const handleAddToCart = () => {
        addToCart(product)
        setToast(true)
        setTimeout(() => setToast(false), 2500)
    }

    if (!product) return <p className="empty-state">Chargement...</p>

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
                <strong>{product.name}</strong> — ajoute au panier
            </div>
        </div>
    )
}

export default ProductDetail

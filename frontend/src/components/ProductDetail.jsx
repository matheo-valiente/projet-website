import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

function ProductDetail() {
    const { id } = useParams()
    const { addToCart } = useCart()
    const [product, setProduct] = useState(null)

    useEffect(() => {
        fetch(`http://localhost:8080/api/products/${id}`)
            .then(res => res.json())
            .then(data => setProduct(data))
    }, [id])

    if (!product) return <p className="empty-state">Chargement...</p>

    return (
        <div className="detail-section">
            <Link to="/" className="detail-back">&larr; Retour aux produits</Link>
            <div className="detail-card">
                <div className="detail-header">
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
                        onClick={() => addToCart(product)}
                        disabled={product.stock === 0}
                    >
                        Ajouter au panier
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ProductDetail

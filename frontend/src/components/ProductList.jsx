import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

function ProductList() {
    const { addToCart } = useCart()
    const [products, setProducts] = useState([])

    useEffect(() => {
        fetch('http://localhost:8080/api/products')
            .then(response => response.json())
            .then(data => setProducts(data))
    }, [])

    return (
        <div className="products-section">
            <h2 className="page-title">Nos Produits</h2>
            {products.length === 0 ? (
                <p className="empty-state">Aucun produit disponible</p>
            ) : (
                <div className="products-grid">
                    {products.map(product => (
                        <div className="product-card" key={product.id}>
                            <Link to={`/product/${product.id}`}>
                                <h3>{product.name}</h3>
                            </Link>
                            <span className="price">{product.price.toFixed(2)} &euro;</span>
                            <p className="description">{product.description}</p>
                            <span className="stock">
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
                    ))}
                </div>
            )}
        </div>
    )
}

export default ProductList

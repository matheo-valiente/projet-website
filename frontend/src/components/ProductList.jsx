import { useState, useEffect } from 'react'
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
            <h2>Nos Produits</h2>
            {products.length === 0 ? (
                <p className="empty-state">Aucun produit disponible</p>
            ) : (
                <div className="products-grid">
                    {products.map(product => (
                        <div className="product-card" key={product.id}>
                            <h3>{product.name}</h3>
                            <span className="price">{product.price} EUR</span>
                            <p className="description">{product.description}</p>
                            <span className="stock">Stock : {product.stock}</span>
                            <button className="btn-add" onClick={() => addToCart(product)}>Ajouter au panier</button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default ProductList

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

const API = 'http://localhost:8080'

function SkeletonCards() {
    return (
        <div className="skeleton-grid">
            {[...Array(6)].map((_, i) => (
                <div className="skeleton-card" key={i}>
                    <div className="skeleton-image" />
                    <div className="skeleton-body">
                        <div className="skeleton-line short" />
                        <div className="skeleton-line medium" />
                        <div className="skeleton-line" />
                        <div className="skeleton-line price" />
                        <div className="skeleton-btn" />
                    </div>
                </div>
            ))}
        </div>
    )
}

function ProductList() {
    const { addToCart } = useCart()
    const [products, setProducts] = useState([])
    const [allProducts, setAllProducts] = useState([])
    const [categories, setCategories] = useState([])
    const [activeCategory, setActiveCategory] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [sortOrder, setSortOrder] = useState('none')
    const [toast, setToast] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        Promise.all([
            fetch(`${API}/api/products`).then(res => res.json()),
            fetch(`${API}/api/categories`).then(res => res.json()).catch(() => [])
        ]).then(([productsData, categoriesData]) => {
            setProducts(productsData)
            setAllProducts(productsData)
            setCategories(categoriesData)
        }).finally(() => setLoading(false))
    }, [])

    const handleSearch = (value) => {
        setSearchTerm(value)
        setActiveCategory(null)
        if (value.trim() === '') {
            setProducts(allProducts)
        } else {
            fetch(`${API}/api/products/search?name=${encodeURIComponent(value)}`)
                .then(res => res.json())
                .then(data => setProducts(data))
                .catch(() => setProducts([]))
        }
    }

    const handleCategoryFilter = (categoryId) => {
        setSearchTerm('')
        if (categoryId === null) {
            setActiveCategory(null)
            setProducts(allProducts)
        } else {
            setActiveCategory(categoryId)
            fetch(`${API}/api/products/category/${categoryId}`)
                .then(res => res.json())
                .then(data => setProducts(data))
                .catch(() => setProducts([]))
        }
    }

    const handleAddToCart = (product) => {
        addToCart(product)
        setToast(product.name)
        setTimeout(() => setToast(''), 2500)
    }

    const sortedProducts = [...products].sort((a, b) => {
        if (sortOrder === 'asc') return a.price - b.price
        if (sortOrder === 'desc') return b.price - a.price
        return 0
    })

    return (
        <div className="products-section">
            <div className="hero-section">
                <h1 className="hero-title">Bienvenue sur TechEasy</h1>
                <p className="hero-subtitle">Trouvez les meilleurs produits tech au meilleur prix</p>
            </div>

            <div className="search-bar">
                <span className="search-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.3-4.3" />
                    </svg>
                </span>
                <input
                    type="text"
                    placeholder="Rechercher un produit..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="search-input"
                />
            </div>

            <div className="filters-row">
                <div className="category-pills">
                    <button
                        className={`pill ${activeCategory === null && searchTerm === '' ? 'active' : ''}`}
                        onClick={() => handleCategoryFilter(null)}
                    >
                        Tous
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            className={`pill ${activeCategory === cat.id ? 'active' : ''}`}
                            onClick={() => handleCategoryFilter(cat.id)}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
                <div className="sort-controls">
                    <label className="sort-label">Trier :</label>
                    <select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        className="sort-select"
                    >
                        <option value="none">Par defaut</option>
                        <option value="asc">Prix croissant</option>
                        <option value="desc">Prix decroissant</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <SkeletonCards />
            ) : sortedProducts.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.3 }}>
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.3-4.3" />
                        </svg>
                    </div>
                    <p className="empty-state-title">Aucun resultat</p>
                    <p>Essayez avec d'autres termes de recherche</p>
                    <button className="btn-secondary" onClick={() => { handleSearch(''); setSortOrder('none') }}>
                        Voir tous les produits
                    </button>
                </div>
            ) : (
                <div className="products-grid">
                    {sortedProducts.map(product => (
                        <div className="product-card" key={product.id}>
                            <Link to={`/product/${product.id}`} className="product-image-link">
                                <div className="product-image-placeholder">
                                    {product.imageUrl ? (
                                        <img src={product.imageUrl} alt={product.name} className="product-image" />
                                    ) : (
                                        <span className="product-image-fallback">{product.name?.charAt(0)}</span>
                                    )}
                                </div>
                            </Link>
                            <div className="product-card-body">
                                {product.category && (
                                    <span className="category-badge">{product.category.name}</span>
                                )}
                                <Link to={`/product/${product.id}`}>
                                    <h3>{product.name}</h3>
                                </Link>
                                <p className="description">{product.description}</p>
                                <div className="product-card-footer">
                                    <span className="price">{product.price.toFixed(2)} &euro;</span>
                                    <span className="stock">
                                        <span className={`stock-dot${product.stock < 10 ? ' low' : ''}`}></span>
                                        {product.stock > 0 ? `${product.stock} en stock` : 'Rupture'}
                                    </span>
                                </div>
                                <button
                                    className="btn-add"
                                    onClick={() => handleAddToCart(product)}
                                    disabled={product.stock === 0}
                                >
                                    Ajouter au panier
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className={`toast ${toast ? 'show' : ''}`}>
                <span className="toast-check">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                </span>
                <span><strong>{toast}</strong> ajoute au panier</span>
            </div>
        </div>
    )
}

export default ProductList

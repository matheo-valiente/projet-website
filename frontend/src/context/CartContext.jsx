import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()
const API = 'http://localhost:8080'

export function CartProvider({ children }) {
    const [cart, setCart] = useState({ items: [] })

    useEffect(() => {
        const stored = localStorage.getItem('user')
        if (!stored) return
        const user = JSON.parse(stored)
        fetch(`${API}/api/cart/${user.id}`)
            .then(res => res.json())
            .then(data => setCart(data))
    }, [])

    const addToCart = (product) => {
        const stored = localStorage.getItem('user')
        if (!stored) return
        const user = JSON.parse(stored)
        fetch(`${API}/api/cart/${user.id}/items?productId=${product.id}&quantity=1`, {
            method: 'POST'
        })
            .then(res => res.json())
            .then(data => setCart(data))
    }

    const updateQuantity = (productId, quantity) => {
        const stored = localStorage.getItem('user')
        if (!stored) return
        const user = JSON.parse(stored)
        fetch(`${API}/api/cart/${user.id}/items/${productId}?quantity=${quantity}`, {
            method: 'PUT'
        })
            .then(res => res.json())
            .then(data => setCart(data))
    }

    const removeItem = (productId) => {
        const stored = localStorage.getItem('user')
        if (!stored) return
        const user = JSON.parse(stored)
        fetch(`${API}/api/cart/${user.id}/items/${productId}`, {
            method: 'DELETE'
        })
            .then(res => res.json())
            .then(data => setCart(data))
    }

    const clearCart = () => {
        setCart({ items: [] })
    }

    return (
        <CartContext.Provider value={{ cart, addToCart, updateQuantity, removeItem, clearCart }}>
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    return useContext(CartContext)
}

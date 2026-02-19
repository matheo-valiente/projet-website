package com.example.demo.controller;

import com.example.demo.model.Cart;
import com.example.demo.service.CartService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.math.BigDecimal;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<Cart> getCart(@PathVariable Long userId) {
        Cart cart = cartService.getOrCreateCart(userId);
        return ResponseEntity.ok(cart);
    }

    @PostMapping("/{userId}/items")
    public ResponseEntity<Cart> addToCart(
            @PathVariable Long userId,
            @RequestParam Long productId,
            @RequestParam Integer quantity) {
        Cart cart = cartService.addToCart(userId, productId, quantity);
        return ResponseEntity.ok(cart);
    }

    @PutMapping("/{userId}/items/{productId}")
    public ResponseEntity<Cart> updateCartItem(
            @PathVariable Long userId,
            @PathVariable Long productId,
            @RequestParam Integer quantity) {
        Cart cart = cartService.updateCartItemQuantity(userId, productId, quantity);
        return ResponseEntity.ok(cart);
    }

    @DeleteMapping("/{userId}/items/{productId}")
    public ResponseEntity<Cart> removeFromCart(
            @PathVariable Long userId,
            @PathVariable Long productId) {
        Cart cart = cartService.removeFromCart(userId, productId);
        return ResponseEntity.ok(cart);
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> clearCart(@PathVariable Long userId) {
        cartService.clearCart(userId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{userId}/total")
    public ResponseEntity<BigDecimal> getCartTotal(@PathVariable Long userId) {
        BigDecimal total = cartService.getCartTotal(userId);
        return ResponseEntity.ok(total);
    }

    @GetMapping("/{userId}/count")
    public ResponseEntity<Integer> getCartItemCount(@PathVariable Long userId) {
        int count = cartService.getCartItemCount(userId);
        return ResponseEntity.ok(count);
    }
}

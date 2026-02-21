package com.example.demo.controller;

import com.example.demo.model.Address;
import com.example.demo.service.AddressService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/addresses")
public class AddressController {

    private final AddressService addressService;

    public AddressController(AddressService addressService) {
        this.addressService = addressService;
    }

    @PostMapping("/user/{userId}")
    public ResponseEntity<Address> createAddress(
            @PathVariable Long userId,
            @RequestBody Address address) {
        Address createdAddress = addressService.createAddress(userId, address);
        return new ResponseEntity<>(createdAddress, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Address> getAddressById(@PathVariable Long id) {
        return addressService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Address>> getAddressesByUserId(@PathVariable Long userId) {
        List<Address> addresses = addressService.findByUserId(userId);
        return ResponseEntity.ok(addresses);
    }

    @GetMapping("/user/{userId}/default")
    public ResponseEntity<Address> getDefaultAddress(@PathVariable Long userId) {
        return addressService.findDefaultAddress(userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Address> updateAddress(
            @PathVariable Long id,
            @RequestBody Address address) {
        Address updatedAddress = addressService.updateAddress(id, address);
        return ResponseEntity.ok(updatedAddress);
    }

    @PatchMapping("/{id}/default")
    public ResponseEntity<Address> setAsDefault(@PathVariable Long id) {
        Address address = addressService.setAsDefault(id);
        return ResponseEntity.ok(address);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAddress(@PathVariable Long id) {
        addressService.deleteAddress(id);
        return ResponseEntity.noContent().build();
    }
}

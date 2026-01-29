package com.example.demo.service;

import com.example.demo.model.Address;
import com.example.demo.model.User;
import com.example.demo.repository.AddressRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class AddressService {

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    public AddressService(AddressRepository addressRepository, UserRepository userRepository) {
        this.addressRepository = addressRepository;
        this.userRepository = userRepository;
    }

    public Address createAddress(Long userId, Address address) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        address.setUser(user);

        // If this is the first address or marked as default, handle default logic
        if (address.isDefault()) {
            clearDefaultForUser(userId);
        } else {
            // If user has no addresses, make this one default
            List<Address> existingAddresses = addressRepository.findByUserId(userId);
            if (existingAddresses.isEmpty()) {
                address.setDefault(true);
            }
        }

        return addressRepository.save(address);
    }

    public Optional<Address> findById(Long id) {
        return addressRepository.findById(id);
    }

    public List<Address> findByUserId(Long userId) {
        return addressRepository.findByUserId(userId);
    }

    public Optional<Address> findDefaultAddress(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        return addressRepository.findByUserAndIsDefaultTrue(user);
    }

    public Address updateAddress(Long addressId, Address updatedAddress) {
        return addressRepository.findById(addressId)
                .map(address -> {
                    address.setStreet(updatedAddress.getStreet());
                    address.setCity(updatedAddress.getCity());
                    address.setPostalCode(updatedAddress.getPostalCode());
                    address.setCountry(updatedAddress.getCountry());
                    return addressRepository.save(address);
                })
                .orElseThrow(() -> new RuntimeException("Address not found with id: " + addressId));
    }

    public Address setAsDefault(Long addressId) {
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new RuntimeException("Address not found with id: " + addressId));

        // Clear current default
        clearDefaultForUser(address.getUser().getId());

        // Set new default
        address.setDefault(true);
        return addressRepository.save(address);
    }

    private void clearDefaultForUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        addressRepository.findByUserAndIsDefaultTrue(user)
                .ifPresent(defaultAddress -> {
                    defaultAddress.setDefault(false);
                    addressRepository.save(defaultAddress);
                });
    }

    public void deleteAddress(Long addressId) {
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new RuntimeException("Address not found with id: " + addressId));

        Long userId = address.getUser().getId();
        boolean wasDefault = address.isDefault();

        addressRepository.delete(address);

        // If deleted address was default, set another one as default
        if (wasDefault) {
            List<Address> remainingAddresses = addressRepository.findByUserId(userId);
            if (!remainingAddresses.isEmpty()) {
                Address newDefault = remainingAddresses.get(0);
                newDefault.setDefault(true);
                addressRepository.save(newDefault);
            }
        }
    }
}

package com.backend.hotel_management.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.backend.hotel_management.model.Guest;
import com.backend.hotel_management.model.GuestPrincipal;
import com.backend.hotel_management.repository.GuestRepository;

@Service
public class GuestDetailsService implements UserDetailsService {

   @Autowired
   private GuestRepository guestRepository;

   @Override
   public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
      Guest guest = guestRepository.findByEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException("Guest not found with email: " + email));
      return new GuestPrincipal(guest);
   }

}

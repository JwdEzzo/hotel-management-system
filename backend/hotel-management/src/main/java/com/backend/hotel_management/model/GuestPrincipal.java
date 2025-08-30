package com.backend.hotel_management.model;

import java.util.Collection;
import java.util.Collections;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

public class GuestPrincipal implements UserDetails {

   private Guest guest;

   public GuestPrincipal(Guest guest) {
      this.guest = guest;
   }

   @Override
   public Collection<? extends GrantedAuthority> getAuthorities() {
      // Assign a default "GUEST" role/authority
      return Collections.singletonList(new SimpleGrantedAuthority("ROLE_GUEST"));
   }

   @Override
   public String getPassword() {
      return guest.getPassword();
   }

   @Override
   public String getUsername() {
      return guest.getEmail();
   }

   public Guest getGuest() {
      return guest;
   }

   @Override
   public boolean isAccountNonExpired() {
      return true;
   }

   @Override
   public boolean isAccountNonLocked() {
      return true;
   }

   @Override
   public boolean isCredentialsNonExpired() {
      return true;
   }

   @Override
   public boolean isEnabled() {
      return true;
   }

}

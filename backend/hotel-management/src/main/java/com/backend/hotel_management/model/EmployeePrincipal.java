package com.backend.hotel_management.model;

import java.util.Collection;
import java.util.Collections;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

public class EmployeePrincipal implements UserDetails {

   private Employee employee;

   public EmployeePrincipal(Employee employee) {
      this.employee = employee;
   }

   @Override
   public Collection<? extends GrantedAuthority> getAuthorities() {
      return Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + employee.getRole().name()));
   }

   @Override
   public String getPassword() {
      return employee.getPassword();
   }

   @Override
   public String getUsername() {
      return employee.getEmail();
   }

   public Employee getEmployee() {
      return employee;
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
package com.backend.hotel_management.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.backend.hotel_management.model.Employee;
import com.backend.hotel_management.model.EmployeePrincipal;
import com.backend.hotel_management.repository.EmployeeRepository;

@Service
public class EmployeeDetailsService implements UserDetailsService {

   @Autowired
   private EmployeeRepository employeeRepository;

   @Override
   public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
      Employee employee = employeeRepository.findByEmail(email);
      if (employee == null) {
         throw new UsernameNotFoundException("Employee not found with email: " + email);
      }
      return new EmployeePrincipal(employee);
   }
}
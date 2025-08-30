package com.backend.hotel_management.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.backend.hotel_management.model.Employee;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {

   Employee findByEmail(String email);

   // // Find employee by name
   // Optional<Employee> findByFullName(String fullName);

   // // Find employee by email
   // Optional<Employee> findByEmail(String email);

   // // Find employees by role
   // List<Employee> findByRole(EmployeeRole role);

   // Check if email exists (for validation)
   boolean existsByEmail(String email);

}
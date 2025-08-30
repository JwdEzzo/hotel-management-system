package com.backend.hotel_management.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend.hotel_management.dto.request.EmployeeRequestDto;
import com.backend.hotel_management.dto.response.EmployeeResponseDto;
import com.backend.hotel_management.service.EmployeeService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/hotel/employees")
@CrossOrigin(origins = "*")
public class EmployeeController {

   @Autowired
   private EmployeeService employeeService;

   // Create new employee - Only MANAGER can create employees
   @PostMapping
   @PreAuthorize("hasRole('MANAGER')")
   public ResponseEntity<EmployeeResponseDto> createEmployee(@RequestBody @Valid EmployeeRequestDto requestDto) {
      try {
         EmployeeResponseDto responseDto = employeeService.register(requestDto);
         return new ResponseEntity<>(responseDto, HttpStatus.CREATED);
      } catch (RuntimeException e) {
         throw new RuntimeException("Error creating employee: " + e.getMessage());
      }
   }

   // Get all employees - Only MANAGER can view all employees
   @GetMapping
   @PreAuthorize("hasRole('MANAGER')")
   public ResponseEntity<List<EmployeeResponseDto>> getAllEmployees() {
      List<EmployeeResponseDto> employees = employeeService.getAllEmployees();
      return new ResponseEntity<>(employees, HttpStatus.OK);
   }

   // Get employee by ID - MANAGER or the employee themselves
   @GetMapping("/{id}")
   @PreAuthorize("hasRole('MANAGER') or @employeeService.isCurrentEmployee(#id)")
   public ResponseEntity<EmployeeResponseDto> getEmployeeById(@PathVariable Long id) {
      try {
         EmployeeResponseDto employee = employeeService.getEmployeeById(id);
         return new ResponseEntity<>(employee, HttpStatus.OK);
      } catch (RuntimeException e) {
         throw new RuntimeException("Employee not found with id: " + id);
      }
   }

   // Update employee by ID - MANAGER or the employee themselves
   @PutMapping("/{id}")
   @PreAuthorize("hasRole('MANAGER') or @employeeService.isCurrentEmployee(#id)")
   public ResponseEntity<EmployeeResponseDto> updateEmployee(@PathVariable Long id,
         @RequestBody @Valid EmployeeRequestDto requestDto) {
      try {
         EmployeeResponseDto updatedEmployee = employeeService.updateEmployee(id, requestDto);
         return new ResponseEntity<>(updatedEmployee, HttpStatus.OK);
      } catch (RuntimeException e) {
         throw new RuntimeException("Error updating employee: " + e.getMessage());
      }
   }

   // Delete employee by ID - Only MANAGER can delete employees
   @DeleteMapping("/{id}")
   @PreAuthorize("hasRole('MANAGER')")
   public ResponseEntity<Void> deleteEmployee(@PathVariable Long id) {
      try {
         employeeService.deleteEmployee(id);
         return new ResponseEntity<>(HttpStatus.NO_CONTENT);
      } catch (RuntimeException e) {
         throw new RuntimeException("Error deleting employee: " + e.getMessage());
      }
   }

}
package com.backend.hotel_management.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.backend.hotel_management.dto.request.EmployeeRequestDto;
import com.backend.hotel_management.dto.request.LoginRequestDto;
import com.backend.hotel_management.dto.response.EmployeeResponseDto;
import com.backend.hotel_management.dto.response.JwtResponseDto;
import com.backend.hotel_management.model.Employee;
import com.backend.hotel_management.model.EmployeePrincipal;
import com.backend.hotel_management.repository.EmployeeRepository;

@Service
public class EmployeeService {

   @Autowired
   private EmployeeRepository employeeRepository;

   @Autowired
   private JwtService jwtService;

   @Autowired
   private AuthenticationManager authManager;
   private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

   // Convert RequestDto to Entity
   public Employee convertRequestDtoToEntity(EmployeeRequestDto request) {
      Employee entity = new Employee();
      // Setting
      entity.setFullName(request.getFullName());
      entity.setEmail(request.getEmail());
      entity.setRole(request.getRole());
      entity.setPassword(request.getPassword());
      return entity;
   }

   // Convert Entity to ResponseDto
   public EmployeeResponseDto convertEntityToResponseDto(Employee entity) {
      EmployeeResponseDto response = new EmployeeResponseDto();

      // Setting
      response.setId(entity.getId());
      response.setFullName(entity.getFullName());
      response.setEmail(entity.getEmail());
      response.setRole(entity.getRole());
      return response;
   }

   // Convert List of Entities into List of ResponseDtos
   public List<EmployeeResponseDto> convertEntityListToResponseDtos(List<Employee> employees) {
      return employees.stream()
            .map(this::convertEntityToResponseDto)
            .collect(Collectors.toList());
   }

   // Create an Employee
   public EmployeeResponseDto createEmployee(EmployeeRequestDto request) {
      Employee newEmployeeEntity = convertRequestDtoToEntity(request);
      Employee savedEmployeeEntity = employeeRepository.save(newEmployeeEntity);
      return convertEntityToResponseDto(savedEmployeeEntity);
   }

   // Get All Employees
   public List<EmployeeResponseDto> getAllEmployees() {
      List<Employee> employees = employeeRepository.findAll();
      return convertEntityListToResponseDtos(employees);
   }

   // Get Employee By Id
   public EmployeeResponseDto getEmployeeById(Long id) {
      Employee employee = employeeRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Can't Find Employee of Id " + id));
      return convertEntityToResponseDto(employee);
   }

   // Update Employee By Id
   public EmployeeResponseDto updateEmployee(Long id, EmployeeRequestDto request) {
      Employee employee = employeeRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Can't Find Employee of Id " + id));
      employee.setFullName(request.getFullName());
      employee.setEmail(request.getEmail());
      employee.setRole(request.getRole());

      if (request.getPassword() != null && !request.getPassword().isEmpty()) {
         // Encode the new password before saving
         employee.setPassword(encoder.encode(request.getPassword()));
      }

      Employee updatedEmployee = employeeRepository.save(employee);
      return convertEntityToResponseDto(updatedEmployee);
   }

   // Delete Employee By Id
   public void deleteEmployee(Long id) {
      if (!employeeRepository.existsById(id)) {
         throw new RuntimeException("Can't Find Employee of Id " + id);
      }

      employeeRepository.deleteById(id);
   }

   public EmployeeResponseDto register(EmployeeRequestDto employeeRequest) {
      if (employeeRepository.existsByEmail(employeeRequest.getEmail())) {
         throw new RuntimeException("Email already exists");
      }

      Employee employee = new Employee();
      employee.setFullName(employeeRequest.getFullName());
      employee.setEmail(employeeRequest.getEmail());
      employee.setPassword(encoder.encode(employeeRequest.getPassword()));
      employee.setRole(employeeRequest.getRole());

      Employee savedEmployee = employeeRepository.save(employee);
      return convertEntityToResponseDto(savedEmployee);
   }

   public JwtResponseDto login(LoginRequestDto loginRequest) {
      Authentication authentication = authManager.authenticate(
            new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

      if (authentication.isAuthenticated()) {
         EmployeePrincipal employeePrincipal = (EmployeePrincipal) authentication.getPrincipal();
         Employee employee = employeePrincipal.getEmployee();
         String token = jwtService.generateToken(employee.getEmail(), employee.getRole());
         return new JwtResponseDto(token, employee.getEmail(), employee.getRole());
      } else {
         throw new RuntimeException("Invalid credentials");
      }
   }

   public boolean isCurrentEmployee(Long employeeId) {
      Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
      if (authentication != null && authentication.getPrincipal() instanceof EmployeePrincipal) {
         EmployeePrincipal principal = (EmployeePrincipal) authentication.getPrincipal();
         return principal.getEmployee().getId().equals(employeeId);
      }
      return false;
   }

   public EmployeeResponseDto getEmployeeByEmail(String email) {
      Employee employee = employeeRepository.findByEmail(email);
      return convertEntityToResponseDto(employee);
   }

}

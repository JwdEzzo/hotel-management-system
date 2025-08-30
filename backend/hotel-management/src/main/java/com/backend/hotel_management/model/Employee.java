package com.backend.hotel_management.model;

import com.backend.hotel_management.enums.EmployeeRole;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Employee {
   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   private Long id;

   @NotBlank
   @Column(nullable = false)
   private String fullName;

   @NotBlank
   @Email
   @Column(unique = true, nullable = false)
   private String email;

   @NotBlank
   @Column(nullable = false)
   private String password;

   @Enumerated(EnumType.STRING)
   @Column(nullable = false)
   private EmployeeRole role;
}

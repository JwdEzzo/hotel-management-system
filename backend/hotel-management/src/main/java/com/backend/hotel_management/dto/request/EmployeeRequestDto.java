package com.backend.hotel_management.dto.request;

import com.backend.hotel_management.enums.EmployeeRole;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeRequestDto {

   @NotBlank(message = "Full Name is required")
   private String fullName;

   @NotBlank(message = "Email is required")
   @Email(message = "Email should be valid")
   private String email;

   @NotBlank(message = "Password is required")
   private String password;

   @NotNull(message = "Role is required")
   private EmployeeRole role;
}
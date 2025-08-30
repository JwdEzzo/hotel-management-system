package com.backend.hotel_management.dto.response;

import com.backend.hotel_management.enums.EmployeeRole;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeResponseDto {
   private Long id;
   private String fullName;
   private String email;
   private EmployeeRole role;
}
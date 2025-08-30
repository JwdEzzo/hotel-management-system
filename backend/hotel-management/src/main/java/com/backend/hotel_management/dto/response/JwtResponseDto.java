package com.backend.hotel_management.dto.response;

import com.backend.hotel_management.enums.EmployeeRole;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class JwtResponseDto {
   private String token;
   private String type = "Bearer";
   private String email;
   private EmployeeRole role;

   public JwtResponseDto(String token, String email, EmployeeRole role) {
      this.token = token;
      this.email = email;
      this.role = role;
   }
}

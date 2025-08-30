package com.backend.hotel_management.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GuestRequestDto {

   @NotBlank(message = "Full name is required")
   private String fullName;

   @NotBlank(message = "Email is required")
   @Email(message = "Email should be valid")
   private String email;

   @NotBlank(message = "Password is required")
   private String password;

   @NotBlank(message = "Phone number is required")
   private String phoneNumber;

   @NotBlank(message = "Country is required")
   private String country;

   @NotBlank(message = "Address is required")
   private String address;

   @NotBlank(message = "City is required")
   private String city;
}
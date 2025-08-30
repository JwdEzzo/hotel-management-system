package com.backend.hotel_management.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ContactUsRequestDto {

   @NotBlank(message = "First name is required")
   @NotNull(message = "First name is required")
   private String firstName;

   @NotBlank(message = "Last name is required")
   @NotNull(message = "Last name is required")
   private String lastName;

   @NotBlank(message = "Email is required")
   @Email(message = "Email should be valid")
   @NotNull(message = "Email is required")

   private String email;

   @NotBlank(message = "Subject is required")
   @NotNull(message = "Subject is required")
   private String subject;

   @NotBlank(message = "Message is required")
   @NotNull(message = "Message is required")
   private String message;

}

package com.backend.hotel_management.dto.response;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ContactUsResponseDto {

   private Long id;
   private String firstName;
   private String lastName;
   private String email;
   private String subject;
   private LocalDateTime createdAt;
   private String message;

}

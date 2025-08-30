package com.backend.hotel_management.dto.response;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ComplaintResponseDto {
   private Long id;
   private String title;
   private String message;
   private LocalDateTime createdAt;
   private Long guestId; // Just reference the guest
}
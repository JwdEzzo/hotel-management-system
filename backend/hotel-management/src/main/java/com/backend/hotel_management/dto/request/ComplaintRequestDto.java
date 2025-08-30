package com.backend.hotel_management.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ComplaintRequestDto {

   @NotNull(message = "Guest ID is required")
   private Long guestId;

   @NotNull(message = "Title is required")
   @NotBlank(message = "Title is required")
   private String title;

   @NotNull(message = "Message is required")
   @NotBlank(message = "Message is required")
   private String message;
}
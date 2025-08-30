package com.backend.hotel_management.dto.request;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateBookingRequestDto {

   @NotBlank(message = "Full name is required")
   private String fullName;

   @NotBlank(message = "Email is required")
   @Email(message = "Email should be valid")
   private String email;

   @NotBlank(message = "Phone number is required")
   private String phoneNumber;

   @NotBlank(message = "Country is required")
   private String country;

   @NotBlank(message = "Address is required")
   private String address;

   @NotBlank(message = "City is required")
   private String city;

   @NotNull(message = "Check-in date is required")
   private LocalDateTime checkInDateTime;

   @NotNull(message = "Check-out date is required")
   private LocalDateTime checkOutDateTime;

   @NotNull(message = "Room ID is required")
   private Long roomId;

   private List<Long> hotelServiceIds;
   // Additional guests (just names)
   private List<String> additionalGuestNames;

   private Map<Long, Integer> serviceQuantities; // service ID -> quantity
}

package com.backend.hotel_management.dto.request;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingRequestDto {
   @NotNull(message = "Check-in date is required")
   private LocalDateTime checkInDateTime;

   @NotNull(message = "Check-out date is required")
   private LocalDateTime checkOutDateTime;

   @NotNull(message = "Price is required")
   private BigDecimal totalPrice;

   @NotNull(message = "Guest ID is required")
   private Long guestId;

   // Just names of additional guests
   private List<String> additionalGuestNames;

   @NotNull(message = "Room ID is required")
   private Long roomId;

   private List<Long> selectedServiceIds;

   private Map<Long, Integer> serviceQuantities;
}
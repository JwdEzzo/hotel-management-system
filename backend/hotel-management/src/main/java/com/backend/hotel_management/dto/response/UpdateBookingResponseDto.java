package com.backend.hotel_management.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateBookingResponseDto {

   // ID of the updated Booking (keep for internal use)
   private Long bookingId;

   // Booking Reference (this is what guests will see and use)
   private String bookingReference;

   // Guest Info
   private String fullName;
   private String email;
   private String phoneNumber;
   private String country;
   private String address;
   private String city;

   // Booking Info
   private LocalDateTime checkInDateTime;
   private LocalDateTime checkOutDateTime;
   private BigDecimal totalPrice;

   private List<String> additionalGuestNames;
   private List<HotelServingResponseDto> selectedServices;
   private Integer totalGuests;
   private Map<Long, Integer> serviceQuantities;
}
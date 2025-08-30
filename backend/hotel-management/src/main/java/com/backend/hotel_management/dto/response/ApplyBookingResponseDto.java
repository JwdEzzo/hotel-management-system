package com.backend.hotel_management.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ApplyBookingResponseDto {

   private Long bookingId;
   private String bookingReference;
   private String fullName;
   private String email;
   private String phoneNumber;
   private String country;
   private String address;
   private String city;
   private LocalDateTime checkInDateTime;
   private LocalDateTime checkOutDateTime;
   private BigDecimal totalPrice;
   private List<String> additionalGuestNames;
   private List<HotelServingResponseDto> selectedServices;
   private Integer totalGuests;
   private Map<Long, Integer> serviceQuantities;

}

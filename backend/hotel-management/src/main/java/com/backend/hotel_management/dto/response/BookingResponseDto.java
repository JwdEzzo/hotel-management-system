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
public class BookingResponseDto {
   private Long id;
   private String bookingReference;
   private LocalDateTime checkInDateTime;
   private LocalDateTime checkOutDateTime;
   private BigDecimal totalPrice;
   private GuestResponseDto guest;
   private RoomResponseDto room;
   private List<String> additionalGuestNames; // Just names
   private List<HotelServingResponseDto> selectedServices;
   private Integer totalGuests;
   private Map<Long, Integer> serviceQuantities; // NEW FIELD
}
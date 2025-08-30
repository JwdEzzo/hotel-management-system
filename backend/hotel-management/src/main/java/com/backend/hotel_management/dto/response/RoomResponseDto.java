package com.backend.hotel_management.dto.response;

import java.math.BigDecimal;

import com.backend.hotel_management.enums.RoomStatus;
import com.backend.hotel_management.enums.RoomType;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RoomResponseDto {
   private Long id;
   private String roomNumber;
   private RoomType roomType;
   private RoomStatus roomStatus;
   private BigDecimal pricePerNight;
   private Integer maxOccupancy;

   // Note: Not including bookings list
}
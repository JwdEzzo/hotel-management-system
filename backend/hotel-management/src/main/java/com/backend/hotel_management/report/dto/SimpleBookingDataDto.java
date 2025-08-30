package com.backend.hotel_management.report.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SimpleBookingDataDto {
   private String bookingReference;
   private LocalDate checkInDate;
   private LocalDate checkOutDate;
   private String roomNumber;
   private BigDecimal totalCost;
}

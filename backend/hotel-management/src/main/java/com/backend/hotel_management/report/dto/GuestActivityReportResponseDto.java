package com.backend.hotel_management.report.dto;

import java.math.BigDecimal;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GuestActivityReportResponseDto {
   private String guestName;
   private String guestEmail;
   private int totalBookings;
   private BigDecimal totalSpent;
   private List<SimpleBookingDataDto> bookings;
}

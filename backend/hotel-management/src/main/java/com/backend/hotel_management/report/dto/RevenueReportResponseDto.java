package com.backend.hotel_management.report.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RevenueReportResponseDto {
   private LocalDate fromDate;
   private LocalDate toDate;
   private BigDecimal totalRevenue;
   private BigDecimal roomRevenue;
   private BigDecimal servicesRevenue;
   private int totalBookings;
}
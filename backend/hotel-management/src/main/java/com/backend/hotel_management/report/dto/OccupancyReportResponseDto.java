package com.backend.hotel_management.report.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OccupancyReportResponseDto {
   private LocalDate fromDate;
   private LocalDate toDate;
   private int totalRooms;
   private int occupiedRooms;
   private double occupancyRate; // Percentage
}
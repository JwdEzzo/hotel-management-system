package com.backend.hotel_management.report.controller;

import java.time.LocalDate;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.backend.hotel_management.report.dto.GuestActivityReportResponseDto;
import com.backend.hotel_management.report.dto.OccupancyReportResponseDto;
import com.backend.hotel_management.report.dto.RevenueReportResponseDto;
import com.backend.hotel_management.report.service.ReportService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("api/hotel/reports")
@RequiredArgsConstructor
@CrossOrigin("*")
public class ReportController {
   private final ReportService reportService;

   // GET /api/reports/occupancy?fromDate=2024-01-01&toDate=2024-01-31
   @GetMapping("/occupancy")
   public ResponseEntity<OccupancyReportResponseDto> getOccupancyReport(
         @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
         @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate) {

      if (fromDate.isAfter(toDate)) {
         return ResponseEntity.badRequest().build();
      }

      try {
         OccupancyReportResponseDto report = reportService.generateOccupancyReport(fromDate, toDate);
         return ResponseEntity.ok(report);
      } catch (Exception e) {
         return ResponseEntity.internalServerError().build();
      }
   }

   // GET /api/hotel/reports/revenue?fromDate=2024-01-01&toDate=2024-01-31

   @GetMapping("/revenue")
   public ResponseEntity<RevenueReportResponseDto> getRevenueReport(
         @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
         @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate) {

      if (fromDate.isAfter(toDate)) {
         return ResponseEntity.badRequest().build();
      }

      try {
         RevenueReportResponseDto report = reportService.generateRevenueReport(fromDate, toDate);
         return ResponseEntity.ok(report);
      } catch (Exception e) {
         return ResponseEntity.internalServerError().build();
      }
   }

   // GET /api/reports/guest-activity/1
   @GetMapping("/guest-activity/{guestId}")
   public ResponseEntity<GuestActivityReportResponseDto> getGuestActivityReport(
         @PathVariable Long guestId) {

      try {
         GuestActivityReportResponseDto report = reportService.generateGuestActivityReport(guestId);
         return ResponseEntity.ok(report);
      } catch (RuntimeException e) {
         return ResponseEntity.notFound().build();
      } catch (Exception e) {
         return ResponseEntity.internalServerError().build();
      }
   }

   /**
    * GET /api/hotel/reports/guest-activity?email=guest@example.com
    */
   @GetMapping("/guest-activity")
   public ResponseEntity<GuestActivityReportResponseDto> getGuestActivityReportByEmail(
         @RequestParam String email) {

      try {
         GuestActivityReportResponseDto report = reportService.generateGuestActivityReportByEmail(email);
         return ResponseEntity.ok(report);
      } catch (RuntimeException e) {
         return ResponseEntity.notFound().build();
      } catch (Exception e) {
         return ResponseEntity.internalServerError().build();
      }
   }
}

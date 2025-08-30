package com.backend.hotel_management.report.service;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.backend.hotel_management.model.Booking;
import com.backend.hotel_management.model.Guest;
import com.backend.hotel_management.report.dto.GuestActivityReportResponseDto;
import com.backend.hotel_management.report.dto.OccupancyReportResponseDto;
import com.backend.hotel_management.report.dto.RevenueReportResponseDto;
import com.backend.hotel_management.report.dto.SimpleBookingDataDto;
import com.backend.hotel_management.repository.BookingRepository;
import com.backend.hotel_management.repository.GuestRepository;
import com.backend.hotel_management.repository.RoomRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReportService {

      private final BookingRepository bookingRepository;
      private final RoomRepository roomRepository;
      private final GuestRepository guestRepository;

      //////// ===== HELPER METHODS ===== ////////
      private List<Booking> getBookingsInDateRange(LocalDate fromDate, LocalDate toDate) {
            LocalDateTime startDateTime = fromDate.atStartOfDay();
            LocalDateTime endDateTime = toDate.atTime(23, 59, 59);

            return bookingRepository.findAll().stream()
                        .filter(booking -> booking.getCheckInDateTime().isBefore(endDateTime)
                                    && booking.getCheckOutDateTime().isAfter(startDateTime))
                        .collect(Collectors.toList());
      }

      private BigDecimal calculateRoomCost(Booking booking) {
            long nights = Duration.between(booking.getCheckInDateTime(), booking.getCheckOutDateTime()).toDays();
            return booking.getRoom().getPricePerNight().multiply(BigDecimal.valueOf(nights));
      }

      //////// ===== OCCUPANCY REPORT ===== ////////
      public OccupancyReportResponseDto generateOccupancyReport(LocalDate fromDate, LocalDate toDate) {

            int totalRooms = (int) roomRepository.count();

            List<Booking> bookings = getBookingsInDateRange(fromDate, toDate);

            int occupiedRooms = (int) bookings.stream() // .stream() converts the collection to a stream
                        .map(booking -> booking.getRoom().getId()) //.map(): Transforms each booking into its room ID and gets it
                        .distinct() // .distinct(): Removes duplicate room IDs
                        .count(); // .count(): Counts the number of distinct room IDs

            double occupancyRate = totalRooms > 0 ? (double) occupiedRooms / totalRooms * 100 : 0.0;
            occupancyRate = Math.round(occupancyRate * 100.0) / 100.0; // Round to 2 decimal places

            return new OccupancyReportResponseDto(fromDate, toDate, totalRooms, occupiedRooms, occupancyRate);

      }

      //////// ===== REVENUE REPORT ===== ////////
      public RevenueReportResponseDto generateRevenueReport(LocalDate fromDate, LocalDate toDate) {
            // Get bookings in the date range
            List<Booking> bookings = getBookingsInDateRange(fromDate, toDate);

            // Calculate Room Revenue
            BigDecimal roomRevenue = bookings.stream()
                        .map(this::calculateRoomCost)
                        .reduce(BigDecimal.ZERO, BigDecimal::add);

            // Calculate Servuce Revenue
            BigDecimal servicesRevenue = bookings.stream()
                        .map(Booking::calculateServicesTotal)
                        .reduce(BigDecimal.ZERO, BigDecimal::add);

            BigDecimal totalRevenue = roomRevenue.add(servicesRevenue);

            return new RevenueReportResponseDto(fromDate, toDate, totalRevenue, roomRevenue,
                        servicesRevenue, bookings.size());
      }

      //////// ===== GUEST ACTIVITY REPORT ===== ////////
      public GuestActivityReportResponseDto generateGuestActivityReport(Long guestId) {

            // Get the guest
            Guest guest = guestRepository.findById(guestId)
                        .orElseThrow(() -> new RuntimeException("Guest not found with id : " + guestId));

            // Get his booking(s)
            List<Booking> guestBookings = guest.getBookings() != null ? guest.getBookings() : new ArrayList<>();

            // Calculate Total spent
            BigDecimal totalSpent = guestBookings.stream()
                        .map(Booking::getTotalPrice)
                        .reduce(BigDecimal.ZERO, BigDecimal::add);

            // Convert to simple booking data
            List<SimpleBookingDataDto> bookingData = guestBookings
                        .stream()
                        .map(booking -> new SimpleBookingDataDto(
                                    booking.getBookingReference(),
                                    booking.getCheckInDateTime().toLocalDate(),
                                    booking.getCheckOutDateTime().toLocalDate(),
                                    booking.getRoom().getRoomNumber(),
                                    booking.getTotalPrice()))
                        .collect(Collectors.toList());

            return new GuestActivityReportResponseDto(guest.getFullName(), guest.getEmail(), guestBookings.size(),
                        totalSpent, bookingData);
      }

      public GuestActivityReportResponseDto generateGuestActivityReportByEmail(String email) {
            Guest guest = guestRepository.findByEmail(email)
                        .orElseThrow(() -> new RuntimeException("Guest not found with email: " + email));

            return generateGuestActivityReport(guest.getId());
      }

}

package com.backend.hotel_management.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.backend.hotel_management.model.Booking;

public interface BookingRepository extends JpaRepository<Booking, Long> {

      /**
       * Find bookings where check-in has passed but check-out hasn't
       * This identifies currently active stays
       */
      @Query("SELECT b FROM Booking b WHERE b.checkInDateTime <= :now AND b.checkOutDateTime > :now")
      List<Booking> findByCheckInDateTimeBeforeAndCheckOutDateTimeAfter(@Param("now") LocalDateTime now);

      /**
       * Find bookings where check-out time has passed
       * This identifies completed stays
       */
      @Query("SELECT b FROM Booking b WHERE b.checkOutDateTime <= :now")
      List<Booking> findByCheckOutDateTimeBefore(@Param("now") LocalDateTime now);

      /**
       * Find bookings for a specific room that overlap with the given date range
       * This is used to check for booking conflicts before creating new bookings
       */
      @Query("SELECT b FROM Booking b WHERE b.room.id = :roomId AND " +
                  "((b.checkInDateTime < :checkOut AND b.checkOutDateTime > :checkIn))")
      List<Booking> findByRoom_IdAndDateRangeOverlap(
                  @Param("roomId") Long roomId,
                  @Param("checkIn") LocalDateTime checkIn,
                  @Param("checkOut") LocalDateTime checkOut);

      // For checking active bookings in a specific room
      @Query("SELECT b FROM Booking b WHERE b.room.id = :roomId " +
                  "AND b.checkInDateTime <= :currentTime AND b.checkOutDateTime > :currentTime")
      List<Booking> findByRoom_IdAndCheckInDateTimeBeforeAndCheckOutDateTimeAfter(
                  @Param("roomId") Long roomId,
                  @Param("currentTime") LocalDateTime currentTime);

      // Find booking by email (for multiple bookings)
      List<Booking> findByGuestEmail(String email);

      // Find single booking by booking reference - this is what we'll use now
      Optional<Booking> findByBookingReference(String bookingReference);

      // Find booking by reference and guest email (double verification for security)
      Optional<Booking> findByBookingReferenceAndGuestEmail(String bookingReference, String guestEmail);

      // Check if booking reference already exists
      boolean existsByBookingReference(String bookingReference);

      @Query("SELECT b FROM Booking b WHERE b.checkInDateTime <= :endDate AND b.checkOutDateTime >= :startDate")
      List<Booking> findBookingsInDateRange(@Param("startDate") LocalDateTime startDate,
                  @Param("endDate") LocalDateTime endDate);

      // Delete booking by booking reference
      void deleteByBookingReference(String bookingReference);
}
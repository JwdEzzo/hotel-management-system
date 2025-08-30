package com.backend.hotel_management.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.backend.hotel_management.model.Guest;

@Repository
public interface GuestRepository extends JpaRepository<Guest, Long> {

      //    // Find guest by name
      //    Optional<Guest> findByFullName(String fullName);

      // Find guest by email
      Optional<Guest> findByEmail(String email);

      //    // Find guest by phone number
      //    Optional<Guest> findByPhoneNumber(String phoneNumber);

      //    // Find guests by date range of bookings
      //    @Query("SELECT DISTINCT g FROM Guest g JOIN g.bookings b " +
      //          "WHERE b.checkInDateTime BETWEEN :startDate AND :endDate")
      //    List<Guest> findGuestsWithBookingsInDateRange(@Param("startDate") LocalDateTime startDate,
      //          @Param("endDate") LocalDateTime endDate);
}

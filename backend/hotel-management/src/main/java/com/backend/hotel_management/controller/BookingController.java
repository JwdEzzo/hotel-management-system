package com.backend.hotel_management.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend.hotel_management.dto.request.BookingRequestDto;
import com.backend.hotel_management.dto.response.BookingResponseDto;
import com.backend.hotel_management.model.Booking;
import com.backend.hotel_management.service.BookingService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/hotel/bookings")
@CrossOrigin(origins = "*")
public class BookingController {

   @Autowired
   private BookingService bookingService;

   @PostMapping
   public ResponseEntity<BookingResponseDto> createBooking(@RequestBody @Valid BookingRequestDto requestDto) {
      try {
         BookingResponseDto responseDto = bookingService.createBooking(requestDto);
         return new ResponseEntity<>(responseDto, HttpStatus.CREATED);
      } catch (RuntimeException e) {
         throw new RuntimeException("Error creating booking: " + e.getMessage());
      }
   }

   @GetMapping
   @PreAuthorize("hasRole('MANAGER') or hasRole('RECEPTIONIST')")
   public ResponseEntity<List<BookingResponseDto>> getAllBookings() {
      List<BookingResponseDto> bookings = bookingService.getAllBookings();
      return new ResponseEntity<>(bookings, HttpStatus.OK);
   }

   @GetMapping("/entity/{reference}")
   @PreAuthorize("hasRole('MANAGER') or hasRole('RECEPTIONIST') or hasRole('HOUSEKEEPING') or hasRole('GUEST')")
   public ResponseEntity<BookingResponseDto> getBookingByReference(@PathVariable String reference) {
      try {
         BookingResponseDto booking = bookingService.getBookingByReference(reference);
         return new ResponseEntity<>(booking, HttpStatus.OK);
      } catch (RuntimeException e) {
         throw new RuntimeException("Booking not found with id: " + reference);
      }
   }

   @GetMapping("/response-entity/{reference}")
   @PreAuthorize("hasRole('MANAGER') or hasRole('RECEPTIONIST') or hasRole('HOUSEKEEPING') or hasRole('GUEST')")
   public ResponseEntity<Booking> getBookingEntityByReference(@PathVariable String reference) {
      try {
         Booking booking = bookingService.getBookingEntityByReference(reference);
         return new ResponseEntity<>(booking, HttpStatus.OK);
      } catch (RuntimeException e) {
         throw new RuntimeException("Booking not found with id: " + reference);
      }
   }

   @DeleteMapping("/{id}")
   public ResponseEntity<Void> deleteBooking(@PathVariable Long id) {
      try {
         bookingService.deleteBooking(id);
         return new ResponseEntity<>(HttpStatus.NO_CONTENT);
      } catch (RuntimeException e) {
         throw new RuntimeException("Error deleting booking: " + e.getMessage());
      }
   }

   @GetMapping("/guest/{guestEmail}")
   public ResponseEntity<List<BookingResponseDto>> getBookingsByGuestEmail(@PathVariable String guestEmail) {
      List<BookingResponseDto> bookings = bookingService.getBookingsByGuestEmail(guestEmail);
      return new ResponseEntity<>(bookings, HttpStatus.OK);
   }
}
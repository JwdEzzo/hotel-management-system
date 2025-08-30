package com.backend.hotel_management.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend.hotel_management.dto.request.UpdateBookingRequestDto;
import com.backend.hotel_management.dto.response.UpdateBookingResponseDto;
import com.backend.hotel_management.model.GuestPrincipal;
import com.backend.hotel_management.service.UpdateBookingService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/hotel")
@CrossOrigin("*")
public class UpdateBookingController {

   @Autowired
   private UpdateBookingService updateBookingService;

   @PutMapping("/update-booking/{bookingReference}")
   public ResponseEntity<UpdateBookingResponseDto> updateBooking(
         @PathVariable String bookingReference,
         @Valid @RequestBody UpdateBookingRequestDto requestDto,
         @AuthenticationPrincipal GuestPrincipal guestPrincipal) {

      try {
         // Add null check for authentication
         if (guestPrincipal == null || guestPrincipal.getGuest() == null) {
            System.err.println("Authentication failed - no guest principal");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
         }

         Long authenticatedGuestId = guestPrincipal.getGuest().getId();

         System.out.println("Authenticated Guest ID: " + authenticatedGuestId);
         System.out.println("Received bookingReference: " + bookingReference);
         System.out.println("Request body: " + requestDto);

         // Add validation
         if (bookingReference == null || bookingReference.trim().isEmpty()) {
            System.err.println("Invalid booking reference");
            return ResponseEntity.badRequest().body(null);
         }

         UpdateBookingResponseDto response = updateBookingService.updateBookingByReference(
               bookingReference, requestDto, authenticatedGuestId);

         return ResponseEntity.ok(response);

      } catch (IllegalArgumentException e) {
         System.err.println("Validation error: " + e.getMessage());
         return ResponseEntity.badRequest().body(null);
      } catch (Exception e) {
         System.err.println("Error updating booking: " + e.getMessage());
         e.printStackTrace();
         return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
      }
   }

}
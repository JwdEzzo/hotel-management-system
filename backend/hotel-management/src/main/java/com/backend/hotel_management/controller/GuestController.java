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
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend.hotel_management.dto.request.GuestRequestDto;
import com.backend.hotel_management.dto.response.GuestResponseDto;
import com.backend.hotel_management.service.GuestService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/hotel/guests")
@CrossOrigin(origins = "*")
public class GuestController {

   @Autowired
   private GuestService guestService;

   // Create new guest - MANAGER and RECEPTIONIST can create guests
   @PostMapping
   public ResponseEntity<GuestResponseDto> createGuest(@RequestBody @Valid GuestRequestDto requestDto) {
      try {
         GuestResponseDto responseDto = guestService.createGuest(requestDto);
         return new ResponseEntity<>(responseDto, HttpStatus.CREATED);
      } catch (RuntimeException e) {
         throw new RuntimeException("Error creating guest: " + e.getMessage());
      }
   }

   // Get all guests - MANAGER and RECEPTIONIST can view all guests
   @GetMapping
   @PreAuthorize("hasRole('MANAGER') or hasRole('RECEPTIONIST')")
   public ResponseEntity<List<GuestResponseDto>> getAllGuests() {
      List<GuestResponseDto> guests = guestService.getAllGuests();
      return new ResponseEntity<>(guests, HttpStatus.OK);
   }

   // Get guest by ID - MANAGER, RECEPTIONIST, and HOUSEKEEPING can view specific guest
   @GetMapping("/{id}")
   public ResponseEntity<GuestResponseDto> getGuestById(@PathVariable Long id) {
      try {
         GuestResponseDto guest = guestService.getGuestById(id);
         return new ResponseEntity<>(guest, HttpStatus.OK);
      } catch (RuntimeException e) {
         throw new RuntimeException("Guest not found with id: " + id);
      }
   }

   @PutMapping("/{id}")
   public ResponseEntity<GuestResponseDto> updateGuest(@PathVariable Long id,
         @RequestBody @Valid GuestRequestDto requestDto) {
      try {
         GuestResponseDto updatedGuest = guestService.updateGuest(id, requestDto);
         return new ResponseEntity<>(updatedGuest, HttpStatus.OK);
      } catch (RuntimeException e) {
         throw new RuntimeException("Error updating guest: " + e.getMessage());
      }
   }

   @DeleteMapping("/{id}")
   public ResponseEntity<Void> deleteGuest(@PathVariable Long id) {
      try {
         guestService.deleteGuest(id);
         return new ResponseEntity<>(HttpStatus.NO_CONTENT);
      } catch (RuntimeException e) {
         throw new RuntimeException("Error deleting guest: " + e.getMessage());
      }
   }
}
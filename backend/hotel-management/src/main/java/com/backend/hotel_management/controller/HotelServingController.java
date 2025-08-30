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

import com.backend.hotel_management.dto.request.HotelServingRequestDto;
import com.backend.hotel_management.dto.response.HotelServingResponseDto;
import com.backend.hotel_management.service.HotelServingService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/hotel/services")
@CrossOrigin(origins = "*")
public class HotelServingController {

   @Autowired
   private HotelServingService hotelServingService;

   // Create new hotel service - Only MANAGER can create services
   @PostMapping
   @PreAuthorize("hasRole('MANAGER')")
   public ResponseEntity<HotelServingResponseDto> createHotelServing(
         @RequestBody @Valid HotelServingRequestDto requestDto) {
      try {
         HotelServingResponseDto responseDto = hotelServingService.createHotelServing(requestDto);
         return new ResponseEntity<>(responseDto, HttpStatus.CREATED);
      } catch (RuntimeException e) {
         throw new RuntimeException("Error creating hotel service: " + e.getMessage());
      }
   }

   @GetMapping
   public ResponseEntity<List<HotelServingResponseDto>> getAllHotelServings() {
      List<HotelServingResponseDto> services = hotelServingService.getAllHotelServings();
      return new ResponseEntity<>(services, HttpStatus.OK);
   }

   @GetMapping("/{id}")
   public ResponseEntity<HotelServingResponseDto> getHotelServingById(@PathVariable Long id) {
      try {
         HotelServingResponseDto service = hotelServingService.getHotelServingById(id);
         return new ResponseEntity<>(service, HttpStatus.OK);
      } catch (RuntimeException e) {
         throw new RuntimeException("Hotel service not found with id: " + id);
      }
   }

   // Update hotel service - Only MANAGER can update services
   @PutMapping("/{id}")
   @PreAuthorize("hasRole('MANAGER')")
   public ResponseEntity<HotelServingResponseDto> updateHotelServing(@PathVariable Long id,
         @RequestBody @Valid HotelServingRequestDto requestDto) {
      try {
         HotelServingResponseDto updatedService = hotelServingService.updateHotelServing(id, requestDto);
         return new ResponseEntity<>(updatedService, HttpStatus.OK);
      } catch (RuntimeException e) {
         throw new RuntimeException("Error updating hotel service: " + e.getMessage());
      }
   }

   // Delete hotel service - Only MANAGER can delete services
   @DeleteMapping("/{id}")
   @PreAuthorize("hasRole('MANAGER')")
   public ResponseEntity<Void> deleteHotelServing(@PathVariable Long id) {
      try {
         hotelServingService.deleteHotelServing(id);
         return new ResponseEntity<>(HttpStatus.NO_CONTENT);
      } catch (RuntimeException e) {
         throw new RuntimeException("Error deleting hotel service: " + e.getMessage());
      }
   }
}
package com.backend.hotel_management.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend.hotel_management.dto.request.ApplyBookingRequestDto;
import com.backend.hotel_management.dto.response.ApplyBookingResponseDto;
import com.backend.hotel_management.service.ApplyBookingService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/hotel/apply-booking")
@CrossOrigin(origins = "*")
public class ApplyBookingController {

   @Autowired
   private ApplyBookingService applyBookingService;

   // Create new booking application - Public endpoint for hotel webpage visitors
   @PostMapping
   public ResponseEntity<ApplyBookingResponseDto> createApplyBooking(
         @RequestBody @Valid ApplyBookingRequestDto requestDto) {
      try {
         ApplyBookingResponseDto responseDto = applyBookingService.createApplyBooking(requestDto);
         return new ResponseEntity<>(responseDto, HttpStatus.CREATED);
      } catch (RuntimeException e) {
         throw new RuntimeException("Error creating booking application: " + e.getMessage());
      }
   }

}
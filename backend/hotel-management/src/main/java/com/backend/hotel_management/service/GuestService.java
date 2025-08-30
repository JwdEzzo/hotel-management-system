package com.backend.hotel_management.service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.backend.hotel_management.dto.request.GuestLoginRequestDto;
import com.backend.hotel_management.dto.request.GuestRequestDto;
import com.backend.hotel_management.dto.response.GuestJwtResponseDto;
import com.backend.hotel_management.dto.response.GuestResponseDto;
import com.backend.hotel_management.model.Booking;
import com.backend.hotel_management.model.Guest;
import com.backend.hotel_management.repository.GuestRepository;

@Service
public class GuestService {

   @Autowired
   private GuestRepository guestRepository;

   @Autowired
   private AuthenticationManager authManager;

   @Autowired
   private BCryptPasswordEncoder passwordEncoder;

   @Autowired
   private JwtService jwtService;

   // Convert Request DTO to Entity
   public Guest convertRequestDtoToEntity(GuestRequestDto request) {
      Guest entity = new Guest();
      entity.setFullName(request.getFullName());
      entity.setEmail(request.getEmail());
      entity.setPhoneNumber(request.getPhoneNumber());
      entity.setCountry(request.getCountry());
      entity.setAddress(request.getAddress());
      entity.setCity(request.getCity());

      // Set password if provided
      if (request.getPassword() != null && !request.getPassword().isEmpty()) {
         entity.setPassword(passwordEncoder.encode(request.getPassword()));
      }

      return entity;
   }

   // Convert Entity to Response DTO
   public GuestResponseDto convertEntityToResponseDto(Guest guest) {
      GuestResponseDto responseDto = new GuestResponseDto();
      responseDto.setId(guest.getId());
      responseDto.setFullName(guest.getFullName());
      responseDto.setEmail(guest.getEmail());
      responseDto.setPhoneNumber(guest.getPhoneNumber());
      responseDto.setCountry(guest.getCountry());
      responseDto.setAddress(guest.getAddress());
      responseDto.setCity(guest.getCity());

      // Extract booking IDs from the guest's bookings
      List<Long> bookingIds = new ArrayList<>();
      if (guest.getBookings() != null && !guest.getBookings().isEmpty()) {
         bookingIds = guest.getBookings().stream()
               .map(Booking::getId)
               .collect(Collectors.toList());
      }
      responseDto.setBookingIds(bookingIds);

      return responseDto;
   }

   // Convert List of Entities into List of Response Dtos
   public List<GuestResponseDto> convertEntityToResponseDto(List<Guest> guests) {
      return guests.stream()
            .map(this::convertEntityToResponseDto)
            .collect(Collectors.toList());
   }

   // Create new Guest
   public GuestResponseDto createGuest(GuestRequestDto requestDto) {
      Guest guest = convertRequestDtoToEntity(requestDto);
      Guest savedGuest = guestRepository.save(guest);
      return convertEntityToResponseDto(savedGuest);
   }

   // Get all Guests
   public List<GuestResponseDto> getAllGuests() {
      List<Guest> guests = guestRepository.findAll();
      return convertEntityToResponseDto(guests);
   }

   // Get Guest by ID
   public GuestResponseDto getGuestById(Long id) {
      Guest guest = guestRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Guest not found with id: " + id));
      return convertEntityToResponseDto(guest);
   }

   // Update Guest by ID
   public GuestResponseDto updateGuest(Long id, GuestRequestDto requestDto) {
      Guest existingGuest = guestRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Guest not found with id: " + id));
      existingGuest.setFullName(requestDto.getFullName());
      existingGuest.setEmail(requestDto.getEmail());

      // Update password if provided
      if (requestDto.getPassword() != null && !requestDto.getPassword().isEmpty()) {
         existingGuest.setPassword(passwordEncoder.encode(requestDto.getPassword()));
      }

      existingGuest.setPhoneNumber(requestDto.getPhoneNumber());
      existingGuest.setCountry(requestDto.getCountry());
      existingGuest.setAddress(requestDto.getAddress());
      existingGuest.setCity(requestDto.getCity());

      Guest updatedGuest = guestRepository.save(existingGuest);
      return convertEntityToResponseDto(updatedGuest);
   }

   public GuestJwtResponseDto login(GuestLoginRequestDto guestLoginRequest) {
      try {
         // Log the login attempt
         System.out.println("Attempting guest login for email: " + guestLoginRequest.getEmail());

         // Check if guest exists
         Guest guest = guestRepository.findByEmail(guestLoginRequest.getEmail())
               .orElseThrow(() -> new RuntimeException("Guest not found with email: " + guestLoginRequest.getEmail()));

         // Verify password
         if (!passwordEncoder.matches(guestLoginRequest.getPassword(), guest.getPassword())) {
            throw new RuntimeException("Invalid password");
         }

         // Generate token
         String token = jwtService.generateTokenForGuest(guestLoginRequest.getEmail());

         System.out.println("Guest login successful for: " + guest.getEmail());
         return new GuestJwtResponseDto(token, guest.getEmail());

      } catch (Exception e) {
         System.err.println("Guest login failed: " + e.getMessage());
         e.printStackTrace();
         throw new RuntimeException("Invalid credentials: " + e.getMessage());
      }
   }

   // Delete Guest by ID
   public void deleteGuest(Long id) {
      if (!guestRepository.existsById(id)) {
         throw new RuntimeException("Guest not found with id: " + id);

      }
      guestRepository.deleteById(id);
   }
}

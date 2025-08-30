package com.backend.hotel_management.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.backend.hotel_management.dto.request.RoomRequestDto;
import com.backend.hotel_management.dto.response.RoomResponseDto;
import com.backend.hotel_management.service.RoomService;

import jakarta.validation.Valid;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/hotel/rooms")
public class RoomController {

   @Autowired
   private RoomService roomService;

   // Create new room
   @PostMapping
   @PreAuthorize("hasRole('MANAGER') or hasRole('RECEPTIONIST')")
   public ResponseEntity<RoomResponseDto> createRoom(@RequestBody @Valid RoomRequestDto roomRequestDto) {
      try {
         RoomResponseDto responseDto = roomService.createRoom(roomRequestDto);
         return new ResponseEntity<>(responseDto, HttpStatus.CREATED);
      } catch (RuntimeException e) {
         throw new RuntimeException("Error creating room: " + e.getMessage());
      }
   }

   // Get All rooms
   @GetMapping
   // @PreAuthorize("hasRole('MANAGER') or hasRole('RECEPTIONIST') or hasRole('HOUSEKEEPING') or hasRole('MAINTENANCE') or hasRole('KITCHEN')")
   public ResponseEntity<List<RoomResponseDto>> getAllRooms() {
      try {
         List<RoomResponseDto> roomsResponseDtos = roomService.getAllRooms();
         return new ResponseEntity<>(roomsResponseDtos, HttpStatus.OK);
      } catch (Exception e) {
         throw new RuntimeException("Error getting rooms: " + e.getMessage());
      }
   }

   // Get room by Id
   @GetMapping("/{id}")
   // @PreAuthorize("hasRole('MANAGER') or hasRole('RECEPTIONIST') or hasRole('HOUSEKEEPING') or hasRole('MAINTENANCE') or hasRole('KITCHEN')")
   public ResponseEntity<RoomResponseDto> getRoomById(@PathVariable Long id) {
      try {
         RoomResponseDto roomResponse = roomService.getRoomById(id);
         return new ResponseEntity<>(roomResponse, HttpStatus.OK);
      } catch (Exception e) {
         throw new RuntimeException("Room not found with id: " + id);
      }
   }

   // Update Room
   @PutMapping("/{id}")
   @PreAuthorize("hasRole('MANAGER') or hasRole('RECEPTIONIST')")
   public ResponseEntity<RoomResponseDto> updateRoom(@PathVariable Long id, @RequestBody RoomRequestDto request) {
      try {
         RoomResponseDto updatedRoom = roomService.updateRoom(id, request);
         return new ResponseEntity<>(updatedRoom, HttpStatus.OK);
      } catch (Exception e) {
         throw new RuntimeException("Error updating room: " + e.getMessage());
      }
   }

   // Delete Room by Id
   @DeleteMapping("/{id}")
   @PreAuthorize("hasRole('MANAGER')")
   public ResponseEntity<Void> deleteRoom(@PathVariable Long id) {
      try {
         roomService.deleteRoom(id);
         return new ResponseEntity<>(HttpStatus.NO_CONTENT);
      } catch (RuntimeException e) {
         throw new RuntimeException("Error deleting room: " + e.getMessage());
      }
   }

   @GetMapping("/available")
   public ResponseEntity<List<RoomResponseDto>> getAvailableRooms(
         @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime checkIn,
         @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime checkOut) {
      try {
         List<RoomResponseDto> availableRooms = roomService.getAvailableRooms(checkIn, checkOut);
         return new ResponseEntity<>(availableRooms, HttpStatus.OK);
      } catch (Exception e) {
         return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
      }
   }
}

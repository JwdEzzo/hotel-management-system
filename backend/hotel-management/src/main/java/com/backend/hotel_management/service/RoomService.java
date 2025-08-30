package com.backend.hotel_management.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.backend.hotel_management.dto.request.RoomRequestDto;
import com.backend.hotel_management.dto.response.RoomResponseDto;
import com.backend.hotel_management.model.Booking;
import com.backend.hotel_management.model.Room;
import com.backend.hotel_management.repository.BookingRepository;
import com.backend.hotel_management.repository.RoomRepository;

@Service
public class RoomService {

   @Autowired
   private RoomRepository roomRepository;

   @Autowired
   private BookingRepository bookingRepository;

   // Convert Request DTO to Entity
   public Room convertRequestDtoToEntity(RoomRequestDto request) {
      Room entity = new Room();
      entity.setRoomNumber(request.getRoomNumber());
      entity.setRoomStatus(request.getRoomStatus());
      entity.setRoomType(request.getRoomType());
      return entity;
   }

   // Convert Entity to Response DTO
   public RoomResponseDto convertEntityToResponseDto(Room room) {
      RoomResponseDto responseDto = new RoomResponseDto();
      responseDto.setId(room.getId());
      responseDto.setRoomNumber(room.getRoomNumber());
      responseDto.setRoomType(room.getRoomType());
      responseDto.setRoomStatus(room.getRoomStatus());
      responseDto.setPricePerNight(room.getPricePerNight());
      responseDto.setMaxOccupancy(room.getMaxOccupancy());

      return responseDto;
   }

   // Convert Entity List to Response DTO List
   public List<RoomResponseDto> convertEntityListToResponseDtos(List<Room> rooms) {
      return rooms.stream()
            .map(this::convertEntityToResponseDto)
            .collect(Collectors.toList());
   }

   // Create new Room
   public RoomResponseDto createRoom(RoomRequestDto requestDto) {
      if (roomRepository.existsByRoomNumber(requestDto.getRoomNumber())) {
         throw new RuntimeException("Room with number " + requestDto.getRoomNumber() + "already exists");
      }

      Room room = convertRequestDtoToEntity(requestDto);
      Room savedRoom = roomRepository.save(room);
      return convertEntityToResponseDto(savedRoom);

   }

   // Get all Rooms
   public List<RoomResponseDto> getAllRooms() {
      List<Room> rooms = roomRepository.findAll();
      return convertEntityListToResponseDtos(rooms);
   }

   // Get Room by ID
   public RoomResponseDto getRoomById(Long id) {
      Room room = roomRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Room not found with id: " + id));
      return convertEntityToResponseDto(room);
   }

   // Update Room by ID
   public RoomResponseDto updateRoom(Long id, RoomRequestDto requestDto) {
      Room existingRoom = roomRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Room not found with id: " + id));

      // Update fields
      existingRoom.setRoomNumber(requestDto.getRoomNumber());
      existingRoom.setRoomStatus(requestDto.getRoomStatus());
      existingRoom.setRoomType(requestDto.getRoomType());

      Room updatedRoom = roomRepository.save(existingRoom);
      return convertEntityToResponseDto(updatedRoom);
   }

   // Delete Room by ID
   public void deleteRoom(Long id) {
      if (!roomRepository.existsById(id)) {
         throw new RuntimeException("Room not found with id: " + id);
      }
      roomRepository.deleteById(id);

   }

   public List<RoomResponseDto> getAvailableRooms(LocalDateTime checkIn, LocalDateTime checkOut) {
      // Get all rooms
      List<Room> allRooms = roomRepository.findAll();

      // Filter out rooms that have conflicting bookings
      List<Room> availableRooms = allRooms.stream()
            .filter(room -> !hasBookingConflict(room.getId(), checkIn, checkOut))
            .collect(Collectors.toList());

      return convertEntityListToResponseDtos(availableRooms);
   }

   private boolean hasBookingConflict(Long roomId, LocalDateTime checkIn, LocalDateTime checkOut) {
      List<Booking> existingBookings = bookingRepository.findByRoom_IdAndDateRangeOverlap(roomId, checkIn, checkOut);
      return !existingBookings.isEmpty();
   }

}
package com.backend.hotel_management.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.backend.hotel_management.model.Room;

public interface RoomRepository extends JpaRepository<Room, Long> {
   // Find room by room number
   Optional<Room> findByRoomNumber(String roomNumber);

   // Check if room number exists
   boolean existsByRoomNumber(String roomNumber);

   // // Find rooms by room type
   // List<Room> findByRoomType(RoomType roomType);

   // // Find rooms by room status
   // List<Room> findByRoomStatus(RoomStatus roomStatus);

   // // Find rooms by room type and status
   // List<Room> findByRoomTypeAndRoomStatus(RoomType roomType, RoomStatus roomStatus);

}

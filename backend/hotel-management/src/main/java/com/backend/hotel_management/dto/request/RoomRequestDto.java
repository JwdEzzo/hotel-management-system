package com.backend.hotel_management.dto.request;

import com.backend.hotel_management.enums.RoomStatus;
import com.backend.hotel_management.enums.RoomType;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RoomRequestDto {

   @NotBlank(message = "Room number is required")
   private String roomNumber;

   @NotNull(message = "Room type is required")
   private RoomType roomType;

   @NotNull(message = "Room status is required")
   private RoomStatus roomStatus;

   @NotNull(message = "Max occupancy is required")
   private Integer maxOccupancy; // NEW

}
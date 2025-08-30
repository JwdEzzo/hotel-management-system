package com.backend.hotel_management.model;

import java.math.BigDecimal;
import java.util.List;

import com.backend.hotel_management.enums.RoomStatus;
import com.backend.hotel_management.enums.RoomType;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PostLoad;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Room {
   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   private Long id;

   @Column(unique = true, nullable = false)
   private String roomNumber;

   @Enumerated(EnumType.STRING)
   @Column(nullable = false)
   private RoomType roomType;

   @Enumerated(EnumType.STRING)
   @Column(nullable = false)
   private RoomStatus roomStatus;

   @Column(nullable = false)
   private BigDecimal pricePerNight;

   @Column(nullable = false, columnDefinition = "integer default 1")
   private Integer maxOccupancy;

   // One Room -> Many Bookings : Owner = Booking
   @OneToMany(mappedBy = "room")
   private List<Booking> bookings;

   @PostLoad
   private void calculatePricePerNight() {
      this.pricePerNight = getPriceByRoomType(this.roomType);
   }

   public BigDecimal getPricePerNight() {
      if (this.pricePerNight == null) {
         this.pricePerNight = getPriceByRoomType(this.roomType);
      }
      return this.pricePerNight;
   }

   public void setRoomType(RoomType roomType) {
      this.roomType = roomType;
      this.pricePerNight = getPriceByRoomType(roomType);
      this.maxOccupancy = getMaxOccupancyByRoomType(roomType); // Set occupancy based on room type
   }

   private static BigDecimal getPriceByRoomType(RoomType roomType) {
      if (roomType == null) {
         return new BigDecimal("100.00");
      }

      return switch (roomType) {
         case SINGLE -> new BigDecimal("100.00");
         case DOUBLE -> new BigDecimal("150.00");
         case DELUXE -> new BigDecimal("250.00");
         case SUITE -> new BigDecimal("400.00");
         default -> new BigDecimal("100.00");
      };
   }

   private static Integer getMaxOccupancyByRoomType(RoomType roomType) {
      if (roomType == null) {
         return 1;
      }

      return switch (roomType) {
         case SINGLE -> 1;
         case DOUBLE -> 2;
         case DELUXE -> 3;
         case SUITE -> 4;
         default -> 1;
      };
   }
}
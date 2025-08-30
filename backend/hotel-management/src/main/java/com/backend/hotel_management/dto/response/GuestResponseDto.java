package com.backend.hotel_management.dto.response;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GuestResponseDto {
   private Long id;
   private String fullName;
   private String email;
   private String phoneNumber;
   private String country;
   private String address;
   private String city;
   private List<Long> bookingIds; // List of booking IDs associated with this guest
}
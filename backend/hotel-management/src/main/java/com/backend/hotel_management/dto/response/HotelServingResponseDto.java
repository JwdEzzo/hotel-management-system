package com.backend.hotel_management.dto.response;

import java.math.BigDecimal;

import com.backend.hotel_management.enums.ServicePricingType;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// HotelServing Response DTO
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HotelServingResponseDto {
   private Long id;
   private String name;
   private ServicePricingType pricingType;
   private BigDecimal price;
   private String duration;
   // Note: Not including rooms list to avoid complexity
   //The constructor HotelServingResponseDto(Long, String, BigDecimal, ServicePricingType, String) is undefinedJ

}

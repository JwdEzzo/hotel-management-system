package com.backend.hotel_management.dto.request;

import java.math.BigDecimal;

import com.backend.hotel_management.enums.ServicePricingType;

import jakarta.persistence.Column;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HotelServingRequestDto {

   @NotBlank(message = "Service name is required")
   private String name;

   @NotNull(message = "Pricing type is required")
   private ServicePricingType pricingType;

   @NotNull(message = "Price is required")
   private BigDecimal price;

   @Column(nullable = true)
   private String duration;
}
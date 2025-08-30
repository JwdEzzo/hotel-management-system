package com.backend.hotel_management.model;

import java.math.BigDecimal;

import com.backend.hotel_management.enums.ServicePricingType;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HotelServing {

      @Id
      @GeneratedValue(strategy = GenerationType.IDENTITY)
      private Long id;

      @Column(nullable = false, unique = true)
      private String name;

      @Enumerated(EnumType.STRING)
      @Column(nullable = false)
      private ServicePricingType pricingType;

      @Column(nullable = false)
      private BigDecimal price;

      @Column(nullable = true)
      private String duration;

}
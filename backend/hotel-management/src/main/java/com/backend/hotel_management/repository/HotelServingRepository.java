package com.backend.hotel_management.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.backend.hotel_management.model.HotelServing;

@Repository
public interface HotelServingRepository extends JpaRepository<HotelServing, Long> {
      // // Find service by name
      // Optional<HotelServing> findByName(String name);

      // // Find services by price range
      // List<HotelServing> findByPriceBetween(BigDecimal minPrice, BigDecimal maxPrice);

      // // Find services by exact price
      // List<HotelServing> findByPrice(BigDecimal price);

      public boolean existsByName(String name);

}

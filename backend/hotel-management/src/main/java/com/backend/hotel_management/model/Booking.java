package com.backend.hotel_management.model;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.backend.hotel_management.enums.ServicePricingType;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapKeyColumn;
import jakarta.persistence.PrePersist;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Booking {
   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   private Long id;

   @NotNull
   @Column(nullable = false, unique = true)
   private String bookingReference;

   @NotNull
   @Column(nullable = false)
   private LocalDateTime checkInDateTime;

   @NotNull
   @Column(nullable = false)
   private LocalDateTime checkOutDateTime;

   @Column(nullable = false)
   private BigDecimal totalPrice;

   // Primary guest (the one who made the booking)
   @ManyToOne
   @JoinColumn(name = "guest_id")
   private Guest guest;

   @ManyToOne
   @JoinColumn(name = "room_id")
   private Room room;
   // Additional guests (just names, no full registration)
   @ElementCollection
   @CollectionTable(//
         name = "booking_additional_guests", //
         joinColumns = @JoinColumn(name = "booking_id")//
   )
   @Column(name = "guest_name")
   private List<String> additionalGuests;

   @ManyToMany
   @JoinTable( //
         name = "booking_services", //
         joinColumns = @JoinColumn(name = "booking_id"), //
         inverseJoinColumns = @JoinColumn(name = "hotelServing_id")//
   )
   private List<HotelServing> selectedServices;

   public int getTotalGuests() {
      return 1 + (additionalGuests != null ? additionalGuests.size() : 0);
   }

   @PrePersist
   protected void onCreate() {
      if (bookingReference == null || bookingReference.isEmpty()) {
         bookingReference = generateBookingReference();
      }
   }

   // Add this field to store quantities as a simple map
   @ElementCollection
   @CollectionTable(//
         name = "booking_serving_quantities", //
         joinColumns = @JoinColumn(name = "booking_id") //
   )
   @MapKeyColumn(name = "service_id")
   @Column(name = "quantity")
   private Map<Long, Integer> serviceQuantities = new HashMap<>();

   // Helper methods to work with services and quantities
   public void addService(HotelServing service, Integer quantity) {
      if (selectedServices == null) {
         selectedServices = new ArrayList<>();
      }
      if (serviceQuantities == null) {
         serviceQuantities = new HashMap<>();
      }

      if (!selectedServices.contains(service)) {
         selectedServices.add(service);
      }
      serviceQuantities.put(service.getId(), quantity);
   }

   public Integer getServiceQuantity(HotelServing service) {
      return serviceQuantities != null ? serviceQuantities.getOrDefault(service.getId(), 1) : 1;
   }

   public BigDecimal calculateServicesTotal() {
      if (selectedServices == null || selectedServices.isEmpty()) {
         return BigDecimal.ZERO;
      }

      long nights = Duration.between(checkInDateTime, checkOutDateTime).toDays();

      return selectedServices.stream()
            .map(service -> {
               Integer quantity = getServiceQuantity(service);

               // Handle different pricing types
               if (service.getPricingType() == ServicePricingType.PER_NIGHT) {
                  // For PER_NIGHT services, multiply by number of nights
                  return service.getPrice().multiply(BigDecimal.valueOf(quantity * nights));
               } else if (service.getPricingType() == ServicePricingType.PER_HOUR) {
                  // For PER_HOUR services, use quantity as hours
                  return service.getPrice().multiply(BigDecimal.valueOf(quantity));
               } else {
                  // For PER_ORDER services, use quantity as is
                  return service.getPrice().multiply(BigDecimal.valueOf(quantity));
               }
            })
            .reduce(BigDecimal.ZERO, BigDecimal::add);
   }

   private String generateBookingReference() {
      // Alphanumeric booking reference
      // Format: 2 letters + 6 numbers (e.g., BK123456)
      String prefix = "BK";
      int randomNum = (int) (Math.random() * 900000) + 100000; // 6-digit number
      return prefix + randomNum;
   }
}

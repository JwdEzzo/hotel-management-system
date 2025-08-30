package com.backend.hotel_management.model;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Complaint {

      @Id
      @GeneratedValue(strategy = GenerationType.IDENTITY)
      private Long id;
      private String title;
      private String message;
      private LocalDateTime createdAt;

      @ManyToOne
      @JoinColumn(name = "complaint_guest")
      private Guest guest;

      @PrePersist
      public void onCreate() {
            createdAt = LocalDateTime.now();
      }
}

// @PrePersist
// protected void onCreate() {
//    if (bookingReference == null || bookingReference.isEmpty()) {
//       bookingReference = generateBookingReference();
//    }
// }

// private String generateBookingReference() {
//    // Generate a 8-character alphanumeric booking reference
//    // Format: 2 letters + 6 numbers (e.g., BK123456)
//    String prefix = "BK";
//    int randomNum = (int) (Math.random() * 900000) + 100000; // 6-digit number
//    return prefix + randomNum;
// }
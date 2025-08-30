package com.backend.hotel_management.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ContactUs {

   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   private Long id;

   @NotBlank
   @Column(nullable = false)
   private String firstName;

   @NotBlank
   @Column(nullable = false)
   private String lastName;

   @NotBlank
   @Email
   @Column(nullable = false)
   private String email;

   @NotBlank
   @Column(nullable = false)
   private String subject;

   @NotBlank
   @Column(nullable = false)
   private String message;

   private LocalDateTime createdAt;

   @PrePersist
   public void onCreate() {
      createdAt = LocalDateTime.now();
   }
}

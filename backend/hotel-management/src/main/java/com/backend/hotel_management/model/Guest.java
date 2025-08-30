package com.backend.hotel_management.model;

import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Guest {

      @Id
      @GeneratedValue(strategy = GenerationType.IDENTITY)
      private Long id;

      @NotBlank
      @Column(nullable = false)
      private String fullName;

      @NotBlank
      @Email
      @Column(unique = true, nullable = false)
      private String email;

      @NotBlank
      @Column(nullable = false)
      private String password;

      @NotBlank
      @Column(unique = true, nullable = false)
      private String phoneNumber;

      @NotBlank
      @Column(nullable = false)
      private String country;

      @NotBlank
      @Column(nullable = false)
      private String address;

      @NotBlank
      @Column(nullable = false)
      private String city;

      // One Guest -> Many Bookings : Owner=Booking
      @OneToMany(mappedBy = "guest", cascade = CascadeType.ALL)
      private List<Booking> bookings;

      @OneToMany(//
                  mappedBy = "guest", // 
                  cascade = CascadeType.ALL, //
                  fetch = FetchType.LAZY //
      )
      private List<Complaint> complaints;

}

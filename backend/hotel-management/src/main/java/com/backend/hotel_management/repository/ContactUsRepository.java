package com.backend.hotel_management.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.backend.hotel_management.model.ContactUs;

@Repository
public interface ContactUsRepository extends JpaRepository<ContactUs, Long> {

   // Find By Email
   ContactUs findByEmail(String email);

}

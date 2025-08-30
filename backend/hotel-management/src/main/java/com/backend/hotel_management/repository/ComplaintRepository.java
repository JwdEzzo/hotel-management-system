package com.backend.hotel_management.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.backend.hotel_management.model.Complaint;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, Long> {

}

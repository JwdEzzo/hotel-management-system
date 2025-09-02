package com.backend.hotel_management.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend.hotel_management.dto.request.ComplaintRequestDto;
import com.backend.hotel_management.dto.response.ComplaintResponseDto;
import com.backend.hotel_management.service.ComplaintService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/hotel/complaints")
@CrossOrigin(origins = "*")
public class ComplaintController {

   @Autowired
   private ComplaintService complaintService;

   // Create Complaint
   @PostMapping
   // @PreAuthorize("hasRole('MANAGER')")
   public ResponseEntity<ComplaintResponseDto> createComplaint(
         @Valid @RequestBody ComplaintRequestDto request) {
      try {
         ComplaintResponseDto response = complaintService.createComplaint(request);
         return new ResponseEntity<>(response, HttpStatus.CREATED);
      } catch (RuntimeException e) {
         return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
      }
   }

   // Get a specific complaint by ID
   @GetMapping("/{guestEmail}")
   // @PreAuthorize("hasRole('MANAGER')")
   public ResponseEntity<List<ComplaintResponseDto>> getComplaintByGuestEmail(@PathVariable String guestEmail) {
      try {
         List<ComplaintResponseDto> response = complaintService.getComplaintByGuestEmail(guestEmail);
         return new ResponseEntity<>(response, HttpStatus.OK);
      } catch (RuntimeException e) {
         return new ResponseEntity<>(HttpStatus.NOT_FOUND);
      }
   }

   @GetMapping
   // @PreAuthorize("hasRole('MANAGER')")
   public ResponseEntity<List<ComplaintResponseDto>> getAllComplaints() {
      try {
         List<ComplaintResponseDto> responses = complaintService.getAllComplaints();
         return new ResponseEntity<>(responses, HttpStatus.OK);
      } catch (Exception e) {
         return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
      }
   }

   // @PutMapping("/{id}")
   // public ResponseEntity<ComplaintResponseDto> updateComplaint(
   //       @PathVariable Long id,
   //       @Valid @RequestBody ComplaintRequestDto request) {
   //    try {
   //       ComplaintResponseDto response = complaintService.updateComplaint(id, request);
   //       return new ResponseEntity<>(response, HttpStatus.OK);
   //    } catch (RuntimeException e) {
   //       return new ResponseEntity<>(HttpStatus.NOT_FOUND);
   //    }
   // }

   @DeleteMapping("/{id}")
   public ResponseEntity<Void> deleteComplaint(@PathVariable Long id) {
      try {
         complaintService.deleteComplaint(id);
         return new ResponseEntity<>(HttpStatus.NO_CONTENT);
      } catch (RuntimeException e) {
         return new ResponseEntity<>(HttpStatus.NOT_FOUND);
      }
   }

}

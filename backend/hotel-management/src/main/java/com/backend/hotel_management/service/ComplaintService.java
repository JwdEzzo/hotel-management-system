package com.backend.hotel_management.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.backend.hotel_management.dto.request.ComplaintRequestDto;
import com.backend.hotel_management.dto.response.ComplaintResponseDto;
import com.backend.hotel_management.model.Complaint;
import com.backend.hotel_management.model.Guest;
import com.backend.hotel_management.repository.ComplaintRepository;
import com.backend.hotel_management.repository.GuestRepository;

@Service
public class ComplaintService {

   @Autowired
   private ComplaintRepository complaintRepository;

   @Autowired
   private GuestRepository guestRepository;

   public Complaint convertRequestDtoToEntity(ComplaintRequestDto request) {
      Complaint entity = new Complaint();
      entity.setTitle(request.getTitle());
      entity.setMessage(request.getMessage());
      entity.setCreatedAt(LocalDateTime.now());

      // Fetch the guest from database using the guestId from request
      Guest guest = guestRepository.findById(request.getGuestId())
            .orElseThrow(() -> new RuntimeException("Guest not found with ID: " + request.getGuestId()));

      entity.setGuest(guest);
      return entity;
   }

   public ComplaintResponseDto convertEntityToResponseDto(Complaint entity) {
      ComplaintResponseDto responseDto = new ComplaintResponseDto();
      responseDto.setId(entity.getId());
      responseDto.setTitle(entity.getTitle());
      responseDto.setMessage(entity.getMessage());
      responseDto.setCreatedAt(entity.getCreatedAt());
      responseDto.setGuestId(entity.getGuest().getId());
      return responseDto;
   }

   public List<ComplaintResponseDto> convertEntityListToResponseDtos(List<Complaint> complaints) {
      return complaints.stream()
            .map(this::convertEntityToResponseDto)
            .collect(Collectors.toList());
   }

   public ComplaintResponseDto createComplaint(ComplaintRequestDto request) {

      Complaint entity = convertRequestDtoToEntity(request);
      Complaint savedComplaint = complaintRepository.save(entity);
      return convertEntityToResponseDto(savedComplaint);
   }

   public ComplaintResponseDto getComplaintById(Long id) {
      Complaint complaint = complaintRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Complaint not found with ID: " + id));
      return convertEntityToResponseDto(complaint);
   }

   public List<ComplaintResponseDto> getAllComplaints() {
      List<Complaint> complaints = complaintRepository.findAll();
      return convertEntityListToResponseDtos(complaints);
   }

   public ComplaintResponseDto updateComplaint(Long id, ComplaintRequestDto request) {
      Complaint complaint = complaintRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Complaint not found with ID: " + id));
      complaint.setTitle(request.getTitle());
      complaint.setMessage(request.getMessage());
      Complaint updatedComplaint = complaintRepository.save(complaint);
      return convertEntityToResponseDto(updatedComplaint);
   }

   public void deleteComplaint(Long id) {
      if (!complaintRepository.existsById(id)) {
         throw new RuntimeException("Complaint not found with ID: " + id);
      }
      complaintRepository.deleteById(id);
   }

}

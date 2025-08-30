package com.backend.hotel_management.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.backend.hotel_management.dto.request.HotelServingRequestDto;
import com.backend.hotel_management.dto.response.HotelServingResponseDto;
import com.backend.hotel_management.model.HotelServing;
import com.backend.hotel_management.repository.HotelServingRepository;

@Service
public class HotelServingService {

   @Autowired
   private HotelServingRepository hotelServingRepository;

   // Convert Request DTO to Entity
   private HotelServing convertToEntity(HotelServingRequestDto requestDto) {
      HotelServing hotelServing = new HotelServing();
      hotelServing.setName(requestDto.getName());
      hotelServing.setPrice(requestDto.getPrice());
      hotelServing.setDuration(requestDto.getDuration());
      hotelServing.setPricingType(requestDto.getPricingType());
      return hotelServing;
   }

   // Convert Entity to Response DTO
   private HotelServingResponseDto convertToResponseDto(HotelServing hotelServing) {
      return new HotelServingResponseDto(
            hotelServing.getId(),
            hotelServing.getName(),
            hotelServing.getPricingType(),
            hotelServing.getPrice(),
            hotelServing.getDuration());
   }

   // Convert List of Entities to List of Response DTOs
   private List<HotelServingResponseDto> convertToResponseDtoList(List<HotelServing> hotelServings) {
      return hotelServings.stream()
            .map(this::convertToResponseDto)
            .collect(Collectors.toList());
   }

   // Create new hotel service
   public HotelServingResponseDto createHotelServing(HotelServingRequestDto requestDto) {
      if (hotelServingRepository.existsByName(requestDto.getName())) {
         throw new RuntimeException("Hotel service with name " + requestDto.getName() + " already exists");
      }
      HotelServing hotelServing = convertToEntity(requestDto);
      HotelServing savedHotelServing = hotelServingRepository.save(hotelServing);
      return convertToResponseDto(savedHotelServing);
   }

   // Get all hotel services
   public List<HotelServingResponseDto> getAllHotelServings() {
      List<HotelServing> hotelServings = hotelServingRepository.findAll();
      return convertToResponseDtoList(hotelServings);
   }

   // Get hotel service by ID
   public HotelServingResponseDto getHotelServingById(Long id) {
      HotelServing entity = hotelServingRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Hotel service not found with id: " + id));
      return convertToResponseDto(entity);
   }

   // Update hotel service
   public HotelServingResponseDto updateHotelServing(Long id, HotelServingRequestDto requestDto) {
      HotelServing existingHotelServing = hotelServingRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Hotel service not found with id: " + id));

      // Update fields
      existingHotelServing.setName(requestDto.getName());
      existingHotelServing.setPrice(requestDto.getPrice());
      existingHotelServing.setDuration(requestDto.getDuration());
      existingHotelServing.setPricingType(requestDto.getPricingType());

      HotelServing updatedHotelServing = hotelServingRepository.save(existingHotelServing);
      return convertToResponseDto(updatedHotelServing);
   }

   // Delete hotel service
   public void deleteHotelServing(Long id) {
      if (!hotelServingRepository.existsById(id)) {
         throw new RuntimeException("Hotel service not found with id: " + id);
      }
      hotelServingRepository.deleteById(id);
   }

}
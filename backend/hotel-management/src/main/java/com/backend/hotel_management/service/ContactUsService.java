package com.backend.hotel_management.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.backend.hotel_management.dto.request.ContactUsRequestDto;
import com.backend.hotel_management.dto.response.ContactUsResponseDto;
import com.backend.hotel_management.model.ContactUs;
import com.backend.hotel_management.repository.ContactUsRepository;

@Service
public class ContactUsService {

   @Autowired
   private ContactUsRepository contactUsRepository;

   public ContactUs convertRequestDtoToEntity(ContactUsRequestDto requestDto) {

      ContactUs entity = new ContactUs();

      entity.setFirstName(requestDto.getFirstName());
      entity.setLastName(requestDto.getLastName());
      entity.setEmail(requestDto.getEmail());
      entity.setMessage(requestDto.getMessage());
      entity.setSubject(requestDto.getSubject());
      entity.setCreatedAt(LocalDateTime.now());

      return entity;
   }

   public ContactUsResponseDto convertEntityToResponseDto(ContactUs entity) {

      ContactUsResponseDto responseDto = new ContactUsResponseDto();

      responseDto.setId(entity.getId());
      responseDto.setFirstName(entity.getFirstName());
      responseDto.setLastName(entity.getLastName());
      responseDto.setEmail(entity.getEmail());
      responseDto.setMessage(entity.getMessage());
      responseDto.setSubject(entity.getSubject());
      responseDto.setCreatedAt(entity.getCreatedAt());

      return responseDto;
   }

   public List<ContactUsResponseDto> convertEntityListToResponseDtoList(List<ContactUs> entities) {
      return entities.stream()
            .map(this::convertEntityToResponseDto)
            .collect(Collectors.toList());
   }

   public ContactUsResponseDto createContactUs(ContactUsRequestDto requestDto) {
      ContactUs entity = convertRequestDtoToEntity(requestDto);
      ContactUs savedEntity = contactUsRepository.save(entity);
      return convertEntityToResponseDto(savedEntity);
   }

   public ContactUsResponseDto getContactUs(Long id) {
      ContactUs entity = contactUsRepository.findById(id).orElse(null);
      return convertEntityToResponseDto(entity);
   }

   public List<ContactUsResponseDto> getAllContactUs() {
      List<ContactUs> entities = contactUsRepository.findAll();
      return convertEntityListToResponseDtoList(entities);
   }

   public ContactUsResponseDto getContactUsByEmail(String email) {
      ContactUs entity = contactUsRepository.findByEmail(email);
      return convertEntityToResponseDto(entity);
   }

}

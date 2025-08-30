package com.backend.hotel_management.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend.hotel_management.dto.request.ContactUsRequestDto;
import com.backend.hotel_management.dto.response.ContactUsResponseDto;
import com.backend.hotel_management.service.ContactUsService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/hotel/contact-us")
@CrossOrigin("*")
public class ContactUsController {

   @Autowired
   private ContactUsService contactUsService;

   @PostMapping
   public ResponseEntity<ContactUsResponseDto> createContactUs(@Valid @RequestBody ContactUsRequestDto requestDto) {
      try {
         ContactUsResponseDto responseDto = contactUsService.createContactUs(requestDto);
         return new ResponseEntity<>(responseDto, HttpStatus.CREATED);
      } catch (Exception e) {
         return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
      }
   }

   @GetMapping("/{id}")
   public ResponseEntity<ContactUsResponseDto> getContactUsById(@PathVariable Long id) {
      try {
         ContactUsResponseDto responseDto = contactUsService.getContactUs(id);
         return new ResponseEntity<>(responseDto, HttpStatus.OK);
      } catch (Exception e) {
         return new ResponseEntity<>(HttpStatus.NOT_FOUND);
      }
   }

   @GetMapping("/{email}")
   public ResponseEntity<ContactUsResponseDto> getContactUsByEmail(@PathVariable String email) {
      try {
         ContactUsResponseDto responseDto = contactUsService.getContactUsByEmail(email);
         return new ResponseEntity<>(responseDto, HttpStatus.OK);
      } catch (Exception e) {
         return new ResponseEntity<>(HttpStatus.NOT_FOUND);
      }
   }

   @GetMapping
   public ResponseEntity<List<ContactUsResponseDto>> getAllContactUs() {
      try {
         List<ContactUsResponseDto> responseDtoList = contactUsService.getAllContactUs();
         return new ResponseEntity<>(responseDtoList, HttpStatus.OK);
      } catch (Exception e) {
         return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
      }
   }

}

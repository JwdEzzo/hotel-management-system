package com.backend.hotel_management.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend.hotel_management.dto.request.GuestLoginRequestDto;
import com.backend.hotel_management.dto.request.LoginRequestDto;
import com.backend.hotel_management.dto.response.GuestJwtResponseDto;
import com.backend.hotel_management.dto.response.JwtResponseDto;
import com.backend.hotel_management.service.EmployeeService;
import com.backend.hotel_management.service.GuestService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

   @Autowired
   private EmployeeService employeeService;

   @Autowired
   private GuestService guestService;

   @PostMapping("/login")
   public ResponseEntity<JwtResponseDto> login(@Valid @RequestBody LoginRequestDto loginRequest) {
      JwtResponseDto response = employeeService.login(loginRequest);
      return ResponseEntity.ok(response);
   }

   @PostMapping("/guestlogin")
   public ResponseEntity<GuestJwtResponseDto> guestLogin(@Valid @RequestBody GuestLoginRequestDto loginRequest) {
      GuestJwtResponseDto response = guestService.login(loginRequest);
      return ResponseEntity.ok(response);
   }
}
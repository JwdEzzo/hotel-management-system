package com.backend.hotel_management.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GuestJwtResponseDto {
    private String token;
    private String type = "Bearer";
    private String email;
    private String userType = "GUEST";

    public GuestJwtResponseDto(String token, String email) {
        this.token = token;
        this.email = email;
    }
}
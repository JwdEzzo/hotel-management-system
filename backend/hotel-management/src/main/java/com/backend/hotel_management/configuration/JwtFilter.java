package com.backend.hotel_management.configuration;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.backend.hotel_management.service.EmployeeDetailsService;
import com.backend.hotel_management.service.GuestDetailsService;
import com.backend.hotel_management.service.JwtService;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.security.SignatureException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtFilter extends OncePerRequestFilter {

   @Autowired
   private JwtService jwtService;

   @Autowired
   private EmployeeDetailsService employeeDetailsService;

   @Autowired
   private GuestDetailsService guestDetailsService;

   @Override
   protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
         throws ServletException, IOException {

      String authHeader = request.getHeader("Authorization");
      String token = null;
      String email = null;

      // Extract token safely
      if (authHeader != null && authHeader.startsWith("Bearer ")) {
         token = authHeader.substring(7);
         logger.info("Extracted JWT token: " + token);
      }

      // Only proceed if token exists
      if (token != null) {
         try {
            email = jwtService.extractUserName(token);
            logger.info("Extracted email from token: " + email);
         } catch (ExpiredJwtException e) {
            logger.warn("JWT token is expired: " + token);
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("{\"error\": \"Token expired\"}");
            return;
         } catch (SignatureException e) {
            logger.warn("JWT signature invalid: " + token);
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("{\"error\": \"Invalid token signature\"}");
            return;
         } catch (Exception e) {
            logger.warn("Unable to extract email from token: " + token, e);
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("{\"error\": \"Invalid token\"}");
            return;
         }
      }

      // Authenticate if email is present and no authentication exists
      if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
         UserDetails userDetails = null;

         try {
            // Extract role from JWT to determine which UserDetailsService to use
            String role = jwtService.extractRole(token);
            logger.info("Extracted role from token: " + role);

            if ("ROLE_GUEST".equals(role)) {
               userDetails = guestDetailsService.loadUserByUsername(email);
            } else {
               // Default to employee for ROLE_MANAGER, ROLE_EMPLOYEE, etc.
               userDetails = employeeDetailsService.loadUserByUsername(email);
            }

            if (jwtService.validateToken(token, userDetails)) {
               UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                     userDetails, null, userDetails.getAuthorities());
               authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
               SecurityContextHolder.getContext().setAuthentication(authToken);
               logger.info("Successfully authenticated user: " + email);
            } else {
               logger.warn("JWT token validation failed for user: " + email);
            }
         } catch (Exception e) {
            logger.warn("JWT authentication failed for user: " + email, e);
            // Don't throw exception, just continue without authentication
         }
      }

      filterChain.doFilter(request, response);
   }
}
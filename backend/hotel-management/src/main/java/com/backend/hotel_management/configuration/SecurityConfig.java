package com.backend.hotel_management.configuration;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.backend.hotel_management.service.EmployeeDetailsService;
import com.backend.hotel_management.service.GuestDetailsService;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

   @Autowired
   private EmployeeDetailsService employeeDetailsService;

   @Autowired
   private GuestDetailsService guestDetailsService;

   @Autowired
   private JwtFilter jwtFilter;

   @Bean
   public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
      return http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable()) // Disable CSRF for stateless JWT APIs
            .authorizeHttpRequests(requests -> requests
                  .requestMatchers("/api/auth/login").permitAll()
                  .requestMatchers("/api/hotel/guests/**").permitAll()
                  .requestMatchers("/api/hotel/apply-booking").permitAll()
                  .requestMatchers("/api/hotel/services/**").permitAll()
                  .requestMatchers("/api/hotel/rooms/**").permitAll()
                  .requestMatchers("/api/hotel/complaints/**").permitAll()
                  .requestMatchers("/api/hotel/employees/**").hasRole("MANAGER")
                  .requestMatchers("/api/hotel/reports/**").hasRole("MANAGER")
                  .requestMatchers("/api/auth/guestlogin").permitAll()
                  .requestMatchers("/api/hotel/update-booking/**").permitAll()
                  .requestMatchers("/api/hotel/bookings/**").permitAll()
                  .requestMatchers("/api/hotel/bookings/guest/**").permitAll()
                  .requestMatchers("/api/hotel/contact-us").permitAll()
                  .requestMatchers("/error").permitAll()
                  .anyRequest().authenticated() // All other requests need authentication
            )
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // Ensure stateless session
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class) // Add JWT filter
            .authenticationManager(customAuthenticationManager()) // Use custom authentication manager
            .build();
   }

   @Bean
   public CorsConfigurationSource corsConfigurationSource() {
      CorsConfiguration configuration = new CorsConfiguration();

      // 1. Allow specific origins (recommended over "*")
      // Make sure this matches your frontend's origin exactly
      configuration.setAllowedOriginPatterns(List.of("http://localhost:5173")); // Adjust port if needed (e.g., 3000)

      // 2. Allow necessary methods, INCLUDING OPTIONS for preflight
      configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));

      // 3. Allow headers ( "*" is generally okay for development)
      configuration.setAllowedHeaders(Arrays.asList("*"));

      // 4. Allow credentials (cookies, Authorization header)
      // This MUST be true because frontend uses credentials: "include"
      configuration.setAllowCredentials(true);

      // 5. (Optional) Expose headers the frontend might need to read from the response
      configuration.setExposedHeaders(List.of("Authorization")); // Useful if the backend sends custom headers

      // 6. Apply this configuration to all paths
      UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
      source.registerCorsConfiguration("/**", configuration);
      return source;
   }

   // Create a custom AuthenticationManager with multiple providers
   @Bean
   public AuthenticationManager customAuthenticationManager() {
      return new ProviderManager(Arrays.asList(
            employeeAuthenticationProvider(),
            guestAuthenticationProvider()));
   }

   @Bean
   public AuthenticationProvider employeeAuthenticationProvider() {
      DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
      provider.setPasswordEncoder(passwordEncoder());
      provider.setUserDetailsService(employeeDetailsService);
      return provider;
   }

   @Bean
   public AuthenticationProvider guestAuthenticationProvider() {
      DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
      provider.setPasswordEncoder(passwordEncoder());
      provider.setUserDetailsService(guestDetailsService);
      return provider;
   }

   @Bean
   public BCryptPasswordEncoder passwordEncoder() {
      return new BCryptPasswordEncoder(12);
   }
}
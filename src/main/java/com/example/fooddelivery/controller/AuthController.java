package com.example.fooddelivery.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.fooddelivery.dto.AuthResponse;
import com.example.fooddelivery.dto.LoginRequest;
import com.example.fooddelivery.dto.RegisterRequest;
import com.example.fooddelivery.service.AuthService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
	
	private final AuthService authService;

	public AuthController(AuthService authService) {
		this.authService = authService;
	}
	
	@PostMapping("/register")
	public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
		AuthResponse response = authService.register(request);
		return ResponseEntity.status(HttpStatus.CREATED).body(response);
	}
	
	@PostMapping("/login")
	public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
		AuthResponse response = authService.login(request);
		return ResponseEntity.ok(response);
	}
	
	@GetMapping("/me")
	public ResponseEntity<AuthResponse> getProfile(Authentication authentication) {
		AuthResponse response = authService.getProfile(authentication);
		return ResponseEntity.ok(response);
	}
	
}

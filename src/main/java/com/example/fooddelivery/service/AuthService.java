package com.example.fooddelivery.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.fooddelivery.config.JwtUtil;
import com.example.fooddelivery.dto.AuthResponse;
import com.example.fooddelivery.dto.LoginRequest;
import com.example.fooddelivery.dto.RegisterRequest;
import com.example.fooddelivery.exception.EmailAlreadyExistsException;
import com.example.fooddelivery.exception.UserNotFoundException;
import com.example.fooddelivery.model.User;
import com.example.fooddelivery.repository.UserRepository;

@Service
public class AuthService {
	
	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;
	private final JwtUtil jwtUtil;
	private final AuthenticationManager authenticationManager;
	
	
	
	public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil,
			AuthenticationManager authenticationManager) {
		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
		this.jwtUtil = jwtUtil;
		this.authenticationManager = authenticationManager;
	}

	public AuthResponse register(RegisterRequest request) {
		if(userRepository.existsByEmail(request.getEmail())) {
			throw new EmailAlreadyExistsException("Email already exists");
		}
		
		String hashedPassword = passwordEncoder.encode(request.getPassword());
		
		User user = new User(
				request.getName(),
				request.getEmail(),
				hashedPassword,
				request.getRole()
				);
		
		userRepository.save(user);
		
		String token = jwtUtil.generateToken(user.getEmail());
		
		return new AuthResponse(token, user.getName(), user.getEmail(), user.getRole());
	}
	
	public AuthResponse login(LoginRequest request) {
		authenticationManager.authenticate(
			    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
			);
		
		User user = userRepository.findByEmail(request.getEmail()).orElseThrow(() -> new UserNotFoundException("User not found"));

		
		String token = jwtUtil.generateToken(user.getEmail());
		
		return new AuthResponse(token, user.getName(), user.getEmail(), user.getRole());
	}
	
	public AuthResponse getProfile(Authentication auth) {
		String email = auth.getName();
		
		User user = userRepository.findByEmail(email).orElseThrow(() -> new UserNotFoundException("User not found"));
		
		return new AuthResponse(null, user.getName(), user.getEmail(), user.getRole());
	}
}
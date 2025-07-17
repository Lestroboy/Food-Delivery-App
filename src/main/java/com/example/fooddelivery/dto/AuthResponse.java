package com.example.fooddelivery.dto;

import com.example.fooddelivery.model.Role;

public class AuthResponse {
	
	private String token;
	private String name;
	private String email;
	private Role role;
	
	public AuthResponse() {

	}

	public AuthResponse(String token, String name, String email, Role role) {
		this.token = token;
		this.name = name;
		this.email = email;
		this.role = role;
	}

	public String getToken() {
		return token;
	}
	public void setToken(String token) {
		this.token = token;
	}

	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}

	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}

	public Role getRole() {
		return role;
	}
	public void setRole(Role role) {
		this.role = role;
	}
}
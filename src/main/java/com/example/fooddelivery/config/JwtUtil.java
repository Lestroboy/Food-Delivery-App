package com.example.fooddelivery.config;

import java.security.Key;
import java.util.Date;

import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {
	
	private final long EXPIRATION_TIME = 1000 * 60 * 60 * 24;
	private final Key key = Keys.secretKeyFor(SignatureAlgorithm.HS256);
	
	public String generateToken(String email) {
		return Jwts.builder()
				.setSubject(email)
				.setIssuedAt(new Date())
				.setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
				.signWith(key)
				.compact();
	}
	
	public String extractEmail(String token) {
		return getClaims(token).getSubject();
	}
	
	public boolean isTokenValid(String token) {
		try {
			getClaims(token);
			return true;
		} 
		catch(JwtException | IllegalArgumentException e) {
			return false;
		}
	}
	
	private Claims getClaims(String token) {
		return Jwts.parserBuilder()
				.setSigningKey(key)
				.build()
				.parseClaimsJws(token)
				.getBody();
	}
}
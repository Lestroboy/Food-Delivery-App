package com.example.fooddelivery.exception;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {
	
	private ResponseEntity<Object> buildErrorResponse(String message, HttpStatus status) {
		Map<String, Object> body = new HashMap<>();
		body.put("error", message);
		body.put("status", status.value());
		body.put("timestamp", LocalDateTime.now());
		return new ResponseEntity<>(body, status);
	}

    @ExceptionHandler(EmailAlreadyExistsException.class)
    public ResponseEntity<Object> handleEmailExists(EmailAlreadyExistsException ex) {
        return buildErrorResponse(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<Object> handleUserNotFound(UserNotFoundException ex) {
    	return buildErrorResponse(ex.getMessage(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Object> handleGeneral(Exception ex) {
    	return buildErrorResponse("Something went wrong. Please try again.", HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
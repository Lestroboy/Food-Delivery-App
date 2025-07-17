package com.example.fooddelivery.exception;


@SuppressWarnings("serial")
public class EmailAlreadyExistsException extends RuntimeException {
    public EmailAlreadyExistsException(String message) {
        super(message);
    }
}
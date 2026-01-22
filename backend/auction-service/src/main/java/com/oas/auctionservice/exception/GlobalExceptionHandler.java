package com.oas.auctionservice.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Object> handleRuntimeException(RuntimeException ex) {
        System.err.println("GlobalExceptionHandler caught exception: " + ex.getMessage());
        ex.printStackTrace();
        
        Map<String, Object> body = new HashMap<>();
        body.put("message", ex.getMessage());
        body.put("error", ex.getMessage());
        
        // Check if it's an access denied error
        if (ex.getMessage() != null && ex.getMessage().contains("Access Denied")) {
            return new ResponseEntity<>(body, HttpStatus.FORBIDDEN);
        }
        
        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
    }
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Object> handleException(Exception ex) {
        System.err.println("GlobalExceptionHandler caught general exception: " + ex.getMessage());
        ex.printStackTrace();
        
        Map<String, Object> body = new HashMap<>();
        body.put("message", "An error occurred: " + ex.getMessage());
        body.put("error", ex.getMessage());
        
        return new ResponseEntity<>(body, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
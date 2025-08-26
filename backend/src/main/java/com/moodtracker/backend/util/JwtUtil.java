package com.moodtracker.backend.util;

import org.springframework.stereotype.Component;

@Component
public class JwtUtil {
	// This will be replaced with Cognito's JWT validation
	
	public Long extractUserId(String token) {
		// This is just a mock
		return 1L;
	}
}

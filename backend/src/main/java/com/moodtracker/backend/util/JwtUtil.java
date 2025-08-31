package com.moodtracker.backend.util;

import org.springframework.stereotype.Component;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;

@Component
public class JwtUtil {

	/* */
	/**
	 * Extracts the user ID from an Authentication object
	 * 
	 * @param auth the authentication object containing the JWT principal
	 * @return the extracted user ID as a string
	 * @throws RuntimeException if the authentication object is null or does not
	 *                          contain a JWT principal
	 */
	public String extractUserId(Authentication auth) {
		if (auth == null || !(auth.getPrincipal() instanceof Jwt)) {
			throw new RuntimeException("No authentication found");
		}

		Jwt jwt = (Jwt) auth.getPrincipal();

		String userId = jwt.getClaimAsString("sub");
		if (userId != null) {
			return userId;
		}

		// fallback to subject
		return jwt.getSubject();
	}
}
package com.whispr.server.security.jwt;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Builder
@AllArgsConstructor
@Getter
@Setter
public class JwtResponse {
	private String token;
	private final String type = "Bearer";
	private Long id;
	private String username;
	private List<String> roles;
}

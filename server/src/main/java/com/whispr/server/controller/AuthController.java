package com.whispr.server.controller;

import com.whispr.server.entity.AppUser;
import com.whispr.server.security.UserDetailsImpl;
import com.whispr.server.security.jwt.JwtResponse;
import com.whispr.server.security.jwt.JwtUtils;
import com.whispr.server.service.ChatRoomService;
import com.whispr.server.service.MessageService;
import com.whispr.server.service.UserService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
@Slf4j
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {
    private final UserService userService;
    private final JwtUtils jwtUtils;
    private final AuthenticationManager authenticationManager;

    @PostMapping("/signUp") // "/create"
    public ResponseEntity<?> registerUser(@RequestBody UserRequest userRequest) {
        log.info("register data {}", userRequest.toString());
        if (userService.checkUser(userRequest.getUsername()).isPresent()) {
            return ResponseEntity
                    .badRequest()
                    .body("username is already taken");
        }
        return ResponseEntity.ok().body(userService.saveUser(userRequest.getUsername(), userRequest.getPassword()));
    }

    @PostMapping("/signIn")
    public ResponseEntity<?> authenticateUser(@RequestBody UserRequest userRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(userRequest.getUsername(), userRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        return ResponseEntity.ok(JwtResponse.builder()
                .token(jwt)
                .id(userDetails.getId())
                .username(userDetails.getUsername())
                .roles(roles).build());
    }

    @Data
    public static class UserRequest {
        String username;
        String password;
    }
}

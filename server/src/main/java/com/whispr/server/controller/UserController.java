package com.whispr.server.controller;

import com.whispr.server.model.AppUser;
import com.whispr.server.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.security.Principal;

@RestController
@RequiredArgsConstructor
@RequestMapping("/user")
@Slf4j
public class UserController {

    private final UserService userService;

    @PostMapping("/create")
    public ResponseEntity<AppUser> createUser(@RequestBody AppUser user) {
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().path("/user/create").toUriString());
        log.debug("user: " + user);
        return ResponseEntity.created(uri).body(userService.createUser(user));
    }


    @GetMapping("/get/{username}")
    public ResponseEntity<?> getUserByUsername(@PathVariable String username, Principal principal) {
        log.debug("user: " + principal.getName());
        if (!principal.getName().equals(username)) {
            return ResponseEntity.status(401).body("Invalid access token");
        }
        return ResponseEntity.ok().body(userService.getUserByUsername(username));
    }

    @GetMapping("/checkUsername/{username}")
    public ResponseEntity<?> checkUsername(@PathVariable String username) {
        System.out.println("found " + userService.checkUser(username));
        if (userService.checkUser(username).isPresent()) {
            return ResponseEntity.ok().body("found");
        }
        return ResponseEntity.status(400).body("not found");
    }

}

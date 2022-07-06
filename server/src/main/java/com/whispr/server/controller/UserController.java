package com.whispr.server.controller;

import com.whispr.server.model.AppUser;
import com.whispr.server.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;

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

    @GetMapping("/get/{userId}")
    public ResponseEntity<?> getUser(@PathVariable long userId) {
        return ResponseEntity.ok().body(userService.getUserById(userId));
    }
}

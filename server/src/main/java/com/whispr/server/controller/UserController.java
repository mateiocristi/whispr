package com.whispr.server.controller;

import com.whispr.server.model.AppUser;
import com.whispr.server.model.EndUser;
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

    @GetMapping("/login")
    public ResponseEntity<?> getUserByUsername(Principal principal) {
        return ResponseEntity.ok().body(userService.getUserByUsername(principal.getName()));
    }

    @GetMapping("/checkUsername/{username}")
    public ResponseEntity<?> checkUsername(@PathVariable String username) {
        System.out.println("found " + userService.checkUser(username));
        if (userService.checkUser(username).isPresent()) {
            return ResponseEntity.status(200).body("found");
        }
        return ResponseEntity.status(200).body("not found");
    }

    @GetMapping("getEndUser/{username}")
    public ResponseEntity<?> getEndUser(@PathVariable String username) {
        System.out.println("okokok");
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().path("/user/getEndUser/" + username).toUriString());
        EndUser endUser = EndUser.builder().build();
        if (userService.checkUser(username).isPresent()) {
            endUser.setUsername(username);
            endUser.setId(userService.getUserByUsername(username).getId());
            return ResponseEntity.created(uri).body(endUser);
        } else return ResponseEntity.status(403).body("user not found");
    }

}

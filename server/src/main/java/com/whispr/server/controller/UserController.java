package com.whispr.server.controller;

import com.whispr.server.model.AppUser;
import com.whispr.server.model.ChatRoom;
import com.whispr.server.model.EndUser;
import com.whispr.server.model.Message;
import com.whispr.server.repository.ChatRoomRepository;
import com.whispr.server.service.ChatRoomService;
import com.whispr.server.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.security.Principal;
import java.util.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/user")
@Slf4j
public class UserController {

    private final UserService userService;
    private final ChatRoomService chatRoomService;

    @PostMapping("/create")
    public ResponseEntity<AppUser> createUser(@RequestBody AppUser user) {
        log.debug("user: " + user);
        return ResponseEntity.ok().body(userService.createUser(user));
    }

    @GetMapping("/login")
    public ResponseEntity<?> getUserByUsername(Principal principal) {
        // TEST
//        Set<AppUser> users = new HashSet<AppUser>().add(userService.getUserByUsername("matei"));
        // END
        return ResponseEntity.ok().body(userService.getUserByUsername(principal.getName()));
    }

    @GetMapping("/checkUsername/{username}")
    public ResponseEntity<?> checkUsername(@PathVariable String username) {
        log.debug("found " + userService.checkUser(username));
        if (userService.checkUser(username).isPresent()) {
            return ResponseEntity.ok().body("found");
        }
        return ResponseEntity.ok().body("not found");
    }

    @GetMapping("getEndUser/{username}")
    public ResponseEntity<EndUser> getEndUser(@PathVariable String username) {
        EndUser endUser = EndUser.builder().build();
        if (userService.checkUser(username).isPresent()) {
            endUser.setUsername(username);
            endUser.setId(userService.getUserByUsername(username).getId());
            return ResponseEntity.ok().body(endUser);
        } return null;
    }

    @GetMapping("/getMessages/{room_id}")
    public ResponseEntity<Set<Message>> getMessagesByChatRoomId(@PathVariable String room_id) {
        Optional<ChatRoom> chatRoomOptional = chatRoomService.getRoomById(room_id);
        return chatRoomOptional.map(chatRoom -> ResponseEntity.status(HttpStatus.OK).body(chatRoom.getMessages())).orElseGet(() -> ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null));

    }

    @GetMapping("/getRoom/{user_id}/{endUser_id}")
    public ResponseEntity<ChatRoom> getChatRoomForUsers(@PathVariable long user_id, @PathVariable long endUser_id) {
        System.out.println("getting room");
        List<AppUser> users = new ArrayList<>();
        users.add(userService.getUserById(user_id));
        users.add(userService.getUserById(endUser_id));
        return ResponseEntity.status(HttpStatus.OK).body(chatRoomService.getRoomByUsers(users));
    }

}

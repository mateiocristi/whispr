package com.whispr.server.controller;

import com.whispr.server.model.AppUser;
import com.whispr.server.model.ChatRoom;
import com.whispr.server.model.EndUser;
import com.whispr.server.model.Message;
import com.whispr.server.service.ChatRoomService;
import com.whispr.server.service.MessageService;
import com.whispr.server.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@RestController
@RequiredArgsConstructor
@RequestMapping("/user")
@Slf4j
public class UserController {

    private final UserService userService;
    private final ChatRoomService chatRoomService;

    private final MessageService messageService;

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

    @GetMapping("/getEndUser/{username}")
    public ResponseEntity<EndUser> getEndUser(@PathVariable String username) {
        EndUser endUser = EndUser.builder().build();
        if (userService.checkUser(username).isPresent()) {
            endUser.setUsername(username);
            endUser.setId(userService.getUserByUsername(username).get().getId());
            return ResponseEntity.ok().body(endUser);
        }
        return null;
    }

    @GetMapping("/getMessages/{room_id}")
    public ResponseEntity<List<Message>> getMessagesByChatRoomId(@PathVariable String room_id) {
        return ResponseEntity.status(HttpStatus.OK).body(messageService.findAllByRoomId(room_id));

    }

    @GetMapping("/getRoom/{from}/{to}")
    public ResponseEntity<ChatRoom> getChatRoomForUsers(@PathVariable long from, @PathVariable long to) {
        AppUser fromUser = userService.getUserById(from).get();
        AppUser toUser = userService.getUserById(to).get();
        return ResponseEntity.status(HttpStatus.OK).body(chatRoomService.getRoomByUsers(fromUser, toUser));
    }

}

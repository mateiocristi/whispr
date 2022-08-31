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
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.springframework.http.HttpStatus.OK;

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
        return ResponseEntity.status(OK).body(messageService.findAllByRoomId(room_id));

    }

//    @GetMapping("/getChatRoom/{from_id}/{to_id}")
//    public ResponseEntity<ChatRoom> getChatRoomForUsersIds(@PathVariable long from_id, @PathVariable long to_id) {
//        AppUser fromUser = userService.getUserById(from_id).get();
//        AppUser toUser = userService.getUserById(to_id).get();
//        ChatRoom ch = chatRoomService.getRoomByUsers(fromUser, toUser);
//        return ResponseEntity.status(HttpStatus.OK).body(ch);
//    }

    @GetMapping("/getAllChatRooms/{userId}")
    public ResponseEntity<List<ChatRoom>> getAllChatRooms(@PathVariable long userId) {
        return ResponseEntity.status(OK).body(chatRoomService.getAllRooms(userId));
    }

    @GetMapping("/getChatRoom/{from_username}/{to_username}")
    public ResponseEntity<ChatRoom> getChatRoomForUsernames(@PathVariable String from_username, @PathVariable String to_username) {
        AppUser fromUser = userService.getUserByUsername(from_username).get();
        AppUser toUser = userService.getUserByUsername(to_username).get();
        ChatRoom ch = chatRoomService.getRoomByUsers(fromUser, toUser);
        return ResponseEntity.status(OK).body(ch);
    }

}

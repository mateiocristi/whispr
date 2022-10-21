package com.whispr.server.controller;

import com.whispr.server.entity.AppUser;
import com.whispr.server.entity.ChatRoom;
import com.whispr.server.model.ChatRoomModel;
import com.whispr.server.model.MessageModel;
import com.whispr.server.model.UserModel;
import com.whispr.server.service.ChatRoomService;
import com.whispr.server.service.MessageService;
import com.whispr.server.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.ArrayList;
import java.util.List;

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
        log.info("user: " + user);
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
        log.info("found " + userService.checkUser(username));
        if (userService.checkUser(username).isPresent()) {
            return ResponseEntity.ok().body("found");
        }
        return ResponseEntity.ok().body("not found");
    }

    @GetMapping("/getEndUser/{username}")
    public ResponseEntity<UserModel> getEndUser(@PathVariable String username) {
        UserModel endUser = UserModel.builder().build();
        if (userService.checkUser(username).isPresent()) {
            endUser.setUsername(username);
            endUser.setId(userService.getUserByUsername(username).get().getId());
            return ResponseEntity.ok().body(endUser);
        }
        return null;
    }

    @GetMapping("/getMessages/{roomId}")
    public ResponseEntity<List<MessageModel>> getMessagesByChatRoomId(@PathVariable String roomId) {
        List<MessageModel> messages = new ArrayList<>();
        messageService.findAllByRoomId(roomId).forEach(message -> messages.add(new MessageModel(message)));
        return ResponseEntity.status(OK).body(messages);
    }

    @PostMapping("/setMessagesRead/{roomId}/{userId}")
    public ResponseEntity<?> setMessagesReadForChatRoomUser(@PathVariable String roomId, @PathVariable long userId) {
        messageService.markMultipleMessagesAsRead(roomId, userId);
        return ResponseEntity.status(OK).body("success");
    }

    @PostMapping("/setMessageRead/{messageId}")
    public ResponseEntity<?> setMessageRead(@PathVariable long messageId) {
        messageService.markOneMessageAsRead(messageId);
        return ResponseEntity.status(OK).body("success");
    }

    @GetMapping("/getAllChatRooms/{userId}")
    public ResponseEntity<List<ChatRoomModel>> getAllChatRooms(@PathVariable long userId) {
        List<ChatRoomModel> rooms = new ArrayList<>();
        chatRoomService.getAllRoomsByUserId(userId).forEach(room -> rooms.add(new ChatRoomModel(room)));
        return ResponseEntity.status(OK).body(rooms);
    }

    @GetMapping("/getChatRoomWithUsernames/{from_username}/{to_username}")
    public ResponseEntity<ChatRoomModel> getChatRoomForUsernames(@PathVariable String from_username, @PathVariable String to_username) {
        AppUser fromUser = userService.getUserByUsername(from_username).get();
        AppUser toUser = userService.getUserByUsername(to_username).get();
        ChatRoom ch = chatRoomService.getRoomByUsers(fromUser, toUser);
        return ResponseEntity.status(OK).body(new ChatRoomModel(ch));
    }

    @GetMapping("/getChatRoomWithIds/{from_userId}/{to_userId}")
    public ResponseEntity<ChatRoomModel> getChatRoomForIds(@PathVariable long from_userId, @PathVariable long to_userId) {
        AppUser fromUser = userService.getUserById(from_userId).get();
        AppUser toUser = userService.getUserById(to_userId).get();
        ChatRoom ch = chatRoomService.getRoomByUsers(fromUser, toUser);
        return ResponseEntity.status(OK).body(new ChatRoomModel(ch));
    }

}

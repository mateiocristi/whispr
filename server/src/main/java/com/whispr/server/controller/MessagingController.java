package com.whispr.server.controller;

import com.whispr.server.model.AppUser;
import com.whispr.server.model.ChatRoom;
import com.whispr.server.model.Message;
import com.whispr.server.service.ChatRoomService;
import com.whispr.server.service.MessageService;
import com.whispr.server.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.Set;

@Controller
//@CrossOrigin(origins = "http://localhost:4200")
@Slf4j
public class MessagingController {

    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;
    @Autowired
    private ChatRoomService chatRoomService;
    @Autowired
    private MessageService messageService;
    @Autowired
    private UserService userService;

    @MessageMapping("/chat/{from}/{to}")
    public void sendMessage(@DestinationVariable long from, @DestinationVariable long to, String messageText) {
        log.debug("handling message: " + messageText + " to: " + to);
        // todo: get chat room or create it if it does not exist
        Set<AppUser> users = new HashSet<AppUser>();
        users.add(userService.getUserById(from));
        users.add(userService.getUserById(to));
        Message message = Message.builder().build();
        message.setMessageText(messageText);
        message.setTimestamp(System.currentTimeMillis());
        message.setUser(userService.getUserById(from));
        message.setRead(false);
        message.setRoom(chatRoomService.getRoomByUsers(users));
        messageService.saveMessage(message);
        simpMessagingTemplate.convertAndSend("/topic/messages/" + to, message);
    }

    @ResponseBody
    @PostMapping("/getMessages/{room_id}")
    public ResponseEntity<Set<Message>> getMessagesByChatRoomId(@PathVariable Long room_id) {
        ChatRoom chatRoom = chatRoomService.getRoomById(room_id);
        if (chatRoom != null)
            return ResponseEntity.ok().body(messageService.findAllByRoomId(room_id));
        else
            return ResponseEntity.ok().body(new HashSet<Message>());
    }
}

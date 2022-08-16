package com.whispr.server.controller;

import com.whispr.server.model.AppUser;
import com.whispr.server.model.ChatRoom;
import com.whispr.server.model.Message;
import com.whispr.server.service.ChatRoomService;
import com.whispr.server.service.MessageService;
import com.whispr.server.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@Controller
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
@Slf4j
public class MessagingController {

    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;
    private final ChatRoomService chatRoomService;
    private final MessageService messageService;
    private final UserService userService;

    @MessageMapping("/chat/{from}/{to}")
    public void sendMessage(@DestinationVariable long from, @DestinationVariable long to,@Payload String messageText) {
        log.info("handling message xx: " + messageText + " to: " + to);
        System.out.println("handling message: " + messageText + " to: " + to);
        // todo: get chat room or create it if it does not exist
        List<AppUser> roomUsers = new ArrayList<>();
        roomUsers.add(userService.getUserById(from));
        roomUsers.add(userService.getUserById(to));
        Message message = Message.builder().build();
        message.setMessageText(messageText);
        message.setTimestamp(System.currentTimeMillis());
//        message.setUser(userService.getUserById(from));
        message.setRead(false);
//        message.setRoom(chatRoomService.getRoomByUsers(roomUsers));

        messageService.saveMessage(message);
        simpMessagingTemplate.convertAndSend("/topic/messages/" + to, message);
    }

}

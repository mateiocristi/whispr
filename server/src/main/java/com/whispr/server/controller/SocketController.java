package com.whispr.server.controller;

import com.whispr.server.entity.AppUser;
import com.whispr.server.entity.ChatRoom;
import com.whispr.server.entity.Message;
import com.whispr.server.model.MessageModel;
import com.whispr.server.service.ChatRoomService;
import com.whispr.server.service.MessageService;
import com.whispr.server.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
@Slf4j
public class SocketController {

//    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;
    private final ChatRoomService chatRoomService;
    private final MessageService messageService;
    private final UserService userService;

    @MessageMapping("/chat/{from}/{to}")
    public void sendMessage(@DestinationVariable long from, @DestinationVariable long to,@Payload String messageText) {
        log.info("handling message: " + messageText + " from: " + from + " to: " + to);

        AppUser fromUser = userService.getUserById(from).get();
        AppUser toUser = userService.getUserById(to).get();

        ChatRoom chatRoom = chatRoomService.getChatRoomById(chatRoomService.calcRoomId(fromUser.getUsername(), toUser.getUsername())).get();
        Message message = Message.builder().build();

        message.setMessageText(messageText);
        message.setTimestamp(System.currentTimeMillis());
        message.setUser(fromUser);
        message.setRead(false);
        message.setRoom(chatRoom);
        messageService.saveMessage(message);

        log.info("message user id: " + message.getUser().getId());

        // to do: add the destination id to uri
        simpMessagingTemplate.convertAndSend("/topic/messages/" + toUser.getId() , new MessageModel(message));
        simpMessagingTemplate.convertAndSend("/topic/messages/" + fromUser.getId() , new MessageModel(message));
    }

}



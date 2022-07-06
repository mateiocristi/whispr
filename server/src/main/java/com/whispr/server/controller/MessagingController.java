package com.whispr.server.controller;

import com.whispr.server.model.MessageResponse;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class MessagingController {

    @MessageMapping("/chat/{roomId}")
    @SendTo("/chat/topic/{roomId}")
    public MessageResponse messageResponse(@DestinationVariable long roomId) {
        return new MessageResponse("new message");
    }
}

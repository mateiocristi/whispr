package com.whispr.server.model;

import com.whispr.server.entity.Message;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
public class MessageModel {
    private long id;
    private String messageText;
    private long timestamp;
    private boolean isRead;
    //    private MessageType type;
    private String chatRoomId;
    private long userId;

    public MessageModel(Message message) {
        this.id = message.getId();
        this.userId = message.getUser().getId();
        this.chatRoomId = message.getRoom().getId();
        this.messageText = message.getMessageText();
        this.timestamp = message.getTimestamp();
        this.isRead = message.isRead();
    }
}

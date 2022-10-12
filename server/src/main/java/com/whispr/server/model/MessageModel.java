package com.whispr.server.model;

import lombok.*;

import javax.persistence.*;

@Builder
@Getter
@Setter
@ToString
@RequiredArgsConstructor
@AllArgsConstructor
public class SimpleMessage {
    @Id
    private long id;
    private String messageText;
    private long timestamp;
    private boolean isRead;
    //    private MessageType type;
    private String chatRoomId;

    private long userId;

    public SimpleMessage(Message message) {
        this.id = message.getId();
        this.userId = message.getUser().getId();
        this.chatRoomId = message.getRoom().getId();
        this.messageText = message.getMessageText();
        this.timestamp = message.getTimestamp();
        this.isRead = message.isRead();
    }
}

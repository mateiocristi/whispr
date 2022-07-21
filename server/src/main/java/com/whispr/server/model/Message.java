package com.whispr.server.model;

import com.whispr.server.utils.MessageType;
import lombok.*;

import javax.persistence.*;

@Builder
@Getter
@Setter
@ToString
@RequiredArgsConstructor
@AllArgsConstructor
@Entity
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private String messageText;
    private long timestamp;
    private boolean isRead;
//    private MessageType type;
    @ManyToOne
    private ChatRoom room;
    @ManyToOne
    private AppUser user;

}

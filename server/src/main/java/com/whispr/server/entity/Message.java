package com.whispr.server.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
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
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;
    private String messageText;
    private long timestamp;
    private boolean isRead;
//    private MessageType type;
    @ManyToOne
    @JsonBackReference
    private ChatRoom room;
    @ManyToOne
    private AppUser user;

}

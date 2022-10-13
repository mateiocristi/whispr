package com.whispr.server.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
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

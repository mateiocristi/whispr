package com.whispr.server.model;

import lombok.*;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class ChatRoom {
    @Id
    private String id;
    @OneToMany
    private List<AppUser> users = new ArrayList<>();
    @OneToMany
    private Set<Message> messages = new HashSet<>();

//    public String calcRoomId(String username1, String username2) {
//        return username1.compareTo(username2) > 0 ? username1 + username2  : username2 + username1;
//    }

}

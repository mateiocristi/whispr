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
//    @OneToMany
//    private Set<Message> messages = new HashSet<>();
}

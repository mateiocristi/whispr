package com.whispr.server.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
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
    @ManyToMany
    private List<AppUser> users = new ArrayList<>();
    @OneToMany(mappedBy = "room")
    @JsonManagedReference
    private List<Message> messages = new ArrayList<>();
}

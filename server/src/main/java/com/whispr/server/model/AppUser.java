package com.whispr.server.model;

import lombok.*;

import javax.persistence.*;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Builder
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class AppUser {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;
    private String username;
    private String password;
    @ElementCollection(fetch = FetchType.EAGER)
    private Set<String> roles = new HashSet<>();
    @OneToMany
    @ToString.Exclude
    private Set<ChatRoom> rooms = new HashSet<>();
    @OneToMany
    @ToString.Exclude
    private Set<Message> messages = new HashSet<>();

}

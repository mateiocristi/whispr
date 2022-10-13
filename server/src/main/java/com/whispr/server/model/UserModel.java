package com.whispr.server.model;

import com.whispr.server.entity.AppUser;
import lombok.*;

import java.util.List;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class UserModel {
    private long id;
    private String username;
    public UserModel(AppUser user) {
        this.id = user.getId();
        this.username = user.getUsername();
    }
}

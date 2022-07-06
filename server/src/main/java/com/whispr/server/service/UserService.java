package com.whispr.server.service;

import com.whispr.server.model.AppUser;

import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface UserService {

    AppUser createUser(AppUser user);

    AppUser updateUser(AppUser user);

    Optional<AppUser> checkUser(String username);

    AppUser getUserByUsername(String username);

    AppUser getUserById(long id);
    
    Set<AppUser> getUsers();

}

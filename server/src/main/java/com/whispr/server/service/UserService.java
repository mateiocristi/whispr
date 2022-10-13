package com.whispr.server.service;

import com.whispr.server.entity.AppUser;

import java.util.Optional;
import java.util.Set;

public interface UserService {

    AppUser createUser(AppUser user);

    AppUser updateUser(AppUser user);

    Optional<AppUser> checkUser(String username);

    Optional<AppUser> getUserByUsername(String username);

    Optional<AppUser> getUserById(long id);

    Optional <AppUser> getUserRefById(long id);

    Set<AppUser> getUsers();

}

package com.whispr.server.service;

import com.whispr.server.model.AppUser;
import com.whispr.server.model.ChatRoom;

import java.util.Optional;
import java.util.Set;

public interface ChatRoomService {
    Set<ChatRoom> getAllRooms();
    Optional<ChatRoom> getRoomById(long id);
    void addNewRoom(ChatRoom room);
    ChatRoom getRoomByUsers(Set<AppUser> users);
}

package com.whispr.server.service;

import com.whispr.server.model.AppUser;
import com.whispr.server.model.ChatRoom;

import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface ChatRoomService {
    Set<ChatRoom> getAllRooms();
    Optional<ChatRoom> getRoomById(String id);
    void addNewRoom(ChatRoom room);
    ChatRoom getRoomByUsers(List<AppUser> users);
}

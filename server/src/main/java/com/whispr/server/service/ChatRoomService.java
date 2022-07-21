package com.whispr.server.service;

import com.whispr.server.model.AppUser;
import com.whispr.server.model.ChatRoom;

import java.util.Set;

public interface ChatRoomService {
    Set<ChatRoom> getAllRooms();
    ChatRoom getRoomById(long id);
    void addNewRoom(ChatRoom room);

    ChatRoom getRoomByUsers(Set<AppUser> users);
}

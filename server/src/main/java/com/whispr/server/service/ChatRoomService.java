package com.whispr.server.service;

import com.whispr.server.model.AppUser;
import com.whispr.server.model.ChatRoom;

import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface ChatRoomService {

    List<ChatRoom> getAllRooms(long id);

    Optional<ChatRoom> getChatRoomById(String id);

    ChatRoom getChatRoomRefById(String id);

    void addNewRoom(ChatRoom room);

    ChatRoom getRoomByUsers(AppUser user1, AppUser user2);

    default String calcRoomId(String username1, String username2) {
        return username1.compareTo(username2) > 0 ? username1 + username2  : username2 + username1;
    }
}

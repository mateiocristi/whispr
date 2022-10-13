package com.whispr.server.service;

import com.whispr.server.entity.AppUser;
import com.whispr.server.entity.ChatRoom;

import java.util.List;
import java.util.Optional;

public interface ChatRoomService {

    List<ChatRoom> getAllRoomsByUserId(long id);

    Optional<ChatRoom> getChatRoomById(String id);

    ChatRoom getChatRoomRefById(String id);

    void addNewRoom(ChatRoom room);

    ChatRoom getRoomByUsers(AppUser user1, AppUser user2);

    default String calcRoomId(String username1, String username2) {
        return username1.compareTo(username2) > 0 ? username1 + username2  : username2 + username1;
    }
}

package com.whispr.server.service;

import com.whispr.server.model.AppUser;
import com.whispr.server.model.ChatRoom;
import com.whispr.server.model.Message;
import com.whispr.server.repository.ChatRoomRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class ChatRoomServiceImp implements ChatRoomService {

    private final ChatRoomRepository roomRepo;

    @Override
    public Set<ChatRoom> getAllRooms() {
//        return (Set<ChatRoom>) roomRepo.findAll();
        return null;
    }

    @Override
    public Optional<ChatRoom> getChatRoomById(String id) {
        return roomRepo.findById(id);
    }

    @Override
    public ChatRoom getChatRoomRefById(String id) {
        return roomRepo.getReferenceById(id);
    }

    @Override
    public void addNewRoom(ChatRoom room) {
        roomRepo.save(room);
    }

    @Override
    public ChatRoom getRoomByUsers(AppUser user1, AppUser user2) {
        Optional<ChatRoom> chatRoomOptional = roomRepo.findById(calcRoomId(user1.getUsername(), user2.getUsername()));
        if (chatRoomOptional.isEmpty()) {
            return handleChatRoom(chatRoomOptional, user1, user2);
        } else
            return chatRoomOptional.get();
    }

    private ChatRoom handleChatRoom(Optional<ChatRoom> chatRoomOptional, AppUser user1, AppUser user2) {
        if (chatRoomOptional.isEmpty()) {
            log.info("chat room not found ... creating a new one");
            ChatRoom chatRoom = ChatRoom.builder().build();
            chatRoom.setUsers(Arrays.asList(user1, user2));
            chatRoom.setId(calcRoomId(user1.getUsername(), user2.getUsername()));
            return roomRepo.save(chatRoom);
        }
        else
            return chatRoomOptional.get();
    }
}
